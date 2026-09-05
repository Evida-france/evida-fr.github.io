import { customerStore, customerTokenStore, jsonHeaders, orderStore, publicOrder } from "../lib/orders.mjs";

export async function handler(event) {
  const headers = jsonHeaders(event.headers?.origin || "");
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "GET") return { statusCode: 405, headers, body: JSON.stringify({ error: "Méthode non autorisée." }) };
  try {
    const token = String(event.queryStringParameters?.token || "");
    if (!/^[a-f0-9]{64}$/.test(token)) throw new Error();
    const emailKey = await customerTokenStore().get(token, { type: "text" });
    const customer = emailKey ? await customerStore().get(emailKey, { type: "json" }) : null;
    if (!customer?.accountEnabled || customer.accountToken !== token) return { statusCode: 404, headers, body: JSON.stringify({ error: "Espace client introuvable." }) };
    const orders = [];
    for (const id of (customer.orders || []).slice(-50).reverse()) {
      const order = await orderStore().get(id, { type: "json" });
      if (order?.paymentStatus === "PAID") orders.push(publicOrder(order));
    }
    return { statusCode: 200, headers, body: JSON.stringify({ customer: { firstName: customer.firstName, marketingConsent: customer.marketingConsent }, orders }) };
  } catch { return { statusCode: 404, headers, body: JSON.stringify({ error: "Lien privé invalide ou expiré." }) }; }
}
