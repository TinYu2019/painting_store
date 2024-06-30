import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import Stripe from "stripe";
import { HTTPException } from "hono/http-exception";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const app = new Hono();

app.get("/", (c) => {
  const html = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://js.stripe.com/v3"></script>
      <title>Checkout</title>
  </head>
  
  <body>
      <h1>Checkout</h1>
      <button id="checkoutButton">Checkout</button>
      <img src="https://files.stripe.com/links/MDB8YWNjdF8xT3plUFJQNlF0NHhJY1FufGZsX3Rlc3RfckNReDI3S2JWa0prUFM4WUZTVTNWT3Zq00XrPxRTqh"
      style="width:100px;" alt="">
      <script>
          const checkoutButton = document.getElementById("checkoutButton");
          checkoutButton.addEventListener("click", async () => {
            console.log("checkout clicked!");
              const response = await fetch("/checkout", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  }
              });
              const { id } = await response.json();
              console.log("sessionId >>>", id);
              const stripe = Stripe('${process.env.STRIPE_PUBLISHABLE_KEY}');
              await stripe.redirectToCheckout({ sessionId: id });
          })
      </script>
  </body>
  </html>`;

  return c.html(html);
});

app.post("/checkout", async (c) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "dummyId",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3001/success",
      cancel_url: "http://locaohost:3001/cancel",
    });

    return c.json(session);
  } catch (error: any) {
    console.error(error);
    throw new HTTPException(500, { message: error?.message });
  }
});

app.post("/webhook", async (c) => {
  const rawBody = await c.req.text();
  const signature = c.req.header("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    throw new HTTPException(400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log(session);
  }

  return c.text("Oh Success!!");
});

app.get("/success", (c) => {
  return c.text("Success :)!!!");
});

app.get("/cancel", (c) => {
  return c.text("Cancel :( !!!");
});

app.get("products", async (c) => {
  console.log("BE products is called");

  const products = await stripe.products.list();

  return c.json(products);
});

// curl -G https://api.stripe.com/v1/products \
//   -u "sk_test_51OzePRP6Qt4xIcQnZsYQkussQQFbtXH7F5hihGWYFKzVgDoJ45CyVkBVZrm6COTui1aC39R8VpjfcnfSQ5PE9Xuk00KI0mjk1V:" \
//   -d limit=3

const port = 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
