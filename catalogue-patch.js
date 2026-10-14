/* ÉVIDA — patch catalogue CJ vérifié publiquement le 14/10/2026.
   À charger APRÈS storefront.js.
   Retire 206,207,209,215 et ajoute 216-220. */
(() => {
  if (typeof PRODUCTS === "undefined") {
    console.error("ÉVIDA: PRODUCTS introuvable. Charger ce fichier après storefront.js.");
    return;
  }
  const retired = new Set([206,207,209,215]);
  for (let i=PRODUCTS.length-1;i>=0;i--) if(retired.has(PRODUCTS[i].id)) PRODUCTS.splice(i,1);

  const additions = [
    {id:216,featured:true,section:"maison",category:"Cuisine plus simple",name:"Spray huile 2-en-1 — 550 ml",price:12.90,
     image:"https://cf.cjdropshipping.com/17164224/2405230229510324400.jpg",
     description:"Pulvérise ou verse l’huile avec un seul accessoire en verre de 550 ml.",
     problem:"Doser l’huile proprement en cuisine n’est pas toujours pratique.",
     result:"Un accessoire simple pour pulvériser ou verser selon la préparation.",
     benefits:["Deux modes : spray et versement","Flacon en verre 550 ml","Ouverture large pour le nettoyage"],
     specs:["Référence CJ : CJYD187611401AZ","Produit non personnalisé","Livraison calculée à l’adresse"],personalized:false},

    {id:217,section:"maison",category:"Entretien plus facile",name:"Brosse de nettoyage électrique multifonction",price:44.90,
     image:"https://cf.cjdropshipping.com/17090784/2402280126140327600.jpg",
     description:"Brosse électrique avec têtes interchangeables pour faciliter le nettoyage des surfaces.",
     problem:"Les zones encrassées demandent beaucoup de frottement manuel.",
     result:"Une brosse motorisée pour simplifier les tâches de nettoyage répétitives.",
     benefits:["Plusieurs têtes selon variante","Format rechargeable selon variante","Pour cuisine et surfaces du quotidien"],
     specs:["Référence CJ : CJJT160221301AZ","Produit non personnalisé","Livraison calculée à l’adresse"],personalized:false},

    {id:218,section:"maison",category:"Entretien plus facile",name:"Rouleau anti-peluches lavable réutilisable",price:34.90,
     image:"https://cf.cjdropshipping.com/16986240/1718893321465761792.jpg",
     description:"Rouleau adhésif réutilisable pour vêtements, tissus et petits nettoyages du quotidien.",
     problem:"Peluches, poussières et cheveux restent accrochés aux textiles.",
     result:"Un format compact qui se nettoie et se réutilise.",
     benefits:["Lavable et réutilisable","Compact","Pour vêtements et textiles"],
     specs:["Référence CJ : CJJT148225101AZ","ABS et polyuréthane selon fournisseur","Livraison calculée à l’adresse"],personalized:false},

    {id:219,section:"maison",category:"Entretien plus facile",name:"Brosse fine pour joints et recoins",price:4.90,
     image:"https://frontend-cf.cjdropshipping.com/config-resource/cj/img_default.jpeg",
     description:"Brosse étroite pensée pour les joints, rainures et zones difficiles d’accès.",
     problem:"Les petits espaces de cuisine et salle de bain sont difficiles à atteindre.",
     result:"Une brosse simple pour cibler les recoins et les joints.",
     benefits:["Poignée ergonomique","Poils durs","Cuisine et salle de bain"],
     specs:["Référence CJ : CJYD195432301AZ","Matière : plastique","Livraison calculée à l’adresse"],personalized:false},

    {id:220,featured:true,section:"maison",category:"Un quotidien plus agréable",name:"Petite fontaine à eau pour chat — 2,8 L",price:34.90,
     image:"https://cc-west-usa.oss-accelerate.aliyuncs.com/3e475788-3ad2-4ce5-a48d-581ffd262e1b.jpg",
     description:"Distributeur d’eau automatique format escargot, capacité annoncée de 2,8 L.",
     problem:"La gamelle d’eau demande des remplissages fréquents.",
     result:"Une réserve d’eau plus importante pour le quotidien du chat.",
     benefits:["Capacité annoncée : 2,8 L","PET et ABS selon fournisseur","Format compact"],
     specs:["Référence CJ : CJJJCWGY04219-Filter","Produit non personnalisé","Livraison calculée à l’adresse"],personalized:false}
  ];
  PRODUCTS.push(...additions);
  if (typeof renderProducts === "function") renderProducts();
})();
