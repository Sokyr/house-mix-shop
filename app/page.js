"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "./components/Header";

export default function HomePage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(() => {
        setCategories([]);
      });
  }, []);

  const getIcon = (name) => {
    if (name === "Посуд") return "♨";
    if (name === "Організація простору") return "◇";
    return "•";
  };

  return (
    <>
      <style jsx global>{`
        .home-desktop-categories {
          display: flex;
        }

        .home-mobile-categories {
          display: none;
        }

        @media (max-width: 700px) {
          .home-desktop-categories {
            display: none !important;
          }

          .home-mobile-categories {
            display: grid !important;
          }

          .home-hero {
            min-height: calc(100vh - 80px) !important;
          }

          .home-title {
            font-size: 50px !important;
          }

          .home-subtitle {
            font-size: 20px !important;
          }

          .home-buttons {
            flex-direction: column !important;
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
          }

          .home-buttons a {
            width: 100%;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#111",
          color: "white",
          fontFamily: "Arial, sans-serif",
          overflow: "hidden",
        }}
      >
        <Header />

        {/* КАТЕГОРІЇ НА ПК */}
        {categories.length > 0 && (
          <div
            className="home-desktop-categories"
            style={{
              height: "105px",
              background: "#101010",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              padding: "8px 25px",
              position: "relative",
              zIndex: 10,
            }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/catalog?category=${category.id}`}
                style={{
                  color: "white",
                  textDecoration: "none",
                  width: "280px",
                  height: "90px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  borderRadius: "15px",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  {getIcon(category.name)}
                </div>

                <span
                  style={{
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* ГОЛОВНИЙ БЛОК */}
        <main
          className="home-hero"
          style={{
            minHeight:
              categories.length > 0
                ? "calc(100vh - 185px)"
                : "calc(100vh - 80px)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/house-mix-family.jpg"
            alt="House Mix"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(5px)",
              transform: "scale(1.05)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.62))",
            }}
          />

          <section
            style={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              textAlign: "center",
              color: "white",
              padding: "40px 20px",
            }}
          >
            <h1
              className="home-title"
              style={{
                fontSize: "clamp(55px, 7vw, 90px)",
                margin: 0,
                fontWeight: "800",
                letterSpacing: "-2px",
              }}
            >
              House Mix
            </h1>

            <p
              className="home-subtitle"
              style={{
                fontSize: "clamp(21px, 3vw, 30px)",
                marginTop: "15px",
                marginBottom: "35px",
              }}
            >
              Все для затишку вашого дому
            </p>

            <div
              className="home-buttons"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/catalog"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "15px 30px",
                  background: "white",
                  color: "#111",
                  borderRadius: "30px",
                  textDecoration: "none",
                  fontSize: "17px",
                  fontWeight: "700",
                }}
              >
                Перейти до каталогу
              </Link>

              <Link
                href="/order-status"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "15px 30px",
                  background: "rgba(0,0,0,0.3)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.7)",
                  borderRadius: "30px",
                  textDecoration: "none",
                  fontSize: "17px",
                  fontWeight: "700",
                }}
              >
                📦 Статус замовлення
              </Link>
            </div>
          </section>
        </main>

        {/* КАТЕГОРІЇ НА ТЕЛЕФОНІ */}
        {categories.length > 0 && (
          <div
            className="home-mobile-categories"
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50,
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "8px",
              background: "#101010",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              padding: "10px",
            }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/catalog?category=${category.id}`}
                style={{
                  color: "white",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  minHeight: "75px",
                }}
              >
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                  }}
                >
                  {getIcon(category.name)}
                </div>

                <span
                  style={{
                    fontSize: "13px",
                    textAlign: "center",
                  }}
                >
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
