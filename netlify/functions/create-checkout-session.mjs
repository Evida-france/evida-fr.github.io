import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ==========================================================
   CATALOGUE STRIPE ÉVIDA
   IMPORTANT :
   Les prix sont enregistrés en CENTIMES.
   2490 = 24,90 €
========================================================== */

const PRODUCTS = {

  101: {
    name: "Organiseur coulissant sous évier — 2 niveaux",
    unit_amount: 2490
  },

  102: {
    name: "Grand sac de rangement textile 50–75 L",
    unit_amount: 1490
  },

  103: {
    name: "Organiseur pliable pour vêtements et jeans",
    unit_amount: 1490
  },

  104: {
    name: "Organiseur rotatif 360°",
    unit_amount: 1990
  },

  105: {
    name: "Support mural pour balai et accessoires",
    unit_amount: 1290
  },

  106: {
    name: "Panier de rangement pour évier",
    unit_amount: 1290
  },

  107: {
    name: "Organiseur rotatif pour salle de bain",
    unit_amount: 1990
  },

  108: {
    name: "Rangement pliable multi-usage",
    unit_amount: 1990
  },

  109: {
    name: "Clip magnétique range-câbles",
    unit_amount: 990
  },

  110: {
    name: "Support pliable pour ordinateur portable",
    unit_amount: 2490
  },

  111: {
    name: "Support pliable pour smartphone",
    unit_amount: 1290
  },

  112: {
    name: "Pochette organiseur pour câbles et accessoires tech",
    unit_amount: 1990
  },

  113: {
    name: "Pèse-bagage portable",
    unit_amount: 1490
  },

  114: {
    name: "Trousse transparente de voyage",
    unit_amount: 1290
  },

  115: {
    name: "Set de 7 organiseurs de valise",
    unit_amount: 2490
  },

  116: {
    name: "Sac de voyage pliable grande capacité",
    unit_amount: 2490
  },

  117: {
    name: "Gourde portable pour chien et chat",
    unit_amount: 1990
  },

  118: {
    name: "Peigne de toilettage pour chien et chat",
    unit_amount: 1490
  },

  119: {
    name: "Gamelle pliable de voyage",
    unit_amount: 1490
  },

  120: {
    name: "Tapis de léchage en silicone",
    unit_amount: 1490
  }

};

/* ==========================================================
   NETLIFY FUNCTION
========================================================== */

export async function handler(event) {

  if (event.httpMethod !== "POST") {

    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "Méthode non autorisée."
      })
    };

  }

  try {

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error(
        "STRIPE_SECRET_KEY manquante."
      );
    }

    const body =
      JSON.parse(
        event.body || "{}"
      );

    const items =
      Array.isArray(body.items)
        ? body.items
        : [];

    if (!items.length) {

      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          error: "Votre panier est vide."
        })
      };

    }

    /* ======================================================
       VALIDATION DES PRODUITS
    ====================================================== */

    const line_items =
      items.map(item => {

        const id =
          Number(item.id);

        const product =
          PRODUCTS[id];

        if (!product) {

          throw new Error(
            `Produit ÉVIDA invalide : ${id}`
          );

        }

        const rawQuantity =
          Number(
            item.quantity
            ??
            item.qty
            ??
            1
          );

        const quantity =
          Math.max(
            1,
            Math.min(
              10,
              Number.isFinite(rawQuantity)
                ? Math.floor(rawQuantity)
                : 1
            )
          );

        return {

          quantity,

          price_data: {

            currency: "eur",

            unit_amount:
              product.unit_amount,

            product_data: {

              name:
                product.name,

              metadata: {

                evida_product_id:
                  String(id)

              }

            }

          }

        };

      });

    /* ======================================================
       ADRESSE DU SITE
    ====================================================== */

    const origin =
      event.headers?.origin
      ||
      process.env.URL
      ||
      "https://evida-france.netlify.app";

    /* ======================================================
       CRÉATION STRIPE CHECKOUT
    ====================================================== */

    const session =
      await stripe
        .checkout
        .sessions
        .create({

          mode: "payment",

          line_items,

          billing_address_collection:
            "required",

          shipping_address_collection: {

            allowed_countries: [
              "FR",
              "BE",
              "LU",
              "DE",
              "ES",
              "IT",
              "NL"
            ]

          },

          success_url:
            `${origin}/?commande=succes&session_id={CHECKOUT_SESSION_ID}`,

          cancel_url:
            `${origin}/?commande=annulee`

        });

    /* ======================================================
       RETOUR AU SITE
    ====================================================== */

    return {

      statusCode: 200,

      headers: {
        "Content-Type":
          "application/json"
      },

      body:
        JSON.stringify({
          url: session.url
        })

    };

  } catch (error) {

    console.error(
      "Stripe checkout error:",
      error
    );

    return {

      statusCode: 500,

      headers: {
        "Content-Type":
          "application/json"
      },

      body:
        JSON.stringify({

          error:
            error?.message
            ||
            "Impossible de créer la session de paiement."

        })

    };

  }

}
