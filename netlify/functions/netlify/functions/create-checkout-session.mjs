import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRODUCTS = {
  1:  { name: "Porte-sacs à déjections design", price: 1990 },
  2:  { name: "Gilet d’hiver pour chien", price: 3490 },
  3:  { name: "Imperméable pour chien", price: 3990 },
  4:  { name: "Friandises croustillantes pour chien", price: 1990 },
  5:  { name: "Bouteille d’eau portable pour chien", price: 2490 },
  6:  { name: "Balançoire colorée pour petits animaux", price: 2490 },
  7:  { name: "Kit de filtres éponge pour aquarium", price: 2490 },
  8:  { name: "Vêtement polaire abeille pour animal", price: 2990 },
  9:  { name: "Balle interactive à l’herbe à chat", price: 1990 },
  10: { name: "Laisse corde pour chien", price: 2490 },
  11: { name: "Jouet peluche sonore pour chien", price: 2490 },
  12: { name: "Décoration aquarium tête en résine", price: 2490 },
  13: { name: "Porte-sacs à déjections Wonderland", price: 1990 },
  14: { name: "Costume pour animal", price: 2990 },
  15: { name: "Chaussures imperméables pour animal", price: 2990 },
  16: { name: "Friandises souples pour chien", price: 1990 },
  17: { name: "Porte-clés cadeau animal", price: 1490 },
  18: { name: "Harnais camouflage pour chien", price: 2990 },
  19: { name: "Peignoir microfibre ultra-absorbant", price: 3490 },
  20: { name: "Jouet corde dentaire pour chien", price: 1990 },

  21: { name: "Affiche aquarelle décorative", price: 2490 },
  22: { name: "Veilleuse céramique décorative", price: 2990 },
  23: { name: "Tapis artisanal vintage", price: 8990 },
  24: { name: "Tapis Azra jute & laine", price: 9990 },
  25: { name: "Décoration abstraite Ninye", price: 4990 },
  26: { name: "Drapeau décoratif extérieur", price: 2490 },
  27: { name: "Grand miroir arche noir", price: 11990 },
  28: { name: "Affiche déco ville", price: 2490 },
  29: { name: "Cocotte en fonte émaillée 2,7 L", price: 6990 },
  30: { name: "Miroir compact décoratif", price: 1990 },
  31: { name: "Tapis oriental turquoise & gris", price: 11990 },
  32: { name: "Coussin décoratif tulipes", price: 3490 },
  33: { name: "Petit lustre cristal doré", price: 8990 },
  34: { name: "Tapis moderne beige", price: 12990 },
  35: { name: "Barre magnétique couteaux & outils", price: 2990 },
  36: { name: "Poster encadré artistique", price: 3990 },
  37: { name: "Affiche voyage Rio", price: 2490 },
  38: { name: "Lot de chaises velours noir", price: 14990 },
  39: { name: "Poster encadré Hestia", price: 3990 },
  40: { name: "Commode avec portant et LED", price: 13990 },

  41: { name: "Radio Bluetooth 9 bandes", price: 4990 },
  42: { name: "Tags sécurité bagage QR Suisse x2", price: 1990 },
  43: { name: "Accessoire flottant audio", price: 2490 },
  44: { name: "Moulin à café électrique Timemore", price: 14990 },
  45: { name: "Tags bagage initiale Z x2", price: 1990 },
  46: { name: "Tags sécurité bagage QR Pays-Bas x2", price: 1990 },
  47: { name: "Étui passeport RFID", price: 2990 },
  48: { name: "Tags bagage initiale H x2", price: 1990 },
  49: { name: "Accessoire audio édition limitée", price: 3990 },
  50: { name: "Lampe frontale rechargeable 1400 lm", price: 5990 },
  51: { name: "Tasseur café auto-nivelant Timemore", price: 4990 },
  52: { name: "Chauffage céramique portable", price: 5990 },
  53: { name: "Radio cassette Bluetooth + MP3", price: 7990 },
  54: { name: "Tags sécurité bagage QR Mexique x2", price: 1990 },
  55: { name: "TV LED 32 pouces", price: 14990 },
  56: { name: "Tags bagage initiale Q x2", price: 1990 },
  57: { name: "Support plafond TV", price: 8990 },
  58: { name: "Cadenas Dolphin", price: 2490 },
  59: { name: "Tags sécurité bagage Chicago x2", price: 1990 },
  60: { name: "Moulin manuel Timemore C5", price: 6990 },

  61: { name: "Drapeau maison Saint-Valentin", price: 2490 },
  62: { name: "Cartes de vœux chien x8", price: 1990 },
  63: { name: "Miroir compact Basset Hound", price: 1990 },
  64: { name: "Cartes de Noël Boxer x8", price: 1990 },
  65: { name: "Coussin décoratif Tulipes", price: 3490 },
  66: { name: "Cartes Noël Bull Terrier x8", price: 1990 },
  67: { name: "Coussin Collie Hippie", price: 3490 },
  68: { name: "Coussin Belgian Malinois", price: 3490 },
  69: { name: "Cartes Noël chat Sphynx x8", price: 1990 },
  70: { name: "Cartes Saint-Valentin Berger Allemand", price: 1990 },
  71: { name: "Tablier poisson Katy Red", price: 2990 },
  72: { name: "Torchons cuisine chien x2", price: 2490 },
  73: { name: "Cartes Mardi Gras Berger Allemand", price: 1990 },
  74: { name: "Coussin Airedale Terrier", price: 3490 },
  75: { name: "Torchons Chow Chow x2", price: 2490 },
  76: { name: "Cartes Golden Retriever Angel x8", price: 1990 },
  77: { name: "Coussin Corgi Christmas", price: 3490 },
  78: { name: "Drapeau Alaskan Klee Kai", price: 2490 },
  79: { name: "Cartes Scottish Deerhound x8", price: 1990 },
  80: { name: "Drapeau German Wirehaired Pointer", price: 2490 }
};

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Méthode non autorisée" })
      };
    }

    const { items } = JSON.parse(event.body || "{}");

    if (!Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Panier vide" })
      };
    }

    const line_items = items.map((item) => {
      const product = PRODUCTS[item.id];

      if (!product) {
        throw new Error("Produit invalide");
      }

      const quantity = Math.max(1, Math.min(10, Number(item.qty) || 1));

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name
          },
          unit_amount: product.price
        },
        quantity
      };
    });

    const origin =
      event.headers.origin ||
      "https://evida-france.netlify.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "LU", "DE", "ES", "IT", "NL"]
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
      body: JSON.stringify({ url: session.url })
    };

  } catch (error) {
    console.error("Stripe checkout error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Impossible de créer le paiement Stripe."
      })
    };
  }
};
