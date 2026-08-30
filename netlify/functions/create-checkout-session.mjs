import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRODUCTS = {
  29: {
    name: "Cocotte en fonte émaillée 2,7 L",
    price: 6990
  },
  35: {
    name: "Barre magnétique pour couteaux et outils",
    price: 2490
  },
  23: {
    name: "Tapis artisanal vintage",
    price: 8990
  },
  24: {
    name: "Tapis Azra jute & laine",
    price: 7990
  },
  27: {
    name: "Grand miroir arche noir",
    price: 8990
  },
  33: {
    name: "Petit lustre cristal doré",
    price: 6990
  },
  40: {
    name: "Commode avec portant et LED",
    price: 11990
  },
  21: {
    name: "Affiche aquarelle décorative",
    price: 1990
  },
  28: {
    name: "Affiche déco ville",
    price: 1990
  },
  34: {
    name: "Tapis moderne beige",
    price: 7990
  },

  60: {
    name: "Moulin manuel Timemore C5 Pro",
    price: 6990
  },
  44: {
    name: "Moulin à café électrique Timemore",
    price: 9990
  },
  51: {
    name: "Tasseur café auto-nivelant Timemore",
    price: 3990
  },
  41: {
    name: "Radio Bluetooth 9 bandes",
    price: 4990
  },
  53: {
    name: "Radio cassette Bluetooth + MP3",
    price: 5990
  },
  50: {
    name: "Lampe frontale rechargeable 1400 lm",
    price: 3490
  },
  52: {
    name: "Chauffage céramique portable",
    price: 4490
  },
  47: {
    name: "Étui passeport RFID",
    price: 1990
  },
  58: {
    name: "Cadenas Dolphin",
    price: 1490
  },
  55: {
    name: "TV LED 32 pouces",
    price: 14990
  },
  57: {
    name: "Support plafond TV",
    price: 4990
  },

  9: {
    name: "Balle interactive à l'herbe à chat",
    price: 1490
  },
  7: {
    name: "Kit de filtres éponge pour aquarium",
    price: 1490
  },
  12: {
    name: "Décoration aquarium tête en résine",
    price: 1990
  },
  6: {
    name: "Balançoire colorée pour petits animaux",
    price: 1490
  },
  5: {
    name: "Bouteille d'eau portable pour animal",
    price: 2490
  },
  19: {
    name: "Peignoir microfibre ultra-absorbant",
    price: 2990
  },
  10: {
    name: "Laisse corde CANNA",
    price: 3990
  },

  22: {
    name: "Veilleuse céramique décorative",
    price: 2490
  },
  30: {
    name: "Miroir compact décoratif",
    price: 1490
  },
  32: {
    name: "Coussin décoratif tulipes",
    price: 2490
  },
  36: {
    name: "Poster encadré artistique",
    price: 2990
  },
  37: {
    name: "Affiche voyage Rio",
    price: 1990
  },
  42: {
    name: "Tags sécurité bagage QR Suisse x2",
    price: 1990
  },
  54: {
    name: "Tags sécurité bagage QR Mexique x2",
    price: 1990
  },
  59: {
    name: "Tags sécurité bagage Chicago x2",
    price: 1990
  },
  17: {
    name: "Porte-clés cadeau animal",
    price: 1490
  }
};

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: "Méthode non autorisée"
      })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const items = Array.isArray(body.items)
      ? body.items
      : [];

    if (items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Le panier est vide."
        })
      };
    }

    const lineItems = [];

    for (const item of items) {
      const product = PRODUCTS[item.id];

      if (!product) {
        continue;
      }

      let quantity = Number(item.quantity) || 1;

      quantity = Math.max(
        1,
        Math.min(quantity, 10)
      );

      lineItems.push({
        price_data: {
          currency: "eur",

          product_data: {
            name: product.name
          },

          unit_amount: product.price
        },

        quantity
      });
    }

    if (lineItems.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Aucun produit valide dans le panier."
        })
      };
    }

    const origin =
      event.headers.origin ||
      process.env.URL ||
      "https://evida-france.netlify.app";

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        line_items: lineItems,

        billing_address_collection: "required",

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

    return {
      statusCode: 200,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        url: session.url
      })
    };

  } catch (error) {
    console.error(
      "Erreur Stripe :",
      error
    );

    return {
      statusCode: 500,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        error:
          "Impossible de créer la session de paiement."
      })
    };
  }
};
