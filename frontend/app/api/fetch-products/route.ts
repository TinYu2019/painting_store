import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";

export const GET = async () => {
  try {
    console.log("[PRODUCTS_FE] fetching products...");

    const products = await stripe.products.list();

    console.log(`[PRODUCTS_FE] retrieve ${products.data.length} products`);

    return NextResponse.json({
      products: products.data,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
