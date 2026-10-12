const API="https://evida-france.netlify.app/.netlify/functions";
const PRODUCTS=[
  {
    id:208,featured:true,section:"compagnons",category:"Anti-poils",name:"Brosse anti-poils 2-en-1",price:10.09,image:"assets/products/pack-anti-poils.webp",
    description:"Pour retirer les poils sur les vêtements, tissus, sièges et canapés.",
    problem:"Les poils restent accrochés aux vêtements, au canapé et aux sièges.",
    result:"Un geste simple pour nettoyer les textiles avant de sortir ou avant de recevoir.",
    benefits:["Format facile à garder à la maison","Utile pour vêtements, plaids et sièges","Petit prix pour un usage régulier"],
    specs:["Produit non personnalisé","Convient aux textiles du quotidien","Livraison suivie"],personalized:false
  },
  {
    id:206,featured:true,section:"compagnons",category:"Cadeau personnalisé",name:"Plaid personnalisé — portrait d’animal",price:39.90,image:"assets/products/plaid-animal.webp",
    description:"Ajoutez sa photo pour créer un plaid souvenir doux et personnel.",
    problem:"Trouver un cadeau vraiment personnel pour quelqu’un qui aime son animal.",
    result:"Un plaid avec photo, pensé comme cadeau émotionnel ou souvenir à garder.",
    benefits:["Personnalisation avec photo","Cadeau fort pour amoureux des animaux","Photo vérifiée avant ajout au panier"],
    specs:["Fabrication personnalisée","Photo JPEG, PNG ou WEBP","Confirmation de personnalisation demandée"],personalized:true
  },
  {
    id:209,featured:true,section:"selections",category:"Nomade",name:"Batterie externe compacte — jusqu’à 20 000 mAh",price:38.99,image:"https://oss-cf.cjdropshipping.com/product/2025/02/23/08/ebf4f21e-88f5-49f1-aa76-a81e04d752ad_trans.jpeg",
    description:"Une batterie compacte à glisser dans un sac ou à garder à portée de main.",
    problem:"Le téléphone tombe à court de batterie au mauvais moment.",
    result:"Une solution de secours simple pour les sorties, le travail ou les déplacements.",
    benefits:["Pratique en déplacement","Format facile à transporter","Utile au quotidien"],
    specs:["Capacité annoncée fournisseur : jusqu’à 20 000 mAh","Produit non personnalisé","Livraison suivie"],personalized:false
  },
  {
    id:210,featured:true,section:"selections",category:"Anti-perte",name:"Balise Bluetooth anti-perte",price:7.99,image:"https://cf.cjdropshipping.com/15139872/1547729804061.jpg",
    description:"Pour garder un œil sur les objets importants au quotidien.",
    problem:"Clés, sac ou objet important peuvent disparaître au pire moment.",
    result:"Une petite balise pour retrouver plus vite l’essentiel à proximité.",
    benefits:["Petit format discret","Utile pour clés, sac ou accessoires","Prix accessible"],
    specs:["Fonction Bluetooth selon compatibilité téléphone","Produit non personnalisé","Livraison suivie"],personalized:false
  },
  {
    id:207,section:"compagnons",category:"Petite attention",name:"Pendentif cœur chat & petit chien",price:11.99,image:"assets/products/bijou-animal.webp",
    description:"Un pendentif décoratif à offrir à un amoureux des animaux.",
    problem:"Envie d’un petit cadeau animalier sans chercher longtemps.",
    result:"Un bijou simple, mignon et facile à offrir.",
    benefits:["Idée cadeau accessible","Univers animalier cohérent avec ÉVIDA","Format léger"],
    specs:["Bijou décoratif","Produit non personnalisé","Livraison suivie"],personalized:false
  },
  {
    id:211,section:"selections",category:"Bureau & maison",name:"Support téléphone/tablette rotatif 360°",price:2.99,image:"https://oss-cf.cjdropshipping.com/product/2024/04/01/05/6de0dea8-d7a8-4c9f-ad03-b37f11e1b761.jpg",
    description:"Un support de bureau simple pour garder son écran à hauteur.",
    problem:"Le téléphone traîne sur le bureau ou glisse pendant les vidéos.",
    result:"Un support simple pour garder l’écran visible et stable.",
    benefits:["Pratique sur bureau","Rotation 360° annoncée fournisseur","Petit accessoire utile"],
    specs:["Produit non personnalisé","Usage bureau ou maison","Livraison suivie"],personalized:false
  },
  {
    id:212,section:"maison",category:"À emporter",name:"Blender portable rechargeable",price:8.99,image:"https://cf.cjdropshipping.com/quick/product/bef87977-9a0d-4099-826a-75bdcae7a2f9.jpg",
    description:"Un mini blender rechargeable pour préparer vos boissons facilement.",
    problem:"Envie de préparer une boisson rapide sans gros appareil.",
    result:"Un format compact à utiliser pour les boissons simples du quotidien.",
    benefits:["Format portable","Rechargeable selon modèle fournisseur","Utile maison ou déplacement"],
    specs:["Capacité annoncée fournisseur : 401 à 600 ml","Produit non personnalisé","Livraison suivie"],personalized:false
  },
  {
    id:213,section:"maison",category:"Ambiance maison",name:"Diffuseur d’arômes effet flamme",price:6.99,image:"https://oss-cf.cjdropshipping.com/product/2024/09/30/06/f8c292ac-be2b-4330-9058-f321cd75720f.jpg",
    description:"Un diffuseur compact pour créer une ambiance chaleureuse.",
    problem:"Une pièce peut manquer d’ambiance le soir ou pendant un moment calme.",
    result:"Un petit diffuseur décoratif pour adoucir l’ambiance de la maison.",
    benefits:["Effet visuel chaleureux","Format compact","Idée cadeau accessible"],
    specs:["Utilisation selon notice fournisseur","Produit non personnalisé","Livraison suivie"],personalized:false
  },
  {
    id:214,section:"maison",category:"Pratique en voyage",name:"Défroisseur portable USB",price:4.99,image:"https://oss-cf.cjdropshipping.com/product/2025/08/16/09/4d5163f2-6002-43df-8402-fd92e81e5b72_trans.jpeg",
    description:"Un format compact pour rafraîchir vos vêtements hors de chez vous.",
    problem:"Un vêtement froissé juste avant de sortir donne vite mauvaise impression.",
    result:"Un accessoire compact pour dépanner en déplacement.",
    benefits:["Format voyage","Simple à ranger","Utile avant rendez-vous ou sortie"],
    specs:["Produit non personnalisé","Usage selon notice fournisseur","Livraison suivie"],personalized:false
  },
  {
    id:215,section:"maison",category:"Bien-être",name:"Correcteur de posture intelligent",price:57.99,image:"https://cf.cjdropshipping.com/1617170852159.jpg",
    description:"Un accessoire discret à utiliser au quotidien.",
    problem:"On se tient souvent mal devant un écran sans s’en rendre compte.",
    result:"Un rappel discret pour reprendre une meilleure posture dans la journée.",
    benefits:["Rappel de posture","Discret sous certains vêtements","Usage quotidien"],
    specs:["Accessoire de confort, pas un dispositif médical","Produit non personnalisé","Livraison suivie"],personalized:false
  }
];

let cart=[],pendingPhoto=null,addressTimer=null;
try{cart=JSON.parse(sessionStorage.getItem("evida-cart")||"[]")}catch{}
const $=x=>document.getElementById(x);
const euro=n=>n.toLocaleString("fr-FR",{style:"currency",currency:"EUR"});
const faq=[
  ["Quand vais-je recevoir ma commande ?","Votre commande bénéficie d’une livraison suivie. Les informations de suivi sont communiquées après expédition."],
  ["Le paiement est-il sécurisé ?","Oui. Le règlement se fait via la page de paiement sécurisée SumUp."],
  ["Vais-je recevoir un suivi ?","Oui. Une confirmation est envoyée après paiement, puis un numéro de suivi est envoyé dès que la commande est expédiée."]
];

function save(){sessionStorage.setItem("evida-cart",JSON.stringify(cart));renderCart()}
function card(p){
  const benefits=(p.benefits||[]).slice(0,3).map(x=>`<span>${x}</span>`).join("");
  return `<article class="product ${p.featured?"featured":""}">
    <div class="visual"><img src="${p.image}" alt="${p.name}"></div>
    <div class="body">
      <div class="tag">${p.category}</div>
      <h3>${p.name}</h3>
      <div class="desc">${p.description}</div>
      <div class="benefits">${benefits}</div>
      <div class="price">${euro(p.price)}</div>
      <div class="shipping">Livraison suivie : tarif affiché avant paiement</div>
      <div class="buttonRow">
        <button class="ghostButton" data-detail="${p.id}">Voir détails</button>
        <button class="add" data-id="${p.id}">${p.personalized?"Personnaliser":"Ajouter"}</button>
      </div>
      <div class="microTrust"><span>Paiement sécurisé</span><span>Suivi colis</span></div>
    </div>
  </article>`;
}
function renderProducts(){
  $("grid-selections").innerHTML=PRODUCTS.filter(p=>p.featured).map(card).join("");
  $("grid-maison").innerHTML=PRODUCTS.filter(p=>!p.featured).map(card).join("");
  document.querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>add(Number(b.dataset.id)));
  document.querySelectorAll("[data-detail]").forEach(b=>b.onclick=()=>showDetail(Number(b.dataset.detail)));
}
function showDetail(id){
  const p=PRODUCTS.find(x=>x.id===id);
  if(!p)return;
  $("productDetail").innerHTML=`<div class="detail">
    <div class="detailMedia"><img src="${p.image}" alt="${p.name}"></div>
    <div class="detailCopy">
      <div><span class="eyebrow">${p.category}</span><h2>${p.name}</h2></div>
      <p>${p.description}</p>
      <div class="detailBlocks">
        <div><strong>Problème</strong><span>${p.problem}</span></div>
        <div><strong>Résultat attendu</strong><span>${p.result}</span></div>
      </div>
      <div>
        <strong>Avantages</strong>
        <div class="benefits">${(p.benefits||[]).map(x=>`<span>${x}</span>`).join("")}</div>
      </div>
      <div>
        <strong>Caractéristiques</strong>
        <div class="benefits">${(p.specs||[]).map(x=>`<span>${x}</span>`).join("")}</div>
      </div>
      <div class="faq">${faq.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
      <div class="price">${euro(p.price)}</div>
      <div class="detailActions">
        <button class="add" data-detail-add="${p.id}">${p.personalized?"Personnaliser":"Ajouter au panier"}</button>
        <button class="ghostButton" type="button" onclick="document.getElementById('productDialog').close()">Continuer mes achats</button>
      </div>
    </div>
  </div>`;
  $("productDetail").querySelector("[data-detail-add]").onclick=()=>add(id);
  $("productDialog").showModal();
}
function add(id){
  const p=PRODUCTS.find(x=>x.id===id);
  if($("productDialog")?.open)$("productDialog").close();
  if(p.personalized){pendingPhoto=null;$("photoForm").reset();$("preview").style.display="none";$("photoDialog").showModal();return}
  cart.push({...p,lineId:crypto.randomUUID(),quantity:1});
  save();
  openCart();
}

$("photo").onchange=async e=>{const f=e.target.files[0];if(!f)return;const b=await createImageBitmap(f),s=Math.min(1,1500/Math.max(b.width,b.height)),c=document.createElement("canvas");c.width=Math.round(b.width*s);c.height=Math.round(b.height*s);c.getContext("2d").drawImage(b,0,0,c.width,c.height);pendingPhoto={data:c.toDataURL("image/jpeg",.82),type:"image/jpeg",name:f.name};b.close();$("preview").src=pendingPhoto.data;$("preview").style.display="block"};
$("photoForm").onsubmit=e=>{e.preventDefault();if(!pendingPhoto)return $("photoStatus").textContent="Ajoutez une photo.";const p=PRODUCTS.find(x=>x.id===206);cart.push({...p,lineId:crypto.randomUUID(),quantity:1,personalization:{text:$("customText").value.trim(),photo:pendingPhoto,photoValidated:true}});save();$("photoDialog").close();openCart()};

function renderCart(){$("cartCount").textContent=cart.length;$("cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cartItem"><strong>${x.name}</strong><div>${euro(x.price)}</div><button data-rm="${x.lineId}">Retirer</button></div>`).join(""):"Votre panier est vide.";document.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.lineId!==b.dataset.rm);save()});const sub=cart.reduce((a,x)=>a+x.price,0);$("subtotal").textContent=euro(sub);$("shipping").textContent=cart.length?"Calculée à l’adresse":euro(0);$("total").textContent=euro(sub)}
function openCart(){$("drawer").classList.add("open");$("overlay").classList.add("show")}
function closeCart(){$("drawer").classList.remove("open");$("overlay").classList.remove("show")}
$("openCart").onclick=openCart;$("closeCart").onclick=closeCart;$("overlay").onclick=closeCart;
document.querySelectorAll(".x").forEach(x=>x.onclick=()=>x.closest("dialog").close());
$("checkout").onclick=()=>{if(!cart.length)return;const pers=cart.some(x=>x.personalized);$("photoConsentRow").style.display=pers?"flex":"none";$("salesConsentRow").style.display=pers?"flex":"none";$("checkoutForm").elements.photoConsent.required=pers;$("checkoutForm").elements.salesConsent.required=pers;closeCart();$("checkoutDialog").showModal()};

function clearAddr(){$("addressValidatedInput").value="false";$("postalCodeInput").value="";$("cityInput").value="";$("cityCodeInput").value="";$("addressLabelInput").value="";$("addressError").hidden=true}
$("addressInput").addEventListener("input",()=>{clearAddr();const q=$("addressInput").value.trim();clearTimeout(addressTimer);if(q.length<4){$("addressSuggestions").hidden=true;return}addressTimer=setTimeout(()=>loadAddr(q),250)});
async function loadAddr(q){try{const r=await fetch(`${API}/address-search?q=${encodeURIComponent(q)}`),d=await r.json();const box=$("addressSuggestions");box.innerHTML="";for(const a of d.suggestions||[]){const b=document.createElement("button");b.type="button";b.textContent=a.label;b.onclick=()=>{$("addressInput").value=a.street||a.label;$("postalCodeInput").value=a.postcode;$("cityInput").value=a.city;$("cityCodeInput").value=a.citycode||"";$("addressLabelInput").value=a.label;$("addressValidatedInput").value="true";$("addressError").hidden=true;box.hidden=true};box.appendChild(b)}box.hidden=!box.children.length}catch{$("addressSuggestions").hidden=true}}

$("checkoutForm").onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.currentTarget),pers=cart.some(x=>x.personalized),status=$("checkoutStatus");if(fd.get("addressValidated")!=="true"){$("addressError").hidden=false;return}const body={customer:{firstName:fd.get("firstName"),lastName:fd.get("lastName"),email:fd.get("email"),phone:fd.get("phone"),address:fd.get("address"),postalCode:fd.get("postalCode"),city:fd.get("city"),cityCode:fd.get("cityCode"),addressLabel:fd.get("addressLabel")},voucherCode:String(fd.get("voucherCode")||"").trim(),photoConsent:!pers||fd.get("photoConsent")==="on",salesConsent:!pers||fd.get("salesConsent")==="on",items:cart.map(x=>({id:x.id,quantity:1,personalization:x.personalization||null}))};try{$("pay").disabled=true;status.textContent="Validation de l’adresse…";let r=await fetch(API+"/address-validate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body.customer)}),d=await r.json();if(!r.ok||!d.valid)throw new Error(d.error||"Adresse non reconnue.");body.customer={...body.customer,...d.address};status.textContent="Calcul de la livraison…";r=await fetch(API+"/shipping-quote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer:body.customer,items:body.items})});d=await r.json();if(!r.ok)throw new Error(d.error||"Livraison indisponible.");body.shippingQuote=d.quote;$("shippingQuote").textContent=`Livraison suivie : ${euro(d.quote.amountEur)} — ${d.quote.logisticName}`;status.textContent="Ouverture du paiement SumUp…";r=await fetch(API+"/create-checkout-session-v2",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});d=await r.json();if(!r.ok||!d.url)throw new Error(d.error||"Paiement indisponible.");location.href=d.url}catch(err){status.textContent=err.message;$("pay").disabled=false}};

renderProducts();renderCart();
