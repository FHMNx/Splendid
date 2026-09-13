import api from "../api/axios";

const PLAN_PRICES = {
  MONTHLY:     "499.00",
  HALF_YEARLY: "2499.00",
  YEARLY:      "3999.00",
};

const PLAN_LABELS = {
  MONTHLY:     "Monthly Plan - Splendid",
  HALF_YEARLY: "Half Yearly Plan - Splendid",
  YEARLY:      "Yearly Plan - Splendid",
};

export const launchPayHereCheckout = async (user, planKey, onSuccess, onDismissed, onError) => {
  const amount   = PLAN_PRICES[planKey];
  const currency = "LKR";
  const orderId  = `${user.id}_${planKey}_${Date.now()}`;

  try {
    // get hash from backend
    const res = await api.post("/payments/payhere/hash", {
      orderId,
      amount,
      currency,
    });

    const { hash, merchantId } = res.data.data;

    // build PayHere payment object
    const payment = {
      sandbox:     true,
      merchant_id: merchantId,
      return_url:  window.location.origin + "/dashboard",
      cancel_url:  window.location.origin + "/packages",
      notify_url:  import.meta.env.VITE_PAYHERE_NOTIFY_URL,

      order_id:    orderId,
      items:       PLAN_LABELS[planKey],
      amount:      amount,
      currency:    currency,
      hash:        hash,

      first_name:  user.firstName,
      last_name:   user.lastName,
      email:       user.email,
      phone:       "0771234567",
      address:     "N/A",
      city:        "Colombo",
      country:     "Sri Lanka",

      custom_1:    String(user.id),
      custom_2:    planKey,
    };

    // set callbacks
    window.payhere.onCompleted = (orderId) => {
      if (onSuccess) onSuccess(orderId);
    };

    window.payhere.onDismissed = () => {
      if (onDismissed) onDismissed();
    };

    window.payhere.onError = (error) => {
      if (onError) onError(error);
    };

    // launch popup
    window.payhere.startPayment(payment);

  } catch (error) {
    if (onError) onError(error);
  }
};