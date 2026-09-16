ÉVIDA — VERSION FINALISÉE — 16/09/2026

BROSSE OFFICIELLE
Fournisseur : CJdropshipping
SKU : CJMY200580801AZ
Produit : https://cjdropshipping.com/product/2-in-1-pet-hair-removal-roller-multifunctional-portable-washable-hair-removal-brush-pet-supplies-p-1777181071063396352.html
Photo officielle utilisée sur le site : https://cf.cjdropshipping.com/17170272/2405300600490321700.jpg
Prix public CJ observé : 1,39 à 5,80 USD
Prix ÉVIDA : 10.09 €

PENDENTIF ANIMAL
Même fournisseur : CJdropshipping
SKU : CJGX195184801AZ
Produit : https://www.cjdropshipping.com/product/pet-jewelry-cat-dog-necklace-retro-love-crystal-pendant-necklace-pet-products-p-1748221591659483136.html
Photo fournisseur utilisée sur le site : https://oss-cf.cjdropshipping.com/product/2024/01/25/08/fc656ad1-91e0-4578-b365-34ab33f362b1.jpg
Variante boutique : cœur bleu saphir, taille S, tour de cou 20+5 cm
Prix public CJ observé : 1,61 à 6,90 USD
Prix ÉVIDA : 11.99 €

PRIX / MARGE
Taux utilisé : 1 USD = 0,866653 EUR (16/09/2026).
La marge de 50 % est calculée comme marge commerciale brute sur le coût produit maximal public :
prix = coût / (1 - 0,50).
Brosse : 5,80 × 0,866653 ≈ 5,03 € ; prix cible ≈ 10,05 € ; affiché 10.09 €.
Pendentif : 6,90 × 0,866653 ≈ 5,98 € ; prix cible ≈ 11,96 € ; affiché 11.99 €.

ATTENTION
Le fret fournisseur vers la France n’est pas disponible publiquement sans connexion CJ. Il n’est donc pas inclus dans ce calcul.
Le site facture 4,90 € de livraison client, offerte dès 50 €.
Les montants affichés et les montants envoyés à SumUp sont identiques dans ce ZIP.

Déploiement :
- frontend : GitHub Pages
- backend : Netlify
- variables nécessaires : SUMUP_API_KEY et SUMUP_MERCHANT_CODE


AUTOMATISATION FOURNISSEUR CJ
- Après paiement SumUp = PAID, la brosse et le pendentif sont créés automatiquement chez CJ.
- CJ expédie directement au client.
- Paiement CJ par solde automatique par défaut (CJ_PAY_TYPE=2).
- Synchronisation du statut et du suivi toutes les heures.
- Protection contre la recréation d’une commande déjà envoyée à CJ.
- Le plaid personnalisé reste hors CJ.

Pour activer réellement l’envoi automatique, ajouter dans Netlify :
CJ_API_KEY = votre clé API CJ.
Le serveur génère ensuite lui-même le CJ Access Token.
Le compte CJ doit disposer d’un solde suffisant.
