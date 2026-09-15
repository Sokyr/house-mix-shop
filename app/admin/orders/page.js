"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [notification, setNotification] = useState(null);
  const [knownOrderIds, setKnownOrderIds] = useState([]);

  useEffect(() => {
    const isAdmin = localStorage.getItem("houseMixAdmin");

    if (isAdmin !== "true") {
      router.replace("/admin-login");
      return;
    }

    setCheckingAuth(false);
  }, [router]);

  async function loadOrders(showNotification = false) {
    try {
      const res = await fetch("/api/orders", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!Array.isArray(data)) {
        return;
      }

      const activeOrders = data.filter(
        (order) => order.status !== "Відправлено"
      );

      if (showNotification) {
        const newOrders = activeOrders.filter(
          (order) => !knownOrderIds.includes(order.id)
        );

        if (newOrders.length > 0) {
          const newestOrder = newOrders[0];

          setNotification({
            id: newestOrder.id,
            name: newestOrder.name,
            total: newestOrder.total,
          });

          playNotificationSound();

          setTimeout(() => {
            setNotification(null);
          }, 6000);
        }
      }

      setOrders(activeOrders);

      setKnownOrderIds(
        activeOrders.map((order) => order.id)
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!checkingAuth) {
      loadOrders(false);
    }
  }, [checkingAuth]);

  useEffect(() => {
    if (checkingAuth) {
      return;
    }

    const interval = setInterval(() => {
      loadOrders(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [checkingAuth, knownOrderIds]);

  function playNotificationSound() {
    try {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) {
        return;
      }

      const audioContext = new AudioContext();

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(
        0.15,
        audioContext.currentTime
      );

      oscillator.start();

      oscillator.stop(
        audioContext.currentTime + 0.25
      );
    } catch (error) {
      console.log("Звук недоступний");
    }
  }

  async function changeStatus(id, status) {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      if (res.ok) {
        if (status === "Відправлено") {
          setOrders((currentOrders) =>
            currentOrders.filter(
              (order) => order.id !== id
            )
          );
        } else {
          loadOrders(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  function getProducts(products) {
    try {
      return JSON.parse(products || "[]");
    } catch {
      return [];
    }
  }

  function logout() {
    localStorage.removeItem("houseMixAdmin");
    router.replace("/admin-login");
  }

  if (checkingAuth) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial",
        }}
      >
        <h2>Перевірка доступу...</h2>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        paddingBottom: "60px",
      }}
    >
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "25px",
            right: "25px",
            width: "340px",
            maxWidth: "calc(100vw - 50px)",
            background: "#111",
            color: "white",
            padding: "22px",
            borderRadius: "16px",
            boxShadow: "0 10px 35px rgba(0,0,0,0.3)",
            zIndex: 9999,
            animation: "slideIn 0.3s ease",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              marginBottom: "8px",
            }}
          >
            🔔
          </div>

          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "21px",
            }}
          >
            Нове замовлення!
          </h2>

          <p
            style={{
              margin: "6px 0",
            }}
          >
            <b>№{notification.id}</b>
          </p>

          <p
            style={{
              margin: "6px 0",
              color: "#ddd",
            }}
          >
            👤 {notification.name}
          </p>

          <p
            style={{
              margin: "6px 0",
              color: "#ddd",
            }}
          >
            💰 {notification.total} грн
          </p>

          <button
            onClick={() => setNotification(null)}
            style={{
              marginTop: "12px",
              width: "100%",
              padding: "10px",
              border: "none",
              borderRadius: "8px",
              background: "white",
              color: "#111",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Зрозуміло
          </button>
        </div>
      )}

      <header
        style={{
          height: "80px",
          background: "#111",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 6%",
          boxSizing: "border-box",
        }}
      >
        <a
          href="/admin"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "30px",
            fontWeight: "700",
          }}
        >
          House Mix
        </a>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/admin"
            style={{
              color: "white",
              textDecoration: "none",
              padding: "12px 20px",
              borderRadius: "25px",
              background: "#333",
            }}
          >
            ← Адмін-панель
          </a>

          <button
            onClick={logout}
            style={{
              color: "white",
              padding: "12px 20px",
              borderRadius: "25px",
              background: "#333",
              border: "none",
              cursor: "pointer",
            }}
          >
            Вийти
          </button>
        </div>
      </header>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        <h1
          style={{
            fontSize: "38px",
          }}
        >
          Замовлення
        </h1>

        {loading ? (
          <p>Завантаження...</p>
        ) : orders.length === 0 ? (
          <div
            style={{
              marginTop: "30px",
              background: "white",
              padding: "40px",
              borderRadius: "16px",
              textAlign: "center",
            }}
          >
            <h2>Активних замовлень немає</h2>

            <p style={{ color: "#666" }}>
              Відправлені замовлення тут не показуються.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            {orders.map((order) => {
              const products = getProducts(order.products);

              return (
                <article
                  key={order.id}
                  style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "16px",
                    boxShadow:
                      "0 4px 15px rgba(0,0,0,0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <h2>
                      Замовлення №{order.id}
                    </h2>

                    <strong>
                      Статус: {order.status}
                    </strong>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "20px",
                    }}
                  >
                    <button
                      onClick={() =>
                        changeStatus(
                          order.id,
                          "Нове"
                        )
                      }
                      style={buttonStyle}
                    >
                      🆕 Нове
                    </button>

                    <button
                      onClick={() =>
                        changeStatus(
                          order.id,
                          "В обробці"
                        )
                      }
                      style={buttonStyle}
                    >
                      ⚙️ В обробці
                    </button>

                    <button
                      onClick={() =>
                        changeStatus(
                          order.id,
                          "Відправлено"
                        )
                      }
                      style={buttonStyle}
                    >
                      📦 Відправлено
                    </button>

                    <button
                      onClick={() =>
                        changeStatus(
                          order.id,
                          "Виконано"
                        )
                      }
                      style={buttonStyle}
                    >
                      ✅ Виконано
                    </button>
                  </div>

                  <hr
                    style={{
                      margin: "20px 0",
                    }}
                  />

                  <p>
                    <b>Ім'я:</b> {order.name}
                  </p>

                  <p>
                    <b>Телефон:</b> {order.phone}
                  </p>

                  <p>
                    <b>Місто:</b> {order.city}
                  </p>

                  <p>
                    <b>Адреса / відділення:</b>{" "}
                    {order.address}
                  </p>

                  <p>
                    <b>Доставка:</b> {order.delivery}
                  </p>

                  <p>
                    <b>Оплата:</b> {order.payment}
                  </p>

                  <h3 style={{ marginTop: "20px" }}>
                    Товари:
                  </h3>

                  {products.map((product, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "10px 0",
                        borderBottom:
                          "1px solid #eee",
                      }}
                    >
                      {product.name} —{" "}
                      {product.quantity} шт. ×{" "}
                      {product.price} грн
                    </div>
                  ))}

                  <h2 style={{ marginTop: "20px" }}>
                    Разом: {order.total} грн
                  </h2>

                  <p
                    style={{
                      color: "#777",
                      marginTop: "15px",
                    }}
                  >
                    Створено:{" "}
                    {new Date(
                      order.createdAt
                    ).toLocaleString("uk-UA")}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(30px);
            opacity: 0;
          }

          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}

const buttonStyle = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "8px",
  background: "#111",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
};