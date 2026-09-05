import { getStore } from "@netlify/blobs";

export const orderStore = () => getStore({ name: "evida-orders", consistency: "strong" });
export const photoStore = () => getStore({ name: "evida-private-photos", consistency: "strong" });
export const checkoutStore = () => getStore({ name: "evida-checkout-index", consistency: "strong" });
export const customerStore = () => getStore({ name: "evida-customers", consistency: "strong" });
export const customerTokenStore = () => getStore({ name: "evida-customer-tokens", consistency: "strong" });

export const jsonHeaders = (origin = "") => ({
  "Access-Control-Allow-Origin": ["https://evida-france.github.io", "https://evida-france.netlify.app"].includes(origin)
    ? origin
    : "https://evida-france.github.io",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
});

export const response = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  body: JSON.stringify(body)
});

export function cleanText(value, max = 200) {
  return String(value ?? "").trim().replace(/[<>]/g, "").slice(0, max);
}

export function publicOrder(order) {
  return {
    id: order.id,
    createdAt: order.createdAt,
    paidAt: order.paidAt || null,
    status: order.status,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    trackingNumber: order.trackingNumber || "",
    trackingUrl: order.trackingUrl || "",
    carrier: order.carrier || "",
    total: order.total,
    currency: order.currency,
    items: order.items.map(({ photoKey, ...item }) => ({ ...item, hasPhoto: Boolean(photoKey) }))
  };
}

export async function verifySumUpCheckout(checkoutId) {
  const apiKey = process.env.SUMUP_API_KEY;
  if (!apiKey || !checkoutId) return null;
  const result = await fetch(`https://api.sumup.com/v0.1/checkouts/${encodeURIComponent(checkoutId)}`, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  if (!result.ok) return null;
  return result.json();
}

export async function sendConfirmation(order) {
  if (order.confirmationSentAt) return order;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EVIDA_FROM_EMAIL;
  if (!apiKey || !from) return { ...order, emailStatus: "configuration_required" };

  const lines = order.items.map(item => `${item.quantity} × ${item.name}`).join("<br>");
  const accountLine = order.accountToken ? `<p><a href="https://evida-france.github.io/evida-fr.github.io/account.html?token=${order.accountToken}">Accéder à mon espace ÉVIDA</a></p>` : "";
  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [order.customer.email],
      subject: `Commande ÉVIDA ${order.id} confirmée`,
      html: `<h1>Merci pour votre commande</h1><p>Bonjour ${order.customer.firstName},</p><p>Votre paiement est confirmé.</p><p><strong>Commande :</strong> ${order.id}</p><p>${lines}</p><p><strong>Total :</strong> ${(order.total / 100).toFixed(2).replace(".", ",")} €</p><p>Nous vous écrirons dès l’expédition de votre commande.</p>${accountLine}<p>ÉVIDA</p>`
    })
  });
  if (!result.ok) return { ...order, emailStatus: "failed" };
  return { ...order, emailStatus: "sent", confirmationSentAt: new Date().toISOString() };
}

export async function sendShippingConfirmation(order) {
  if (order.shippingEmailSentAt || !order.customer?.email) return order;
  const apiKey = process.env.RESEND_API_KEY, from = process.env.EVIDA_FROM_EMAIL;
  if (!apiKey || !from) return { ...order, shippingEmailStatus: "configuration_required" };
  const tracking = order.trackingUrl ? `<p><a href="${order.trackingUrl}">Suivre mon colis</a></p>` : `<p>Numéro de suivi : ${order.trackingNumber || "à venir"}</p>`;
  const result = await fetch("https://api.resend.com/emails", { method:"POST", headers:{Authorization:`Bearer ${apiKey}`,"Content-Type":"application/json"}, body:JSON.stringify({from,to:[order.customer.email],subject:`Votre commande ÉVIDA ${order.id} est expédiée`,html:`<h1>Votre commande est en route</h1><p>Bonjour ${order.customer.firstName},</p><p>Votre commande ${order.id} a été confiée à ${order.carrier || "notre transporteur"}.</p>${tracking}<p>ÉVIDA</p>`}) });
  return result.ok ? { ...order, shippingEmailStatus:"sent", shippingEmailSentAt:new Date().toISOString() } : { ...order, shippingEmailStatus:"failed" };
}
