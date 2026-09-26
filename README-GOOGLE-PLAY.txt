ÉVIDA Android 0.8.0

Cette application ouvre la vraie boutique ÉVIDA et conserve le panier, le paiement SumUp et le suivi du site.

Pour créer le fichier Google Play signé, configure ces quatre secrets dans GitHub :
EVIDA_UPLOAD_KEYSTORE_BASE64
EVIDA_UPLOAD_STORE_PASSWORD
EVIDA_UPLOAD_KEY_ALIAS
EVIDA_UPLOAD_KEY_PASSWORD

Il faut réutiliser la clé d'importation déjà acceptée par Google Play. Ne génère pas une nouvelle clé.

Puis lance GitHub Actions > « ÉVIDA - Google Play » > Run workflow.
Le résultat à téléverser dans le test fermé est l'artifact EVIDA-0.8.0-GOOGLE-PLAY.
