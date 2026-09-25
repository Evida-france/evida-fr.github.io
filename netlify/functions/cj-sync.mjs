import {configureBlobs,orderStore,sendConfirmation,sendShippingConfirmation} from "../lib/orders.mjs";
import {fulfillPaidOrderWithCJ,syncCJOrder} from "../lib/cj.mjs";

// Exécutée automatiquement toutes les 15 minutes par Netlify.
// Elle couvre aussi les rares cas où le webhook SumUp est retardé.
export default async function handler(event){
  configureBlobs(event);
  const store=orderStore();
  const listing=await store.list({paginate:false});
  const keys=listing.blobs.map(x=>x.key).slice(-20);
  for(const key of keys){
    try{
      let order=await store.get(key,{type:"json"});
      if(!order||order.paymentStatus!=="PAID")continue;
      if(!order.confirmationSentAt)order=await sendConfirmation(order);
      if(!order.cj?.orderId&&order.cj?.status!=="manual_personalization"&&order.cj?.status!=="not_applicable"){
        try{order=await fulfillPaidOrderWithCJ(order)}catch(error){order.cj={...(order.cj||{}),status:"error",error:error.message,lastRetryAt:new Date().toISOString()}}
      }
      if(order.cj?.orderId)order=await syncCJOrder(order);
      if(order.trackingNumber&&!order.shippingEmailSentAt)order=await sendShippingConfirmation(order);
      await store.setJSON(key,order);
    }catch(error){console.error("CJ sync",key,error)}
  }
}
