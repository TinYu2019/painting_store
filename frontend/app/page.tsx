"use client";

import EmbeddedCheckoutButton from "./EmbeddedCheckoutForm";
import { useEffect, useCallback, useState } from "react";
import Image from "next/image";

export default function Home() {
  // TODO: type product
  const [products, setProducts] = useState<any | null>(null);

  const fetchProducts = useCallback(async () => {
    const response = await fetch("/api/fetch-products", {
      method: "GET",
    }).then((res) => res.json());
    // .then((data) => data.client_secret);

    setProducts(response.products);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (!products || products.length === 0) {
    return null;
  }
  return (
    <div>
      <div>Available Products: </div>
      {/* TODO: type produc */}
      <div>
        {products.map((product: any) => (
          <div
            key={product.id}
            style={{
              display: "inline-grid",
              margin: 10,
              padding: 10,
            }}
          >
            <Product product={product} />
            <EmbeddedCheckoutButton
              productDefaultPrice={product.default_price}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Product({ product }: any) {
  const { id, images, default_price, name } = product;
  return (
    <div>
      <Image src={images[0]} alt="" width={100} height={100} />
      <div style={textColor}>Name: {name}</div>
      <div>Price: {default_price as string}</div>
      <div>Description: ...</div>
    </div>
  );
}

const textColor = {
  color: "",
};
