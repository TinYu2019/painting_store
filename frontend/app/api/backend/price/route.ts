import { log } from "console";
import { NextResponse } from "next/server";

export const GET = async (req: any) => {
  try {
    console.log("[PRICE] Fetching price from backend...");

    const res = await fetch(`http://localhost:3001/prices`);

    const data = await res.json();

    console.log(`[PRICE] Received price`, data);
    return NextResponse.json({
      prices: data.price.data,
    });
  } catch (error: any) {
    console.error(`[PRICE] Error fetching products ${error}`);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
