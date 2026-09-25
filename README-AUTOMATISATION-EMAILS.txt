ÉVIDA — AUTOMATISATION DES E-MAILS

Cette version envoie automatiquement deux e-mails :
1. Confirmation immédiate après paiement SumUp : « Merci pour votre commande ».
2. E-mail de suivi dès que CJ fournit le numéro de suivi, avec un bouton vers CJPacket.

La vérification CJ est exécutée toutes les 15 minutes sur le déploiement Netlify publié.

Variables Netlify obligatoires (scope Functions) :
- SUMUP_API_KEY
- SUMUP_MERCHANT_CODE
- CJ_API_KEY
- RESEND_API_KEY
- EVIDA_FROM_EMAIL

Important : EVIDA_FROM_EMAIL doit être une adresse/domaine validé dans Resend.
Après avoir téléversé les fichiers sur Netlify, ouvre Functions :
- cj-sync doit apparaître avec le badge Scheduled ;
- utilise Run now une première fois pour tester la synchronisation.
