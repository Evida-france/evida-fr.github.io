import { jsonHeaders, orderStore, sendShippingConfirmation } from "../lib/orders.mjs";
const authorized = event => Boolean(process.env.EVIDA_ADMIN_TOKEN) && event.headers?.authorization === `Bearer ${process.env.EVIDA_ADMIN_TOKEN}`;
const safeOrder = order => ({ ...order, accessToken: undefined, accountToken: undefined });
export async function handler(event) {
  const headers=jsonHeaders(event.headers?.origin||"");if(event.httpMethod==="OPTIONS")return{statusCode:204,headers,body:""};
  if(!authorized(event))return{statusCode:401,headers,body:JSON.stringify({error:"Accès refusé."})};
  try{
    const store=orderStore();
    if(event.httpMethod==="GET"){
      const id=String(event.queryStringParameters?.id||"");
      if(id){const order=await store.get(id,{type:"json"});return{statusCode:order?200:404,headers,body:JSON.stringify(order?{order:safeOrder(order)}:{error:"Commande introuvable."})}}
      const listing=await store.list({paginate:false}),orders=[];
      for(const blob of listing.blobs.slice(-200)){const order=await store.get(blob.key,{type:"json"});if(order)orders.push(safeOrder(order))}
      orders.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));return{statusCode:200,headers,body:JSON.stringify({orders})};
    }
    if(event.httpMethod==="PATCH"){
      const body=JSON.parse(event.body||"{}"),order=await store.get(String(body.id||""),{type:"json"});if(!order)return{statusCode:404,headers,body:JSON.stringify({error:"Commande introuvable."})};
      const allowed=["fulfillmentStatus","carrier","trackingNumber","trackingUrl"];for(const key of allowed)if(typeof body[key]==="string")order[key]=body[key].trim().slice(0,300);order.updatedAt=new Date().toISOString();if(order.fulfillmentStatus==="shipped")order=await sendShippingConfirmation(order);await store.setJSON(order.id,order);return{statusCode:200,headers,body:JSON.stringify({order:safeOrder(order)})};
    }
    return{statusCode:405,headers,body:JSON.stringify({error:"Méthode non autorisée."})};
  }catch(error){console.error(error);return{statusCode:500,headers,body:JSON.stringify({error:"Erreur du tableau de commandes."})}}
}
