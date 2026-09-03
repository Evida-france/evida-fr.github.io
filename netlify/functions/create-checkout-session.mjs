import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRODUCTS = {
  201: { name: "Pommeau de douche filtrant", unit_amount: 2990 },
  202: { name: "Rideau occultant portable", unit_amount: 3990 },
  203: { name: "Walking Pad compact", unit_amount: 19990 },
  204: { name: "Nettoyeur textile injecteur-extracteur", unit_amount: 14990 },
  205: { name: "Robot lave-vitres automatique", unit_amount: 11990 },
  206: { name: "Plaid personnalisé — portrait d’animal", unit_amount: 5990 },
  207: { name: "Bijou personnalisé — portrait d’animal", unit_amount: 3990 },
  208: { name: "Pack complet anti-poils — 4 pièces", unit_amount: 3490 }
};

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Méthode non autorisée." })
    };
  }

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY manquante.");
    }

    const body = JSON.parse(event.body || "{}");
    const items = Array.isArray(body.items) ? body.items : [];

    if (!items.length) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Votre panier est vide." })
      };
    }

    let subtotal = 0;
    const line_items = items.map(item => {
      const id = Number(item.id);
      const product = PRODUCTS[id];

      if (!product) {
        throw new Error(`Produit ÉVIDA invalide : ${id}`);
      }

      const rawQuantity = Number(item.quantity ?? item.qty ?? 1);
      const quantity = Math.max(
        1,
        Math.min(10, Number.isFinite(rawQuantity) ? Math.floor(rawQuantity) : 1)
      );
      subtotal += product.unit_amount * quantity;

      return {
        quantity,
        price_data: {
          currency: "eur",
          unit_amount: product.unit_amount,
          product_data: {
            name: product.name,
            metadata: { evida_product_id: String(id) }
          }
        }
      };
    });

    const origin =
      event.headers?.origin ||
      process.env.URL ||
      "https://evida-france.netlify.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["FR"]
      },
      shipping_options: [{
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: subtotal >= 5000 ? 0 : 490, currency: "eur" },
          display_name: subtotal >= 5000 ? "Livraison suivie offerte" : "Livraison suivie",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 10 },
            maximum: { unit: "business_day", value: 20 }
          }
        }
      }],
      success_url: `${origin}/?commande=succes&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?commande=annulee`
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: error?.message || "Impossible de créer la session de paiement."
      })
    };
  }
}
