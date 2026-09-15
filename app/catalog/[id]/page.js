"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "../../components/Header";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!params?.id) return;

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const found = Array.isArray(data)
          ? data.find((item) => String(item.id) === String(params.id))
          : null;

        setProduct(found || null);
      });
  }, [params?.id]);

  function addToCart() {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("houseMixCart") || "[]");
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("houseMixCart", JSON.stringify(cart));
    setMessage("Товар додано в кошик!");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  }

  if (!product) {
    return (
      <>
        <Header />
        <main style={{ padding: "60px 20px", textAlign: "center" }}>
          <h1>Товар не знайдено</h1>
          <Link href="/catalog">← Повернутися до каталогу</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      {message && (
        <div
          style={{
            position: "fixed",
            top: "95px",
            right: "25px",
            background: "#111",
            color: "white",
            padding: "15px 22px",
            borderRadius: "10px",
            zIndex: 100,
          }}
        >
          {message}
        </div>
      )}

      <main
        style={{
          minHeight: "calc(100vh - 80px)",
          background: "#f5f5f5",
          padding: "40px 20px 60px",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <Link
            href="/catalog"
            style={{
              color: "#111",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: "25px",
            }}
          >
            ← Назад до каталогу
          </Link>

          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "30px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
            }}
          >
            <div
              style={{
                height: "450px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fafafa",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <span>Фото відсутнє</span>
              )}
            </div>

            <div>
              <h1 style={{ fontSize: "34px", marginBottom: "15px" }}>
                {product.name}
              </h1>

              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  marginBottom: "25px",
                }}
              >
                {product.price} грн
              </div>

              <div
                style={{
                  fontSize: "17px",
                  lineHeight: "1.7",
                  whiteSpace: "pre-wrap",
                  marginBottom: "30px",
                }}
              >
                {product.description || "Опис товару поки відсутній."}
              </div>

              <button
                onClick={addToCart}
                style={{
                  width: "100%",
                  padding: "16px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#111",
                  color: "white",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                🛒 Додати в кошик
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}