import { Navigate, Outlet } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";
import { useAuth } from "../context/AuthContext";

const SubscriptionGuard = () => {
    const { isAuthenticated, user } = useAuth();
    const { subscription, isLoading } = useSubscription();

    // still loading
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
            </div>
        );
    }

    // admins always get through — no subscription needed
    if (user?.role === "ADMIN") {
        return <Outlet />;
    }

    // still waiting for subscription data
    if (isAuthenticated && subscription === null) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
            </div>
        );
    }

    // subscription expired — hard redirect
    if (subscription && !subscription.isActive) {
        return <Navigate to="/packages" replace />;
    }

    return <Outlet />;
};

export default SubscriptionGuard;