const PRODUCTS = {
  206: { name: "Plaid personnalisé — portrait d’animal", unit_amount: 3990 },
  207: { name: "Bijou personnalisé — portrait d’animal", unit_amount: 2490 },
  208: { name: "Pack complet anti-poils — 4 pièces", unit_amount: 2990 }
};

const ALLOWED_ORIGINS = [
  "https://evida-france.github.io",
  "https://evida-france.netlify.app"
];

function corsHeaders(origin = "") {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin)
      ? origin
      : "https://evida-france.github.io",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };
}

export async function handler(event) {
  const headers = corsHeaders(event.headers?.origin || "");

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Méthode non autorisée." })
    };
  }

  try {
    const apiKey = process.env.SUMUP_API_KEY;
    const merchantCode = process.env.SUMUP_MERCHANT_CODE;
    if (!apiKey || !merchantCode) {
      throw new Error("Configuration SumUp incomplète.");
    }

    const body = JSON.parse(event.body || "{}");
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Votre panier est vide." })
      };
    }

    let subtotal = 0;
    const summary = [];

    for (const item of items) {
      const id = Number(item.id);
      const product = PRODUCTS[id];
      if (!product) throw new Error(`Produit ÉVIDA invalide : ${id}`);

      const rawQuantity = Number(item.quantity ?? item.qty ?? 1);
      const quantity = Math.max(
        1,
        Math.min(10, Number.isFinite(rawQuantity) ? Math.floor(rawQuantity) : 1)
      );
      subtotal += product.unit_amount * quantity;
      summary.push(`${quantity}× ${product.name}`);
    }

    const shipping = subtotal >= 5000 ? 0 : 490;
    const total = subtotal + shipping;
    const reference = `EVIDA-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const frontendUrl = "https://evida-france.github.io/evida-fr.github.io/";

    const response = await fetch("https://api.sumup.com/v0.1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        checkout_reference: reference,
        amount: Number((total / 100).toFixed(2)),
        currency: "EUR",
        merchant_code: merchantCode,
        description: `Commande ÉVIDA — ${summary.join(", ")}`.slice(0, 500),
        redirect_url: `${frontendUrl}?commande=succes&reference=${encodeURIComponent(reference)}`,
        hosted_checkout: { enabled: true }
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.hosted_checkout_url) {
      console.error("SumUp API error:", response.status, data);
      throw new Error(data?.message || "SumUp n’a pas pu ouvrir le paiement.");
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        url: data.hosted_checkout_url,
        checkoutId: data.id,
        reference
      })
    };
  } catch (error) {
    console.error("SumUp checkout error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error?.message || "Impossible de créer le paiement SumUp."
      })
    };
  }
}
