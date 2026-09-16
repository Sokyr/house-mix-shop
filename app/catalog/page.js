"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import "./catalog.css";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");

    if (category) {
      setActiveCategory(Number(category));
    } else {
      setActiveCategory(null);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setCategories([]);
        setLoading(false);
      });
  }, []);

  const filteredProducts =
    activeCategory === null
      ? products
      : products.filter(
          (product) =>
            Number(product.categoryId) === Number(activeCategory)
        );

  return (
    <>
      <Header />

      <main
        style={{
          minHeight: "calc(100vh - 80px)",
          background: "#f5f5f5",
          paddingBottom: "90px",
        }}
      >
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
              marginBottom: "25px",
            }}
          >
            Каталог товарів
          </h1>

          {!loading && categories.length > 0 && (
            <div
              className="desktop-categories"
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "30px",
              }}
            >
              <button
                onClick={() => {
                  setActiveCategory(null);
                  window.history.replaceState({}, "", "/catalog");
                }}
                style={{
                  padding: "12px 20px",
                  borderRadius: "25px",
                  border:
                    activeCategory === null
                      ? "2px solid #111"
                      : "1px solid #ddd",
                  background:
                    activeCategory === null ? "#111" : "white",
                  color:
                    activeCategory === null ? "white" : "#111",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Всі товари
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    window.history.replaceState(
                      {},
                      "",
                      `/catalog?category=${category.id}`
                    );
                  }}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "25px",
                    border:
                      Number(activeCategory) === Number(category.id)
                        ? "2px solid #111"
                        : "1px solid #ddd",
                    background:
                      Number(activeCategory) === Number(category.id)
                        ? "#111"
                        : "white",
                    color:
                      Number(activeCategory) === Number(category.id)
                        ? "white"
                        : "#111",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

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
          ) : filteredProducts.length === 0 ? (
            <div
              style={{
                background: "white",
                padding: "40px",
                borderRadius: "16px",
                textAlign: "center",
              }}
            >
              <h2>У цій категорії поки немає товарів</h2>
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
              {filteredProducts.map((product) => (
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

      {!loading && categories.length > 0 && (
        <div
          className="mobile-categories"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: "white",
            borderTop: "1px solid #ddd",
            padding: "10px",
            display: "flex",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                window.history.replaceState(
                  {},
                  "",
                  `/catalog?category=${category.id}`
                );
              }}
              style={{
                flex: 1,
                maxWidth: "220px",
                padding: "11px 8px",
                borderRadius: "12px",
                border: "none",
                background:
                  Number(activeCategory) === Number(category.id)
                    ? "#111"
                    : "#f1f1f1",
                color:
                  Number(activeCategory) === Number(category.id)
                    ? "white"
                    : "#111",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </>
  );
}