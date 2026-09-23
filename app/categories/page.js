"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function getCategoryImage(category) {
if (category.image) {
  return category.image;
}
  if (category.name === "Посуд") {
    return "/category-posud.jpg";
  }

  if (category.name === "Кухонні дрібниці") {
    return "/category-kitchen.jpg";
  }

  if (category.name === "Затишок для дому") {
    return "/category-cozy.jpg";
  }

  if (category.name === "Організація простору") {
    return "/category-organization.jpg";
  }
if (category.name === "Ванна кімната") {
  return "/category-bathroom.jpg";
}

if (category.name === "Прибирання та чистота") {
  return "/category-cleaning.jpg";
}
  return "";
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7f5",
        padding: "50px 20px 80px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "35px" }}>
          <h1
            style={{
              fontSize: "42px",
              margin: "0 0 10px",
              color: "#151515",
            }}
          >
            Всі категорії
          </h1>

          <p
            style={{
              margin: 0,
              color: "#777",
              fontSize: "17px",
            }}
          >
            Оберіть категорію та знайдіть потрібні товари для вашого дому
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "22px",
          }}
        >
          {categories.map((category) => {
            const image = getCategoryImage(category);

            return (
              <Link
                key={category.id}
                href={`/catalog?category=${category.id}`}
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "#151515",
                  background: "#fff",
                  borderRadius: "22px",
                  overflow: "hidden",
                  boxShadow: "0 8px 25px rgba(0,0,0,.08)",
                  transition: "transform .2s, box-shadow .2s",
                }}
              >
                <div
                  style={{
                    height: "210px",
                    background: "#eee",
                    overflow: "hidden",
                  }}
                >
                  {image ? (
                    <img
                      src={image}
                      alt={category.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                      }}
                    >
                      House Mix
                    </div>
                  )}
                </div>

                <div
                  style={{
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <strong style={{ fontSize: "20px" }}>
                    {category.name}
                  </strong>

                  <span
                    style={{
                      fontSize: "24px",
                      color: "#657b22",
                    }}
                  >
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}