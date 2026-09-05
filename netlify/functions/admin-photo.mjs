import { orderStore, photoStore } from "../lib/orders.mjs";
export async function handler(event){
  if(!process.env.EVIDA_ADMIN_TOKEN||event.headers?.authorization!==`Bearer ${process.env.EVIDA_ADMIN_TOKEN}`)return{statusCode:401,body:"Accès refusé."};
  try{const orderId=String(event.queryStringParameters?.order||""),index=Number(event.queryStringParameters?.item||0),order=await orderStore().get(orderId,{type:"json"}),item=order?.items?.[index];if(!item?.photoKey)return{statusCode:404,body:"Photo introuvable."};const result=await photoStore().getWithMetadata(item.photoKey,{type:"arrayBuffer"});if(!result)return{statusCode:404,body:"Photo introuvable."};return{statusCode:200,headers:{"Content-Type":result.metadata?.contentType||"image/jpeg","Cache-Control":"no-store"},isBase64Encoded:true,body:Buffer.from(result.data).toString("base64")}}catch{return{statusCode:500,body:"Erreur photo."}}
}
