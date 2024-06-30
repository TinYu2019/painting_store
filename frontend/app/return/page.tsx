import { stripe } from "@/utils/stripe";

export async function getSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  console.log("getSession session>>", session);
  return session;
}

export default async function CheckoutReturn({ searchParams }: any) {
  const sessionId = searchParams.session_id;
  const session = await getSession(sessionId);

  if (session?.status === "open") {
    return <p>Payment not successful</p>;
  }

  if (session?.status === "complete") {
    return (
      <h1>
        Thank you for your support! Your stripe customer id:
        {session.customer as string}
      </h1>
    );
  }
  console.log("session>>>", session);
}
