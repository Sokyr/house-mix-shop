"use client";

import { useState } from "react";
import Header from "../components/Header";

export default function OrderStatusPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function findOrder(e) {
    e.preventDefault();

    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const res = await fetch(
        `/api/orders?id=${encodeURIComponent(
          orderId
        )}&phone=${encodeURIComponent(phone)}`
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Замовлення не знайдено");
        return;
      }

      setOrder(data);
    } catch (error) {
      setError("Помилка з'єднання із сервером");
    } finally {
      setLoading(false);
    }
  }

  const statuses = [
    { name: "Нове", icon: "🆕" },
    { name: "В обробці", icon: "⚙️" },
    { name: "Відправлено", icon: "📦" },
    { name: "Виконано", icon: "✅" },
  ];

  function getStatusIndex(status) {
    return statuses.findIndex((item) => item.name === status);
  }

  return (
    <>
      <Header />

      <main
        style={{
          minHeight: "calc(100vh - 80px)",
          background: "#f5f5f5",
          paddingBottom: "60px",
        }}
      >
        <section
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            padding: "50px 20px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "18px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h1
              style={{
                textAlign: "center",
                marginTop: 0,
              }}
            >
              📦 Статус замовлення
            </h1>

            <p
              style={{
                textAlign: "center",
                color: "#666",
              }}
            >
              Введіть номер замовлення та номер телефону
            </p>

            <form
              onSubmit={findOrder}
              style={{
                display: "grid",
                gap: "14px",
                marginTop: "25px",
              }}
            >
              <input
                type="number"
                placeholder="Номер замовлення"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                style={inputStyle}
              />

              <input
                type="tel"
                placeholder="Номер телефону"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "14px",
                  background: "#111",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                {loading ? "Пошук..." : "Перевірити замовлення"}
              </button>
            </form>

            {error && (
              <p
                style={{
                  marginTop: "20px",
                  color: "#d32f2f",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {error}
              </p>
            )}

            {order && (
              <div style={{ marginTop: "35px" }}>
                <hr />

                <h2>Замовлення №{order.id}</h2>

                <p>
                  <b>Статус:</b> {order.status}
                </p>

                <p>
                  <b>Сума:</b> {order.total} грн
                </p>

                <div style={{ marginTop: "30px" }}>
                  {statuses.map((status, index) => {
                    const currentIndex = getStatusIndex(order.status);
                    const completed = index <= currentIndex;

                    return (
                      <div
                        key={status.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          marginBottom: "20px",
                        }}
                      >
                        <div
                          style={{
                            width: "45px",
                            height: "45px",
                            borderRadius: "50%",
                            background: completed
                              ? "#111"
                              : "#ddd",
                            color: completed
                              ? "white"
                              : "#777",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                            flexShrink: 0,
                          }}
                        >
                          {status.icon}
                        </div>

                        <div>
                          <b
                            style={{
                              color: completed
                                ? "#111"
                                : "#999",
                            }}
                          >
                            {status.name}
                          </b>

                          {index === currentIndex && (
                            <div
                              style={{
                                color: "#666",
                                fontSize: "14px",
                                marginTop: "4px",
                              }}
                            >
                              Поточний етап
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "16px",
};