import api from "../../api/axios";

export const getSubscriptionStatus = async () => {
  const response = await api.get("/subscription/status");
  return response.data;
};

export const activateSubscription = async (userId, plan) => {
  const response = await api.put(
    `/admin/users/${userId}/subscription`,
    { plan }
  );
  return response.data;
};