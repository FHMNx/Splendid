import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getSubscriptionStatus } from "../features/subscription/subscriptionAPI";
import { useAuth } from "./AuthContext";

const SubscriptionContext = createContext();
export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
    const { isAuthenticated, token, logout } = useAuth();

    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastChecked, setLastChecked] = useState(null);

    const checkSubscription = useCallback(async () => {
        // Guard: Ensure both isAuthenticated and a valid token exist
        if (!isAuthenticated || !token) {
            setSubscription(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await getSubscriptionStatus();
            setSubscription(res.data);
            setLastChecked(Date.now());
        } catch (error) {
            const status = error?.response?.status;

            // Gracefully handle 401 / 403 (expired or invalid token)
            if (status === 401 || status === 403) {
                console.warn("Subscription check: Session expired or unauthorized. Clearing stale auth.");
                setSubscription(null);
                if (logout) {
                    logout();
                }
            } else {
                console.error("Subscription fetch error:", error?.message || error);
                setSubscription(null);
            }
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, token, logout]);

    // Sync on authentication status change
    useEffect(() => {
        if (isAuthenticated && token) {
            checkSubscription();
        } else {
            setSubscription(null);
            setLastChecked(null);
            setIsLoading(false);
        }
    }, [isAuthenticated, token, checkSubscription]);

    // Periodic recheck (every 30 mins) only for active authenticated sessions
    useEffect(() => {
        if (!isAuthenticated || !token) return;

        const interval = setInterval(() => {
            checkSubscription();
        }, 30 * 60 * 1000); // 30 minutes

        return () => clearInterval(interval);
    }, [isAuthenticated, token, checkSubscription]);

    const value = {
        subscription,
        isLoading,
        lastChecked,
        checkSubscription,
        isActive: subscription?.isActive ?? false,
        daysRemaining: subscription?.daysRemaining ?? 0,
        plan: subscription?.plan ?? null,
        status: subscription?.status ?? null,
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
};