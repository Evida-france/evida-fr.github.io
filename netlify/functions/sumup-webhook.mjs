import { checkoutStore, orderStore, sendConfirmation, verifySumUpCheckout } from "../lib/orders.mjs";

export async function handler(event) {
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
    if (checkout.status === "PAID") { order.status = "paid"; order.paidAt ||= order.updatedAt; order = await sendConfirmation(order); }
    else if (["FAILED", "EXPIRED"].includes(checkout.status)) order.status = checkout.status.toLowerCase();
    await store.setJSON(orderId, order);
    return { statusCode: 204, body: "" };
  } catch (error) { console.error("SumUp webhook:", error); return { statusCode: 204, body: "" }; }
}
