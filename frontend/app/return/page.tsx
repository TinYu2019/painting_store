import { stripe } from "@/utils/stripe";
import Link from "next/link";

export const getSession = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  console.log("getSession session>>", session);
  return session;
};

export const CheckoutReturn = async ({ searchParams }: any) => {
  const sessionId = searchParams.session_id;
  const session = await getSession(sessionId);

  if (session?.status === "open") {
    return <p>Payment not successful</p>;
  }

  if (session?.status === "complete") {
    return (
      <div
        style={{
          padding: 80,
        }}
      >
        <div>
          Thank you {session.customer_details?.name} for your support! Your
          payment is completed.
        </div>

        <div>
          You will received an confirmation email with the registered email:
          {session.customer_details?.email}
        </div>
        <div
          style={{
            marginTop: 20,
          }}
        >
          Paymentintent: {session.payment_intent as string}
        </div>
        <Link
          className="btn"
          style={{
            marginTop: 20,
          }}
          href={"/"}
        >
          Go back home page
        </Link>
      </div>
    );
  }
  console.log("session>>>", session);
};

export default CheckoutReturn;
