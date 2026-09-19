// Ce fichier garde le flux de paiement opérationnel même si l'automatisation CJ n'est pas activée.
// Les produits référencés dans la boutique sont issus de pages CJdropshipping où l'option Dropshipping est affichée.
// Pour automatiser la commande fournisseur, connecter l'API CJ au compte ÉVIDA et mapper les variantes/SKU exacts avant mise en production.
export async function fulfillPaidOrderWithCJ(order){return {...order,supplierFulfillment:order.supplierFulfillment||"manual_cj_required"}}
export async function syncCJOrder(order){return order}
