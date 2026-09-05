import { createHash, randomBytes } from "node:crypto";
import { cleanText, customerStore, customerTokenStore, jsonHeaders } from "../lib/orders.mjs";

const accountUrl = token => `https://evida-france.github.io/evida-fr.github.io/account.html?token=${token}`;
async function welcome(record) {
  const key = process.env.RESEND_API_KEY, from = process.env.EVIDA_FROM_EMAIL;
  if (!key || !from) return "configuration_required";
  const result = await fetch("https://api.resend.com/emails", { method:"POST", headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"}, body:JSON.stringify({from,to:[record.email],subject:"Bienvenue dans le cercle ÉVIDA",html:`<h1>Bienvenue ${record.firstName}</h1><p>Vous faites maintenant partie du cercle ÉVIDA.</p><p>Vous recevrez nos nouveaux produits phares et nos offres réservées.</p><p><a href="${accountUrl(record.accountToken)}">Accéder à mon espace ÉVIDA</a></p><p><a href="https://evida-france.github.io/evida-fr.github.io/unsubscribe.html?token=${record.accountToken}">Me désinscrire des offres</a></p><p>ÉVIDA</p>`}) });
  return result.ok ? "sent" : "failed";
}
export async function handler(event) {
  const headers=jsonHeaders(event.headers?.origin||"");
  if(event.httpMethod==="OPTIONS")return{statusCode:204,headers,body:""};
  if(event.httpMethod!=="POST")return{statusCode:405,headers,body:JSON.stringify({error:"Méthode non autorisée."})};
  try{
    const body=JSON.parse(event.body||"{}"),action=body.action||"subscribe";
    if(action==="unsubscribe"){
      const token=String(body.token||""),emailKey=await customerTokenStore().get(token,{type:"text"}),store=customerStore(),record=emailKey?await store.get(emailKey,{type:"json"}):null;
      if(!record||record.accountToken!==token)throw new Error("Lien invalide.");record.marketingConsent=false;record.unsubscribedAt=new Date().toISOString();await store.setJSON(emailKey,record);return{statusCode:200,headers,body:JSON.stringify({message:"Vous êtes désinscrit des offres ÉVIDA."})};
    }
    const firstName=cleanText(body.firstName,80),email=cleanText(body.email,160).toLowerCase();
    if(!firstName||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||body.consent!==true)throw new Error("Prénom, e-mail et consentement sont obligatoires.");
    const emailKey=createHash("sha256").update(email).digest("hex"),store=customerStore(),existing=await store.get(emailKey,{type:"json"}),now=new Date().toISOString();
    const record={...existing,email,firstName,accountToken:existing?.accountToken||randomBytes(32).toString("hex"),accountEnabled:true,marketingConsent:true,marketingConsentAt:now,orders:existing?.orders||[],createdAt:existing?.createdAt||now,updatedAt:now};
    await store.setJSON(emailKey,record);await customerTokenStore().set(record.accountToken,emailKey);const emailStatus=await welcome(record);
    return{statusCode:200,headers,body:JSON.stringify({message:"Bienvenue dans le cercle ÉVIDA !",emailStatus})};
  }catch(error){return{statusCode:400,headers,body:JSON.stringify({error:error.message||"Inscription impossible."})}}
}
