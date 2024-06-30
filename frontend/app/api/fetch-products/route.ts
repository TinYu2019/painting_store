import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";

export async function GET() {
  try {
    console.log("fetching products...");
    const products = await stripe.products.list();

    console.log(`retrieve ${products.data.length} products`);
    console.log("products>>>>", products);

    return NextResponse.json({
      products: products.data,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
