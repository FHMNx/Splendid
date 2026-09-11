import api from "../../api/axios";

/**
 * Submit authenticated contact message to backend
 * @param {{ subject: string, message: string }} payload
 * @returns {Promise<any>}
 */
export const submitContactMessage = async ({ subject, message }) => {
  const response = await api.post("/contact", { subject, message });
  return response.data;
};
