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
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

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
    const params = new URLSearchParams(window.location.search);
    const bestSellers = params.get("bestSellers") === "1";

    Promise.all([
      fetch(
        bestSellers
          ? "/api/products?bestSellers=1&page=1&limit=20"
          : "/api/products?page=1&limit=20"
      ).then((res) => res.json()),

      fetch("/api/categories").then((res) => res.json()),
    ])
      .then(([productsData, categoriesData]) => {
        const list = Array.isArray(productsData) ? productsData : [];

        setProducts(list);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setPage(1);
        setHasMore(list.length === 20);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setCategories([]);
        setHasMore(false);
        setLoading(false);
      });
  }, []);

  const loadMoreProducts = async () => {
    if (loadingMore || !hasMore) return;

    const nextPage = page + 1;
    const params = new URLSearchParams(window.location.search);
    const bestSellers = params.get("bestSellers") === "1";

    setLoadingMore(true);

    try {
      const url = bestSellers
        ? `/api/products?bestSellers=1&page=${nextPage}&limit=20`
        : `/api/products?page=${nextPage}&limit=20`;

      const res = await fetch(url);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];

      setProducts((prev) => [...prev, ...list]);
      setPage(nextPage);
      setHasMore(list.length === 20);
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

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

          {!loading && filteredProducts.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/catalog/${product.id}`}
                  style={{
                    textDecoration: "none",
                    color: "#111",
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 15px rgba(0,0,0,.08)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      background: "#fafafa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </div>

                  <div style={{ padding: "16px" }}>
                    <h2
                      style={{
                        fontSize: "17px",
                        margin: "0 0 10px",
                        color: "#111",
                      }}
                    >
                      {product.name}
                    </h2>

                    <strong
                      style={{
                        fontSize: "20px",
                        color: "#111",
                      }}
                    >
                      {product.price} грн
                    </strong>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {loading && (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              Завантаження...
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              Товарів не знайдено
            </div>
          )}

          {!loading && hasMore && products.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "35px 0 20px",
              }}
            >
              <button
                onClick={loadMoreProducts}
                disabled={loadingMore}
                style={{
                  padding: "14px 30px",
                  borderRadius: "12px",
                  border: "2px solid #fff",
                  background: "#211710",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: loadingMore ? "wait" : "pointer",
                }}
              >
                {loadingMore ? "Завантаження..." : "Показати ще"}
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
