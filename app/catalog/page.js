"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />

      <main
        style={{
          minHeight: "calc(100vh - 80px)",
          background: "#f5f5f5",
          paddingBottom: "50px",
        }}
      >
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          <h1 style={{ fontSize: "38px", marginBottom: "30px" }}>
            Каталог товарів
          </h1>

          {loading ? (
            <div
              style={{
                background: "white",
                padding: "40px",
                borderRadius: "16px",
                textAlign: "center",
              }}
            >
              <h2>Завантаження товарів...</h2>
            </div>
          ) : products.length === 0 ? (
            <div
              style={{
                background: "white",
                padding: "40px",
                borderRadius: "16px",
                textAlign: "center",
              }}
            >
              <h2>Товарів поки немає</h2>
              <p>Додай перший товар через адмін-панель.</p>

              <Link
                href="/admin"
                style={{
                  display: "inline-block",
                  marginTop: "15px",
                  padding: "12px 24px",
                  background: "#111",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                Відкрити адмін-панель
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "25px",
              }}
            >
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/catalog/${product.id}`}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                    textDecoration: "none",
                    color: "#111",
                    display: "block",
                  }}
                >
                  <div
                    style={{
                      height: "260px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#fafafa",
                      padding: "15px",
                      boxSizing: "border-box",
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

                  <div style={{ padding: "18px" }}>
                    <h2
                      style={{
                        fontSize: "20px",
                        margin: "0 0 10px",
                      }}
                    >
                      {product.name}
                    </h2>

                    <strong
                      style={{
                        display: "block",
                        fontSize: "22px",
                      }}
                    >
                      {product.price} грн
                    </strong>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}