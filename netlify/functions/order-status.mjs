import { configureBlobs, jsonHeaders, orderStore, publicOrder, sendConfirmation, sendShippingConfirmation, verifySumUpCheckout } from "../lib/orders.mjs";
import { fulfillPaidOrderWithCJ, syncCJOrder } from "../lib/cj.mjs";

export async function handler(event) {
  configureBlobs(event);
  const headers = jsonHeaders(event.headers?.origin || "");
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "GET") return { statusCode: 405, headers, body: JSON.stringify({ error: "Méthode non autorisée." }) };

  try {
    const id = String(event.queryStringParameters?.order || "");
    const token = String(event.queryStringParameters?.token || "");
    const store = orderStore();
    let order = await store.get(id, { type: "json" });

    if (!order || !token || token !== order.accessToken) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: "Commande introuvable." }) };
    }

    if (order.paymentStatus === "PENDING" && order.checkoutId) {
      const checkout = await verifySumUpCheckout(order.checkoutId);
      if (checkout?.status) {
        order.paymentStatus = checkout.status;
        order.updatedAt = new Date().toISOString();
        if (checkout.status === "PAID") {
          order.status = "paid";
          order.paidAt ||= order.updatedAt;
          order = await sendConfirmation(order);
          order = await fulfillPaidOrderWithCJ(order);
        }
      }
    }

    if (order.paymentStatus === "PAID") {
      order = await syncCJOrder(order);
      if (order.trackingNumber && !order.shippingEmailSentAt) order = await sendShippingConfirmation(order);
    }

    await store.setJSON(id, order);
    return { statusCode: 200, headers, body: JSON.stringify({ order: publicOrder(order) }) };
  } catch (error) {
    console.error("order-status:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Impossible de vérifier la commande." }) };
  }
}
