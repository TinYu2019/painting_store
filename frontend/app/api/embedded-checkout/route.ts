import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";

export const POST = async (request: Request) => {
  try {
    const { priceId } = await request.json();
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
      return_url: `${request.headers.get(
        "origin"
      )}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    });
  } catch (error: any) {
    console.error(`[EMBEDDED_CHECKOUT_FE] Error in embedded checkout ${error}`);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
