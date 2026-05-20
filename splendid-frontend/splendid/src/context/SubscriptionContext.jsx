import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getSubscriptionStatus } from "../features/subscription/subscriptionAPI";
import { useAuth } from "./AuthContext";

const SubscriptionContext = createContext();
export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();

    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastChecked, setLastChecked] = useState(null);

    const checkSubscription = useCallback(async () => {
        if (!isAuthenticated) return;

        setIsLoading(true);
        try {
            const res = await getSubscriptionStatus();
            console.log("Subscription data:", res.data);
            setSubscription(res.data);
            setLastChecked(Date.now());
        } catch(error) {
            console.error("Subscription fetch error:", error);
            setSubscription(null);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    // check on login
    useEffect(() => {
        if (isAuthenticated) {
            checkSubscription();
        } else {
            setSubscription(null);
            setLastChecked(null);
            setIsLoading(true);
        }
    }, [isAuthenticated]);

    // recheck every 30 minutes
    useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(() => {
            checkSubscription();
        }, 30 * 60 * 1000); // 30 minutes

        return () => clearInterval(interval);
    }, [isAuthenticated, checkSubscription]);

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