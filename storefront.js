const API="https://evida-france.netlify.app/.netlify/functions";
const products=[
  {id:208,category:"Animaux",name:"Pack complet anti-poils — 4 pièces",price:29.90,image:"assets/products/pack-anti-poils.webp",description:"La solution complète pour retirer les poils du canapé, des vêtements, de la voiture et pendant le lavage.",details:"1 grande brosse · 1 petite brosse · 2 collecteurs de lavage",personalized:false},
  {id:207,category:"Personnalisé",name:"Bijou personnalisé — portrait d’animal",price:24.90,image:"assets/products/bijou-animal.webp",description:"Ajoutez directement la photo de votre animal et vérifiez l’aperçu avant de payer.",details:"Pendentif aspect acier · gravure personnalisée · chaîne incluse",personalized:true,finishes:["Argent","Or","Or rose"],sizes:["Chaîne 45 cm + extension 5 cm"]},
  {id:206,category:"Personnalisé",name:"Plaid personnalisé — portrait d’animal",price:39.90,image:"assets/products/plaid-animal.webp",description:"Ajoutez directement votre photo : elle restera liée de manière sécurisée à votre commande.",details:"Personnalisation sur photo · aperçu validé avant fabrication",personalized:true,finishes:["Impression portrait"],sizes:["Format standard — dimensions à confirmer"]}
];
let category="Tous",cart=[],pendingProduct=null,pendingPhoto=null;
try{cart=JSON.parse(sessionStorage.getItem("evida-cart")||"[]")}catch{cart=[]}
const $=id=>document.getElementById(id),euro=n=>n.toLocaleString("fr-FR",{style:"currency",currency:"EUR"});

function saveCart(){try{sessionStorage.setItem("evida-cart",JSON.stringify(cart))}catch{}renderCart()}
function renderProducts(){
  const q=$("search").value.trim().toLowerCase();
  const list=products.filter(p=>(category==="Tous"||p.category===category)&&(p.name.toLowerCase().includes(q)||p.description.toLowerCase().includes(q)));
  $("grid").innerHTML=list.length?list.map(p=>`<article class="product"><div class="visual"><img src="${p.image}" alt="${p.name}" loading="lazy"></div><div class="body"><div class="tag">${p.category}</div><h3>${p.name}</h3><div class="desc">${p.description}</div><div class="details">${p.details}</div><div class="price">${euro(p.price)}</div><div class="shipping">Livraison : 4,90 € · offerte dès 50 €</div><button class="add" data-product="${p.id}">${p.personalized?"Personnaliser":"Ajouter au panier"}</button></div></article>`).join(""):"<p>Aucun produit trouvé.</p>";
  document.querySelectorAll("[data-product]").forEach(btn=>btn.onclick=()=>chooseProduct(Number(btn.dataset.product)));
}
function chooseProduct(id){
  const p=products.find(x=>x.id===id); if(!p)return;
  if(!p.personalized){cart.push({...p,lineId:crypto.randomUUID(),quantity:1});saveCart();openCart();return}
  pendingProduct=p;pendingPhoto=null;$("personalTitle").textContent=p.name;$("personalForm").reset();$("photoPreview").style.display="none";$("photoPreview").removeAttribute("src");$("previewHint").style.display="block";$("personalStatus").textContent="";
  $("finish").innerHTML=p.finishes.map(x=>`<option>${x}</option>`).join("");$("size").innerHTML=p.sizes.map(x=>`<option>${x}</option>`).join("");
  $("finishLabel").style.display=p.finishes.length>1?"grid":"none";$("personalDialog").showModal();
}
async function compressImage(file){
  if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw new Error("Choisissez une image JPG, PNG ou WebP.");
  if(file.size>12*1024*1024)throw new Error("La photo d’origine est trop volumineuse (12 Mo maximum).");
  const bitmap=await createImageBitmap(file),scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement("canvas");canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
  canvas.getContext("2d").drawImage(bitmap,0,0,canvas.width,canvas.height);
  const data=canvas.toDataURL("image/jpeg",.82);bitmap.close();
  if(data.length>4*1024*1024)throw new Error("La photo reste trop volumineuse. Choisissez une image plus légère.");
  return {data,type:"image/jpeg",name:file.name.slice(0,100)};
}
$("photo").onchange=async e=>{try{$("personalStatus").textContent="Préparation de la photo…";pendingPhoto=await compressImage(e.target.files[0]);$("photoPreview").src=pendingPhoto.data;$("photoPreview").style.display="block";$("previewHint").style.display="none";$("personalStatus").textContent="Photo prête."}catch(err){pendingPhoto=null;$("personalStatus").textContent=err.message}};
$("personalForm").onsubmit=e=>{e.preventDefault();if(!pendingProduct||!pendingPhoto){$("personalStatus").textContent="Ajoutez d’abord une photo.";return}if(!$("photoValidated").checked){$("personalStatus").textContent="Confirmez l’aperçu.";return}cart.push({...pendingProduct,lineId:crypto.randomUUID(),quantity:1,personalization:{text:$("customText").value.trim(),finish:$("finish").value,size:$("size").value,photo:pendingPhoto,photoValidated:true}});saveCart();$("personalDialog").close();openCart()};

function renderCart(){
  $("cartCount").textContent=cart.reduce((s,p)=>s+p.quantity,0);
  $("cartItems").innerHTML=cart.length?cart.map(p=>`<div class="cartItem"><strong>${p.name}</strong><div>${p.quantity} × ${euro(p.price)}</div>${p.personalization?`<div class="personalSummary">${p.personalization.finish} · ${p.personalization.size}${p.personalization.text?` · « ${p.personalization.text} »`:""} · photo ajoutée</div>`:""}<button data-remove="${p.lineId}">Retirer</button></div>`).join(""):'<div class="empty">Votre panier est vide.</div>';
  document.querySelectorAll("[data-remove]").forEach(btn=>btn.onclick=()=>{cart=cart.filter(x=>x.lineId!==btn.dataset.remove);saveCart()});
  const subtotal=cart.reduce((s,p)=>s+p.price*p.quantity,0),shipping=cart.length?(subtotal>=50?0:4.90):0;
  $("subtotal").textContent=euro(subtotal);$("shipping").textContent=shipping?euro(shipping):cart.length?"Offerte":euro(0);$("total").textContent=euro(subtotal+shipping);
}
const drawer=$("drawer"),overlay=$("overlay");function openCart(){drawer.classList.add("open");overlay.classList.add("show")}function closeCart(){drawer.classList.remove("open");overlay.classList.remove("show")}
$("openCart").onclick=openCart;$("closeCart").onclick=closeCart;overlay.onclick=closeCart;
$("checkout").onclick=()=>{if(!cart.length){$("payStatus").textContent="Votre panier est vide.";return}const personalized=cart.some(x=>x.personalized);$("photoConsentRow").style.display=personalized?"flex":"none";$("salesConsentRow").style.display=personalized?"flex":"none";$("checkoutForm").elements.photoConsent.required=personalized;$("checkoutForm").elements.salesConsent.required=personalized;closeCart();$("checkoutDialog").showModal()};
document.querySelectorAll(".modalClose").forEach(btn=>btn.onclick=()=>btn.closest("dialog").close());

$("checkoutForm").onsubmit=async e=>{
  e.preventDefault();const form=e.currentTarget,pay=$("pay"),status=$("checkoutStatus");pay.disabled=true;status.textContent="Création de votre commande sécurisée…";
  const fd=new FormData(form),customer=Object.fromEntries(["firstName","lastName","email","address","postalCode","city"].map(k=>[k,fd.get(k)]));
  const hasPersonalized=cart.some(x=>x.personalized);const payload={customer,photoConsent:!hasPersonalized||fd.get("photoConsent")==="on",salesConsent:!hasPersonalized||fd.get("salesConsent")==="on",createAccount:fd.get("createAccount")==="on",marketingConsent:fd.get("marketingConsent")==="on",items:cart.map(p=>({id:p.id,quantity:p.quantity,personalization:p.personalization||null}))};
  try{const r=await fetch(`${API}/create-checkout-session-v2`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const d=await r.json();if(!r.ok||!d.url)throw new Error(d.error||"Paiement indisponible.");sessionStorage.setItem("evida-last-order",JSON.stringify({orderId:d.orderId,accessToken:d.accessToken}));location.href=d.url}catch(err){status.textContent=err.message;pay.disabled=false}
};
async function showReturnedOrder(){
  const params=new URLSearchParams(location.search);if(params.get("commande")!=="retour")return;
  const order=params.get("order"),token=params.get("token");$("orderDialog").showModal();
  try{const r=await fetch(`${API}/order-status?order=${encodeURIComponent(order)}&token=${encodeURIComponent(token)}`);const d=await r.json();if(!r.ok)throw new Error(d.error||"Commande introuvable.");
    if(d.order.paymentStatus==="PAID"){cart=[];saveCart();$("orderTitle").textContent="Paiement confirmé";$("orderResult").innerHTML=`<p class="ok"><strong>Merci, votre commande est enregistrée.</strong></p><p>Numéro de commande : <strong>${d.order.id}</strong></p><p>Un e-mail de confirmation va vous être envoyé.</p>`}
    else{$("orderTitle").textContent="Paiement en cours de vérification";$("orderResult").innerHTML=`<p>Statut SumUp : <strong>${d.order.paymentStatus}</strong></p><p>Conservez votre numéro : <strong>${d.order.id}</strong></p>`}
  }catch(err){$("orderTitle").textContent="Vérification impossible";$("orderResult").innerHTML=`<p class="error">${err.message}</p>`}
  history.replaceState({},document.title,location.pathname);
}
document.querySelectorAll(".filter").forEach(btn=>btn.onclick=()=>{category=btn.dataset.cat;document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");renderProducts()});
$("signupForm").onsubmit=async e=>{e.preventDefault();const form=e.currentTarget,status=$("signupStatus"),button=form.querySelector("button");button.disabled=true;status.textContent="Inscription en cours…";const fd=new FormData(form);try{const r=await fetch(`${API}/newsletter`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({firstName:fd.get("firstName"),email:fd.get("email"),consent:fd.get("consent")==="on"})});const d=await r.json();if(!r.ok)throw new Error(d.error);status.textContent=d.message;form.reset()}catch(err){status.textContent=err.message}finally{button.disabled=false}};
$("search").oninput=renderProducts;renderProducts();renderCart();showReturnedOrder();
