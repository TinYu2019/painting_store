"use client";

import { EmbeddedCheckoutButton } from "./components/EmbeddedCheckoutForm";
import { useEffect, useCallback, useState } from "react";
import Image from "next/image";

export const Home = () => {
  // TODO: type product
  const [products, setProducts] = useState<any | null>(null);
  const [prices, setPrices] = useState<any | null>(null);

  const fetchProducts = useCallback(async () => {
    const response = await fetch("/api/backend/products", {
      method: "GET",
    }).then((res) => res.json());

    setProducts(response.products);
  }, []);

  const fetchPrice = useCallback(async () => {
    const response = await fetch("/api/backend/prices").then((res) =>
      res.json()
    );

    setPrices(response.prices);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  if (!products || products.length === 0) {
    return null;
  }
  return (
    <div>
      <div
        style={{
          padding: 20,
          fontSize: 30,
        }}
      >
        Available Products
      </div>
      {/* TODO: type product */}
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
            <Product product={product} prices={prices} />
            <EmbeddedCheckoutButton
              productDefaultPrice={product.default_price}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Product = ({ product, prices }: any) => {
  const { id, images, default_price, name } = product;

  let price;
  if (prices) {
    price = prices.find((item: any) => item.id === default_price);
  }

  return (
    <div>
      {images && (
        <Image
          src={images[0]}
          alt={images[0].name}
          width={100}
          height={100}
          style={{
            marginBottom: 10,
          }}
        />
      )}
      <div>Name: {name}</div>
      {price && (
        <div>
          {`Price: ${price.currency.toUpperCase()}${price.unit_amount / 100}`}
        </div>
      )}
      <div>Description: ...</div>
    </div>
  );
};

export default Home;
