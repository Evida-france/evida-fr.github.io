import { configureBlobs, orderStore, sendShippingConfirmation } from "../lib/orders.mjs";
import { fulfillPaidOrderWithCJ, syncCJOrder } from "../lib/cj.mjs";

export const config = { schedule: "@hourly" };
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default async function handler(event) {
  configureBlobs(event);
  const store = orderStore();
  const listing = await store.list({ paginate: false });
  const keys = listing.blobs.map(x => x.key).slice(-50);

  for (const key of keys) {
    try {
      let order = await store.get(key, { type: "json" });
      if (!order || order.paymentStatus !== "PAID") continue;

      if (!order.cj?.orderId && !["not_applicable", "manual_personalization"].includes(order.cj?.status)) {
        order = await fulfillPaidOrderWithCJ(order);
        await store.setJSON(key, order);
        await sleep(1100);
      }

      if (order.cj?.orderId || order.cj?.submittedAt) {
        order = await syncCJOrder(order);
        if (order.trackingNumber && !order.shippingEmailSentAt) {
          order = await sendShippingConfirmation(order);
        }
        await store.setJSON(key, order);
        await sleep(1100);
      }
    } catch (error) {
      console.error("CJ scheduled sync:", key, error);
    }
  }
}
