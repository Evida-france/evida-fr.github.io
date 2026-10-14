(() => {
  const retired=new Set([206,207,209,210,211,215,218,219]);
  for(let i=PRODUCTS.length-1;i>=0;i--) if(retired.has(PRODUCTS[i].id)) PRODUCTS.splice(i,1);

  const addOrReplace=p=>{const i=PRODUCTS.findIndex(x=>x.id===p.id); if(i>=0)PRODUCTS[i]=p;else PRODUCTS.push(p)};
  addOrReplace({id:216,category:"Cuisine plus simple",name:"Spray huile 2-en-1 — 550 ml",price:12.90,image:"https://cf.cjdropshipping.com/17164224/2405230229510324400.jpg",description:"Pour doser l’huile plus proprement, en spray ou en versement.",problem:"Doser l’huile sans en mettre trop.",result:"Un seul flacon pour pulvériser ou verser.",benefits:["2 modes","Flacon 550 ml","Cuisine quotidienne"],specs:["CJ : CJYD187611401AZ","Livraison calculée à l’adresse"],personalized:false});
  addOrReplace({id:217,category:"Entretien plus facile",name:"Brosse de nettoyage électrique multifonction",price:44.90,image:"https://cf.cjdropshipping.com/17090784/2402280126140327600.jpg",description:"Une brosse motorisée pour simplifier les nettoyages répétitifs.",problem:"Frotter longtemps les surfaces encrassées.",result:"Une aide motorisée pour le nettoyage.",benefits:["Motorisée","Têtes interchangeables","Maison"],specs:["CJ : CJJT160221301AZ","Livraison calculée à l’adresse"],personalized:false});
  addOrReplace({id:220,category:"Un quotidien plus agréable",name:"Fontaine à eau pour chat — 2,8 L",price:34.90,image:"assets/products/fontaine-chat-evida.jpg",description:"Une réserve d’eau automatique compacte pour le chat.",problem:"Remplir souvent une petite gamelle.",result:"Une réserve d’eau plus importante au quotidien.",benefits:["2,8 L","Compacte","Pour chat"],specs:["CJ : CJJJCWGY04219-Filter","Livraison calculée à l’adresse"],personalized:false});


  addOrReplace({id:227,category:"Un quotidien plus agréable",name:"Distributeur automatique de savon — 400 ml",price:19.90,image:"https://cf.cjdropshipping.com/quick/product/0FC098EF-2548-475A-B169-DC57351ADB26.jpg",description:"Un distributeur sans contact pour la cuisine ou la salle de bain.",problem:"Toucher le flacon avec les mains mouillées ou sales n’est pas toujours pratique.",result:"Le savon est distribué automatiquement en approchant la main.",benefits:["Sans contact","400 ml","Cuisine & salle de bain"],specs:["CJ : CJJJJTJT01223-Black 4pcs","Capteur infrarouge","Livraison calculée à l’adresse"],personalized:false});
  addOrReplace({id:228,category:"Cuisine plus simple",name:"Égouttoir & boîte fraîcheur avec couvercle",price:14.90,image:"https://cf.cjdropshipping.com/quick/product/2407160828401622500.jpg",description:"Un récipient pratique pour laver, égoutter puis conserver fruits et légumes au réfrigérateur.",problem:"Laver puis conserver les fruits et légumes demande souvent plusieurs récipients.",result:"Laver, égoutter et ranger avec un seul accessoire.",benefits:["3-en-1","Avec couvercle","Réfrigérateur"],specs:["CJ : CJYD208536601AZ","Égouttoir + conservation","Livraison calculée à l’adresse"],personalized:false});

  // Produits inspirés directement de la maquette validée par l'utilisateur.
  addOrReplace({id:223,category:"Cuisine plus simple",name:"Mini hachoir électrique rechargeable",price:14.90,image:"assets/products/mini-hachoir-maquette.jpg",description:"Petit hachoir rechargeable pour oignons, légumes et préparations rapides.",problem:"Hacher de petites quantités prend du temps et salit plusieurs ustensiles.",result:"Préparer rapidement de petites portions dans un format compact.",benefits:["Rechargeable","Compact","Cuisine quotidienne"],specs:["CJ : CJYD237044201AZ","Capacité < 1 L","Livraison calculée à l’adresse"],personalized:false});
  addOrReplace({id:224,category:"Entretien plus facile",name:"Aspirateur à main sans fil",price:24.90,image:"assets/products/aspirateur-main-maquette.jpg",description:"Aspirateur compact sans fil pour miettes, canapé, voiture et petits recoins.",problem:"Les miettes et poussières du quotidien ne justifient pas toujours de sortir un gros aspirateur.",result:"Nettoyer rapidement les petites zones et les recoins.",benefits:["Sans fil","Compact","Maison & voiture"],specs:["CJ : CJQCQCCZ00034-7903black-Wireless","Batterie 2000 mAh selon fournisseur","Livraison calculée à l’adresse"],personalized:false});
  addOrReplace({id:225,category:"Cuisine plus simple",name:"Boîte repas isotherme compartimentée",price:19.90,image:"assets/products/boite-repas-maquette.jpg",description:"Boîte repas compartimentée avec intérieur inox pour transporter le déjeuner.",problem:"Transporter plusieurs aliments sans tout mélanger.",result:"Un repas mieux organisé dans une seule boîte.",benefits:["Compartimentée","Intérieur inox","Transport facile"],specs:["CJ : CJJJCFCJ00823-Pink-5 grid","Plusieurs configurations fournisseur","Livraison calculée à l’adresse"],personalized:false});
  addOrReplace({id:226,category:"Maison plus organisée",name:"Boîtes de conservation empilables",price:24.90,image:"assets/products/rangement-cuisine-maquette.jpg",description:"Des contenants pratiques pour mieux organiser les aliments secs et les placards.",problem:"Paquets ouverts et petits aliments encombrent rapidement les étagères.",result:"Regrouper et visualiser plus facilement les aliments du quotidien.",benefits:["Empilables","Organisation placard","Réutilisables"],specs:["Produit visuel de la maquette","Référence fournisseur à valider avant activation"],personalized:false,disabled:true});

  const cat=id=>{
    if([212,216,223,225,228].includes(id)) return "cuisine";
    if([214,226].includes(id)) return "organisation";
    if([208,217,224].includes(id)) return "entretien";
    return "quotidien";
  };
  renderProducts=function(){
    const grids={cuisine:document.getElementById("grid-cuisine"),organisation:document.getElementById("grid-organisation"),entretien:document.getElementById("grid-entretien"),quotidien:document.getElementById("grid-quotidien")};
    Object.values(grids).forEach(g=>g.innerHTML="");
    PRODUCTS.filter(p=>!p.disabled).forEach(p=>grids[cat(p.id)].insertAdjacentHTML("beforeend",card(p)));
    document.querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>add(Number(b.dataset.id)));
    document.querySelectorAll("[data-detail]").forEach(b=>b.onclick=()=>showDetail(Number(b.dataset.detail)));
  };
  renderProducts();
})();