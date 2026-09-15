"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []));
  }, []);

  function addToCart(product) {
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

    setMessage(`«${product.name}» додано в кошик!`);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  }

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
              boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
            }}
          >
            {message}
          </div>
        )}

        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          <h1
            style={{
              fontSize: "38px",
              marginBottom: "30px",
            }}
          >
            Каталог товарів
          </h1>

          {products.length === 0 ? (
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
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "25px",
              }}
            >
              {products.map((product) => (
                <article
                  key={product.id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
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

                    <p
                      style={{
                        color: "#555",
                        minHeight: "45px",
                      }}
                    >
                      {product.description}
                    </p>

                    <strong
                      style={{
                        display: "block",
                        fontSize: "22px",
                        marginTop: "15px",
                      }}
                    >
                      {product.price} грн
                    </strong>

                    <button
                      onClick={() => addToCart(product)}
                      style={{
                        width: "100%",
                        marginTop: "15px",
                        padding: "13px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#111",
                        color: "white",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                    >
                      🛒 Додати в кошик
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}