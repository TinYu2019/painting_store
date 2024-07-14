import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import Stripe from "stripe";
import { HTTPException } from "hono/http-exception";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const app = new Hono();

app.get("/products", async (c) => {
  console.log("[PRODUCTS] Received request to fetch products from backend");
  try {
    const products = await stripe.products.list();
    console.log(`[PRODUCTS] Sending back ${products.data.length} products`);

    return c.json(products);
  } catch (error: any) {
    console.error(`[PRODUCTS] Error getting products, ${error.message}`);
    throw new HTTPException(500);
  }
});

app.get("/prices", async (c) => {
  console.log("[PRICES] Received request to retrieve prices...");

  try {
    const price = await stripe.prices.list();

    console.log("[PRICES] Returning prices...");

    return c.json({
      price,
    });
  } catch (error: any) {
    console.error(`[PRICES] Error getting prices, ${error.message}`);
    throw new HTTPException(500);
  }
});

// Create a Payment Intent session
app.post("/embedded-checkout", async (c) => {
  try {
    const { priceId } = await c.req.json();

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price: priceId,
        },
      ],
      mode: "payment",
      return_url: `http://localhost:3000/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return c.json({
      id: session.id,
      client_secret: session.client_secret,
    });
  } catch (error: any) {
    console.error(
      `[EMBEDDED_CHECKOUT] Error getting embedded checkout form: ${error.message}`
    );
    throw new HTTPException(500);
  }
});

app.post("/webhook", async (c) => {
  console.log("[WEBHOOK] received request to create webhook event..");
  const rawBody = await c.req.text();
  // request sent by stripe contains a signature, which can only be verified by the webhook signing secret provide by stripe
  const signature = c.req.header("stripe-signature");

  let event;
  try {
    // validate the webhook event comes from stripe
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(
      `[WEBHOOK] Webhook signature verification failed: ${error.message}`
    );
    throw new HTTPException(400);
  }

  // we can check different ever type here
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log(
      `[WEBHOOK] checkout session completed: ${JSON.stringify(session)}`
    );

    // others actions
    // update databse with order details
    // send confirmation email
    // ...
  }

  return c.text("Success...");
});

const port = 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
