import { checkoutStore, configureBlobs, orderStore, sendConfirmation, sendShippingConfirmation, verifySumUpCheckout } from "../lib/orders.mjs";
import { fulfillPaidOrderWithCJ, syncCJOrder } from "../lib/cj.mjs";

export async function handler(event) {
  configureBlobs(event);
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "" };
  try {
    const payload = JSON.parse(event.body || "{}");
    if (payload.event_type !== "CHECKOUT_STATUS_CHANGED" || !payload.id) return { statusCode: 204, body: "" };
    const checkout = await verifySumUpCheckout(payload.id);
    if (!checkout) return { statusCode: 204, body: "" };
    const orderId = await checkoutStore().get(payload.id, { type: "text" });
    if (!orderId) return { statusCode: 204, body: "" };

    const store = orderStore();
    let order = await store.get(orderId, { type: "json" });
    if (!order) return { statusCode: 204, body: "" };

    order.paymentStatus = checkout.status;
    order.updatedAt = new Date().toISOString();

    if (checkout.status === "PAID") {
      order.status = "paid";
      order.paidAt ||= order.updatedAt;
      order = await sendConfirmation(order);
      await store.setJSON(orderId, order);

      // Après confirmation SumUp seulement : création de la commande fournisseur CJ.
      order = await fulfillPaidOrderWithCJ(order);
      order = await syncCJOrder(order);
      if (order.trackingNumber && !order.shippingEmailSentAt) order = await sendShippingConfirmation(order);
    } else if (["FAILED", "EXPIRED"].includes(checkout.status)) {
      order.status = checkout.status.toLowerCase();
    }

    await store.setJSON(orderId, order);
    return { statusCode: 204, body: "" };
  } catch (error) {
    console.error("SumUp/CJ webhook:", error);
    return { statusCode: 204, body: "" };
  }
}
