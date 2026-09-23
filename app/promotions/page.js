"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PromotionsPage() {
  function addPromotionToCart(promotion) {
    try {
      const cart = JSON.parse(
        localStorage.getItem("houseMixCart") || "[]"
      );

      const promoItem = {
        id: `promo-${promotion.id}`,
        name: promotion.title || "Акція",
        price: Number(promotion.promoPrice) || 0,
        image: promotion.image || "",
        quantity: 1,
        isPromotion: true,
        promotionId: promotion.id,
        productIds: Array.isArray(promotion.productIds)
          ? promotion.productIds
          : JSON.parse(promotion.productIds || "[]"),
      };

      const existingIndex = cart.findIndex(
        (item) => item.id === promoItem.id
      );

      if (existingIndex >= 0) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push(promoItem);
      }

      localStorage.setItem(
        "houseMixCart",
        JSON.stringify(cart)
      );

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("PROMOTION CART ERROR:", error);
    }
  }
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPromotions() {
      try {
        const res = await fetch("/api/promotions");
        const data = await res.json();

        if (Array.isArray(data)) {
          setPromotions(data.filter((item) => item.isActive));
        }
      } catch (error) {
        console.error("PROMOTIONS PAGE ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPromotions();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f2",
        padding: "40px 20px 80px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "35px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "44px",
                fontWeight: 900,
                color: "#111",
              }}
            >
              Акції
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "#777",
                fontSize: "17px",
              }}
            >
              Вигідні пропозиції та спеціальні ціни
            </p>
          </div>

          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "12px 20px",
              borderRadius: "25px",
              background: "#657b22",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            ← На головну
          </Link>
        </div>

        {/* LOADING */}
        {loading && (
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "50px",
              textAlign: "center",
            }}
          >
            Завантаження акцій...
          </div>
        )}

        {/* EMPTY */}
        {!loading && promotions.length === 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "60px 20px",
              textAlign: "center",
              boxShadow: "0 5px 20px rgba(0,0,0,.05)",
            }}
          >
            <div
              style={{
                fontSize: "50px",
                marginBottom: "15px",
              }}
            >
              🎁
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "26px",
              }}
            >
              Поки немає активних акцій
            </h2>

            <p
              style={{
                color: "#777",
                marginTop: "10px",
              }}
            >
              Слідкуйте за оновленнями — скоро тут з'являться нові пропозиції.
            </p>
          </div>
        )}

        {/* PROMOTIONS */}
        {!loading && promotions.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "25px",
            }}
          >
            {promotions.map((promotion) => (
              <article
                key={promotion.id}
                style={{
                  background: "#fff",
                  borderRadius: "22px",
maxWidth: "400px",
width: "100%",
                  overflow: "hidden",
                  boxShadow: "0 7px 25px rgba(0,0,0,.07)",
                  border: "1px solid #e8e8e8",
                }}
              >
                {promotion.image && (
                  <img
                    src={promotion.image}
                    alt={promotion.title || "Акція"}
                 style={{
  width: "auto",
  maxWidth: "100%",
  height: "240px",
  objectFit: "contain",
  display: "block",
  margin: "0 auto"}}                  />
                )}

                <div
                  style={{
                    padding: "24px",
                  }}
                >
                  <h2
                    style={{
                      margin: "0 0 10px",
                      fontSize: "27px",
                      fontWeight: 900,
                      color: "#111",
                    }}
                  >
                    {promotion.title || "Спеціальна пропозиція"}
                  </h2>

                  {promotion.subtitle && (
                    <p
                      style={{
                        margin: "0 0 22px",
                        color: "#666",
                        fontSize: "16px",
                        lineHeight: 1.6,
                      }}
                    >
                      {promotion.subtitle}
                    </p>
                  )}
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginTop: "18px",
  }}
>
  <strong style={{ fontSize: "22px" }}>
   {promotion.promoPrice} грн
  </strong>
<button
  type="button"
  onClick={() => addPromotionToCart(promotion)}
  style={{
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "13px 22px",
    background: "#657b22",
    color: "#fff",
    border: "none",
    borderRadius: "28px",
    cursor: "pointer",
    fontWeight: 800,
  }}
>
  🛒 Додати в кошик
</button>                 
                </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}