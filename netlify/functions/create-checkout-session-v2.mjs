import { createHash, randomBytes, randomUUID } from "node:crypto";
import { checkoutStore, cleanText, customerStore, customerTokenStore, jsonHeaders, orderStore, photoStore } from "../lib/orders.mjs";

const PRODUCTS = {
  206: { name: "Plaid personnalisé — portrait d’animal", unitAmount: 3990, personalized: true },
  207: { name: "Bijou personnalisé — portrait d’animal", unitAmount: 2490, personalized: true },
  208: { name: "Pack complet anti-poils — 4 pièces", unitAmount: 2990, personalized: false }
};
const FRONTEND_URL = "https://evida-france.github.io/evida-fr.github.io/";
const FUNCTION_URL = "https://evida-france.netlify.app/.netlify/functions";
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "")); }
function decodePhoto(photo, orderId, productId) {
  if (!photo?.data || !ALLOWED_IMAGE_TYPES.has(photo.type)) throw new Error("Photo personnalisée manquante ou invalide.");
  const match = String(photo.data).match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error("Format de photo invalide.");
  const bytes = Buffer.from(match[2], "base64");
  if (!bytes.length || bytes.length > 3 * 1024 * 1024) throw new Error("La photo doit peser moins de 3 Mo.");
  return { key: `${orderId}/${productId}-${randomUUID()}`, bytes, type: match[1] };
}

export async function handler(event) {
  const headers = jsonHeaders(event.headers?.origin || "");
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Méthode non autorisée." }) };
  try {
    const apiKey = process.env.SUMUP_API_KEY;
    const merchantCode = process.env.SUMUP_MERCHANT_CODE;
    if (!apiKey || !merchantCode) throw new Error("Configuration SumUp incomplète.");
    const body = JSON.parse(event.body || "{}");
    const rawItems = Array.isArray(body.items) ? body.items : [];
    const customer = {
      firstName: cleanText(body.customer?.firstName, 80), lastName: cleanText(body.customer?.lastName, 80),
      email: cleanText(body.customer?.email, 160).toLowerCase(), address: cleanText(body.customer?.address, 180),
      postalCode: cleanText(body.customer?.postalCode, 12), city: cleanText(body.customer?.city, 100), country: "FR"
    };
    if (!rawItems.length) throw new Error("Votre panier est vide.");
    if (!customer.firstName || !customer.lastName || !validEmail(customer.email) || !customer.address || !customer.postalCode || !customer.city) throw new Error("Veuillez compléter correctement vos coordonnées de livraison.");
    if (body.photoConsent !== true || body.salesConsent !== true) throw new Error("Les confirmations obligatoires doivent être acceptées.");

    const orderId = `EVIDA-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 8).toUpperCase()}`;
    const accessToken = randomBytes(24).toString("hex");
    const items = [];
    let subtotal = 0;
    for (const raw of rawItems) {
      const id = Number(raw.id), product = PRODUCTS[id];
      if (!product) throw new Error(`Produit ÉVIDA invalide : ${id}`);
      const quantity = Math.max(1, Math.min(10, Math.floor(Number(raw.quantity || 1))));
      if (product.personalized && quantity !== 1) throw new Error("Ajoutez séparément chaque article personnalisé afin d’utiliser une photo différente.");
      let photoKey = "";
      if (product.personalized) {
        const decoded = decodePhoto(raw.personalization?.photo, orderId, id);
        await photoStore().set(decoded.key, decoded.bytes, { metadata: { contentType: decoded.type, orderId, productId: id } });
        photoKey = decoded.key;
      }
      const personalization = product.personalized ? {
        text: cleanText(raw.personalization?.text, 80), finish: cleanText(raw.personalization?.finish, 40),
        size: cleanText(raw.personalization?.size, 40), photoValidated: raw.personalization?.photoValidated === true
      } : null;
      if (product.personalized && !personalization.photoValidated) throw new Error("Veuillez valider l’aperçu de votre photo.");
      subtotal += product.unitAmount * quantity;
      items.push({ id, name: product.name, unitAmount: product.unitAmount, quantity, personalization, photoKey });
    }
    const shipping = subtotal >= 5000 ? 0 : 490, total = subtotal + shipping, now = new Date().toISOString();
    const createAccount = body.createAccount === true;
    const marketingConsent = body.marketingConsent === true;
    const emailKey = createHash("sha256").update(customer.email).digest("hex");
    let accountToken = "";
    if (createAccount || marketingConsent) {
      const customers = customerStore();
      const existing = await customers.get(emailKey, { type: "json" });
      accountToken = existing?.accountToken || randomBytes(32).toString("hex");
      const record = {
        email: customer.email, firstName: customer.firstName, lastName: customer.lastName, accountToken,
        accountEnabled: Boolean(existing?.accountEnabled || createAccount),
        marketingConsent: marketingConsent ? true : Boolean(existing?.marketingConsent),
        marketingConsentAt: marketingConsent ? now : existing?.marketingConsentAt || null,
        orders: [...new Set([...(existing?.orders || []), orderId])], updatedAt: now, createdAt: existing?.createdAt || now
      };
      await customers.setJSON(emailKey, record);
      await customerTokenStore().set(accountToken, emailKey);
    }
    let order = {
      id: orderId, accessToken, createdAt: now, updatedAt: now, status: "awaiting_payment", paymentStatus: "PENDING",
      fulfillmentStatus: "not_started", currency: "EUR", subtotal, shipping, total, customer, items,
      consent: { photoProcessing: body.photoConsent === true, personalizedSale: body.salesConsent === true, marketing: marketingConsent, acceptedAt: now },
      accountRequested: createAccount, accountToken: createAccount ? accountToken : "", trackingNumber: "", trackingUrl: "", carrier: "", emailStatus: "waiting_payment"
    };
    const sumup = await fetch("https://api.sumup.com/v0.1/checkouts", {
      method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ checkout_reference: orderId, amount: Number((total / 100).toFixed(2)), currency: "EUR", merchant_code: merchantCode,
        description: `Commande ÉVIDA ${orderId}`, return_url: `${FUNCTION_URL}/sumup-webhook`,
        redirect_url: `${FRONTEND_URL}?commande=retour&order=${encodeURIComponent(orderId)}&token=${accessToken}`, hosted_checkout: { enabled: true } })
    });
    const data = await sumup.json().catch(() => ({}));
    if (!sumup.ok || !data.hosted_checkout_url || !data.id) throw new Error(data?.message || "SumUp n’a pas pu ouvrir le paiement.");
    order = { ...order, checkoutId: data.id, checkoutUrl: data.hosted_checkout_url };
    await orderStore().setJSON(orderId, order);
    await checkoutStore().set(data.id, orderId);
    return { statusCode: 200, headers, body: JSON.stringify({ url: data.hosted_checkout_url, checkoutId: data.id, orderId, accessToken }) };
  } catch (error) {
    console.error("EVIDA checkout:", error);
    return { statusCode: 400, headers, body: JSON.stringify({ error: error?.message || "Impossible de créer le paiement SumUp." }) };
  }
}
