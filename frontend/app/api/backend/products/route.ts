import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    console.log("[PRODUCTS] Fetching products from backend...");
    const res = await fetch(`http://localhost:3001/products`);
    const data = await res.json();

    console.log(`[PRODUCTS] Received ${data.data.length} products`);
    return NextResponse.json({
      products: data.data,
    });
  } catch (error: any) {
    console.error(`[PRODUCTS] Error fetching products ${error}`);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
