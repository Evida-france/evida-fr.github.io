import {createHash,randomBytes,randomUUID} from "node:crypto";
import {cleanText,configureBlobs,contestCheckoutStore,contestEmailStore,contestStore,jsonHeaders} from "../lib/orders.mjs";

const FRONT="https://evida-france.github.io/evida-fr.github.io/";
const FUNCTIONS="https://evida-france.netlify.app/.netlify/functions";
const REUSE_WINDOW_MS=20*60*1000; // ne jamais réutiliser un checkout proche de l'expiration SumUp

export async function handler(event){
  configureBlobs(event);
  const headers=jsonHeaders(event.headers?.origin||"");

  if(event.httpMethod==="OPTIONS"){
    return{statusCode:204,headers,body:""};
  }

  if(event.httpMethod!=="POST"){
    return{statusCode:405,headers,body:JSON.stringify({error:"Méthode non autorisée."})};
  }

  try{
    const apiKey=process.env.SUMUP_API_KEY;
    const merchant=process.env.SUMUP_MERCHANT_CODE;

    if(!apiKey||!merchant){
      throw new Error("Configuration SumUp incomplète.");
    }

    const b=JSON.parse(event.body||"{}");
    const firstName=cleanText(b.firstName,80);
    const lastName=cleanText(b.lastName,80);
    const email=cleanText(b.email,160).toLowerCase();

    if(
      !firstName||
      !lastName||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||
      b.rules!==true
    ){
      throw new Error("Nom, prénom, e-mail et acceptation du règlement sont obligatoires.");
    }

    const emailKey=createHash("sha256").update(email).digest("hex");
    const emailIndex=contestEmailStore();
    const existingId=await emailIndex.get(emailKey,{type:"text"});

    if(existingId){
      const existing=await contestStore().get(existingId,{type:"json"});

      if(existing?.paymentStatus==="PAID"){
        throw new Error("Une participation payée est déjà enregistrée pour cette adresse e-mail.");
      }

      if(existing?.checkoutUrl&&existing?.paymentStatus==="PENDING"){
        const createdAtMs=Date.parse(existing.createdAt||"");
        const age=Date.now()-createdAtMs;

        if(Number.isFinite(age)&&age>=0&&age<REUSE_WINDOW_MS){
          return{
            statusCode:200,
            headers,
            body:JSON.stringify({
              url:existing.checkoutUrl,
              entryId:existing.id,
              accessToken:existing.accessToken
            })
          };
        }
        // Si l'ancien checkout est trop vieux, on en crée un nouveau ci-dessous.
      }
    }

    const id=`EVIDA-JEU-${Date.now()}-${randomUUID().slice(0,6).toUpperCase()}`;
    const accessToken=randomBytes(24).toString("hex");
    const voucherCode=`EVIDA-${randomBytes(4).toString("hex").toUpperCase()}`;

    const entry={
      id,
      accessToken,
      firstName,
      lastName,
      email,
      createdAt:new Date().toISOString(),
      paymentStatus:"PENDING",
      amount:1999,
      currency:"EUR",
      voucherCode,
      rulesAcceptedAt:new Date().toISOString(),
      contest:"iPhone 16 Pro Max — 19/09/2026 au 19/10/2026"
    };

    const r=await fetch("https://api.sumup.com/v0.1/checkouts",{
      method:"POST",
      headers:{
        Authorization:`Bearer ${apiKey}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        checkout_reference:id,
        amount:19.99,
        currency:"EUR",
        merchant_code:merchant,
        description:"Bon numérique ÉVIDA 19,99 € + participation jeu concours",
        return_url:`${FUNCTIONS}/sumup-webhook`,
        redirect_url:`${FRONT}?jeu=retour&entry=${encodeURIComponent(id)}&token=${accessToken}`,
        hosted_checkout:{enabled:true}
      })
    });

    const d=await r.json().catch(()=>({}));

    if(!r.ok||!d.hosted_checkout_url){
      const sumupMessage=
        d?.message||
        d?.error_message||
        d?.error||
        `Erreur SumUp HTTP ${r.status}`;
      throw new Error(sumupMessage);
    }

    entry.checkoutId=d.id;
    entry.checkoutUrl=d.hosted_checkout_url;

    await contestStore().setJSON(id,entry);
    await contestCheckoutStore().set(d.id,id);
    await emailIndex.set(emailKey,id);

    return{
      statusCode:200,
      headers,
      body:JSON.stringify({
        url:d.hosted_checkout_url,
        entryId:id,
        accessToken
      })
    };

  }catch(e){
    console.error("create-contest-checkout:",e);
    return{
      statusCode:400,
      headers,
      body:JSON.stringify({error:e?.message||"Inscription impossible."})
    };
  }
}
