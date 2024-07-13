import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { priceId } = await request.json();

    return await fetch("http:localhost:3001/embedded-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId }),
    });
  } catch (error: any) {
    console.error(
      `[EMBEDDED_CHECKOUT] Error fetching embedded checkout: ${error}`
    );
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
