"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  function loadCart() {
    const saved = JSON.parse(localStorage.getItem("houseMixCart") || "[]");
    setCart(saved);
  }

  function updateCart(newCart) {
    setCart(newCart);
    localStorage.setItem("houseMixCart", JSON.stringify(newCart));
  }

  function increase(id) {
    const newCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    updateCart(newCart);
  }

  function decrease(id) {
    const newCart = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(newCart);
  }

  function removeItem(id) {
    const newCart = cart.filter((item) => item.id !== id);
    updateCart(newCart);
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <>
      <Header />

      <main className="hm-cart-main" style={{
          minHeight: "calc(100vh - 80px)",
          background: "url('/cart-background.png') center/cover no-repeat",
          paddingBottom: "50px",
        }}
      >
        <section
          style={{
            maxWidth: "1000px",
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
            🛒 Ваш кошик
          </h1>

          {cart.length === 0 ? (
            <div
              style={{
                background: "white",
                padding: "50px",
                borderRadius: "16px",
                textAlign: "center",
              }}
            >
              <h2>Кошик порожній</h2>

              <p
                style={{
                  color: "#666",
                  marginTop: "10px",
                }}
              >
                Додайте товари з каталогу.
              </p>

              <Link
                href="/catalog"
                style={{
                  display: "inline-block",
                  marginTop: "20px",
                  padding: "13px 25px",
                  background: "#111",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                Перейти до каталогу
              </Link>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gap: "15px",
                }}
              >
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: "white",
                      borderRadius: "14px",
                      padding: "15px",
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
                    }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "110px",
                          height: "110px",
                          objectFit: "contain",
                          borderRadius: "10px",
                        }}
                      />
                    )}

                    <div style={{ flex: 1 }}>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "20px",
                        }}
                      >
                        {item.name}
                      </h2>

                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >
                        {item.price} грн
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <button
                          onClick={() => decrease(item.id)}
                          style={buttonStyle}
                        >
                          −
                        </button>

                        <b>{item.quantity}</b>

                        <button
                          onClick={() => increase(item.id)}
                          style={buttonStyle}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <strong
                        style={{
                          display: "block",
                          fontSize: "20px",
                        }}
                      >
                        {Number(item.price) * item.quantity} грн
                      </strong>

                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          marginTop: "10px",
                          border: "none",
                          background: "transparent",
                          color: "#d32f2f",
                          cursor: "pointer",
                        }}
                      >
                        🗑️ Видалити
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "white",
                  borderRadius: "14px",
                  padding: "25px",
                  marginTop: "25px",
                  textAlign: "right",
                }}
              >
                <h2>Разом: {total} грн</h2>

                <Link
                  href="/checkout"
                  style={{
                    display: "inline-block",
                    marginTop: "10px",
                    padding: "14px 28px",
                    background: "#111",
                    color: "white",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  Оформити замовлення
                </Link>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}

const buttonStyle = {
  width: "35px",
  height: "35px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  background: "white",
  cursor: "pointer",
  fontSize: "18px",
};