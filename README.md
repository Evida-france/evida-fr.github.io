# ÉVIDA Android V3

Prototype de boutique Android plus complet.

## Fonctionnalités incluses
- Accueil premium
- Catégories
- Produits de démonstration
- Favoris
- Panier avec quantités
- Adresse de livraison
- Écran de paiement en mode prototype
- Confirmation de commande test
- Profil / commandes / adresses / aide
- Mentions explicites sur ce qui doit être finalisé avant encaissement réel

## Paiement réel
Le paiement réel n'est PAS activé dans cette version.
Architecture prévue :
- paiement sécurisé SumUp
- backend sécurisé pour créer/valider les paiements
- aucune clé secrète dans l'application

## Avant mise en production
1. Choisir les fournisseurs et vrais produits.
2. Remplacer les produits/prix de démonstration.
3. Ajouter vraies images et stocks/disponibilités.
4. Finaliser CGV, retours, identité du vendeur et confidentialité.
5. Connecter le backend au compte marchand SumUp.
6. Tester le tunnel de paiement en environnement test.
7. Ajouter suivi de commande réel.
8. Tester l'application sur plusieurs appareils.
9. Préparer signature/AAB et conformité Google Play.

Cette V3 est un prototype fonctionnel de parcours, pas une boutique prête à encaisser.
