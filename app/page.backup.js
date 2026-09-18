"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [home, setHome] = useState({
    heroImage: "/house-mix-family.jpg",
    title: "Готуйте з любов'ю",
    subtitle:
      "Якість у кожній деталі. Надійний посуд для вашої кухні",
    buttonText: "Переглянути колекцію →",
    buttonLink: "/catalog",
    showCategories: true,
    showPromotions: true,
    showBestSellers: true,
  });

  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [homeRes, categoriesRes, productsRes] =
          await Promise.all([
            fetch("/api/home"),
            fetch("/api/categories"),
            fetch("/api/products"),
          ]);

        const homeData = await homeRes.json();
        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        if (homeData?.settings) {
          setHome({
            heroImage:
              homeData.settings.heroImage ||
              "/house-mix-family.jpg",
            title:
              homeData.settings.title ||
              "Готуйте з любов'ю",
            subtitle:
              homeData.settings.subtitle ||
              "Якість у кожній деталі. Надійний посуд для вашої кухні",
            buttonText:
              homeData.settings.buttonText ||
              "Переглянути колекцію →",
            buttonLink:
              homeData.settings.buttonLink ||
              "/catalog",
            showCategories:
              homeData.settings.showCategories !== false,
            showPromotions:
              homeData.settings.showPromotions !== false,
            showBestSellers:
              homeData.settings.showBestSellers !== false,
          });
        }

        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }

        if (Array.isArray(productsData)) {
          setProducts(productsData);
        }
      } catch (error) {
        console.error("HOME ERROR:", error);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    function updateCart() {
      try {
        const cart = JSON.parse(
          localStorage.getItem("houseMixCart") || "[]"
        );

        if (Array.isArray(cart)) {
          setCartCount(
            cart.reduce(
              (sum, item) =>
                sum + Number(item.quantity || 1),
              0
            )
          );
        }
      } catch {
        setCartCount(0);
      }
    }

    updateCart();

    window.addEventListener("storage", updateCart);

    return () => {
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;

    const value = search.toLowerCase();

    return products.filter((product) =>
      String(product.name || "")
        .toLowerCase()
        .includes(value)
    );
  }, [products, search]);

  function getCategoryImage(category) {
    const product = products.find(
      (item) =>
        Number(item.categoryId) === Number(category.id) &&
        item.image
    );

    return product?.image || "";
  }

  function categoryTitle(name) {
    if (name === "Посуд") return "Посуд";

    if (name === "Організація простору")
      return "Організація\nпростору";

    if (name.toLowerCase().includes("суш"))
      return "Сушарки\nдля одягу";

    if (name.toLowerCase().includes("взут"))
      return "Полиці\nдля взуття";

    return name;
  }

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #f7f7f5;
          color: #151515;
          font-family: Arial, Helvetica, sans-serif;
        }

        a {
          -webkit-tap-highlight-color: transparent;
        }

        .hm-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ================= HEADER ================= */

        .hm-header {
          height: 82px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 35px;
          border-bottom: 1px solid #eee;
          position: relative;
          z-index: 100;
        }

        .hm-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #111;
          text-decoration: none;
        }

        .hm-logo-house {
          width: 42px;
          height: 42px;
          border: 3px solid #111;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 3px;
        }

        .hm-logo-house:before {
          content: "";
          position: absolute;
          width: 29px;
          height: 29px;
          border-left: 3px solid #111;
          border-top: 3px solid #111;
          transform: rotate(45deg);
          top: -15px;
          left: 4px;
          background: #fff;
        }

        .hm-logo-leaf {
          position: relative;
          z-index: 2;
          font-size: 21px;
        }

        .hm-logo-title {
          font-size: 30px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -1px;
        }

        .hm-logo-subtitle {
          font-size: 10px;
          margin-top: 5px;
          letter-spacing: 1px;
        }

        .hm-header-actions {
          display: flex;
          align-items: center;
          gap: 27px;
        }

        .hm-header-button {
          border: 0;
          background: transparent;
          cursor: pointer;
          color: #111;
          padding: 5px;
          display: flex;
          align-items: center;
          position: relative;
        }

        .hm-search-icon {
          width: 27px;
          height: 27px;
          border: 3px solid #111;
          border-radius: 50%;
          position: relative;
        }

        .hm-search-icon:after {
          content: "";
          position: absolute;
          width: 11px;
          height: 3px;
          background: #111;
          right: -8px;
          bottom: -4px;
          transform: rotate(48deg);
        }

        .hm-cart-icon {
          font-size: 29px;
        }

        .hm-cart-count {
          position: absolute;
          right: -8px;
          top: -7px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #657b22;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hm-menu-icon {
          width: 39px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .hm-menu-icon span {
          height: 3px;
          width: 100%;
          background: #111;
          border-radius: 3px;
        }

        /* ================= SEARCH ================= */

        .hm-search-box {
          position: absolute;
          right: 120px;
          top: 75px;
          width: 380px;
          background: #fff;
          padding: 14px;
          border-radius: 0 0 14px 14px;
          box-shadow: 0 10px 30px rgba(0,0,0,.15);
          z-index: 150;
        }

        .hm-search-input {
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 13px;
          font-size: 16px;
          outline: none;
        }

        /* ================= MENU ================= */

        .hm-menu {
          position: absolute;
          top: 75px;
          right: 20px;
          width: 280px;
          background: #fff;
          padding: 10px;
          border-radius: 0 0 18px 18px;
          box-shadow: 0 10px 35px rgba(0,0,0,.17);
          z-index: 200;
        }

        .hm-menu-link {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          color: #222;
          text-decoration: none;
          border-radius: 10px;
          font-size: 16px;
        }

        .hm-menu-link:hover {
          background: #f2f2ef;
        }

        /* ================= HERO ================= */

        .hm-hero {
          height: 540px;
          position: relative;
          overflow: hidden;
        }

        .hm-hero-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hm-hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(0,0,0,.65),
              rgba(0,0,0,.28),
              rgba(0,0,0,.05)
            );
        }

        .hm-hero-content {
          position: relative;
          z-index: 2;
          height: 100%;
          max-width: 1200px;
          margin: auto;
          padding: 70px 45px;
          display: flex;
          align-items: center;
        }

        .hm-hero-text {
          color: #fff;
          max-width: 570px;
        }

        .hm-hero-small {
          font-size: 17px;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .hm-hero-title {
          margin: 0;
          font-size: clamp(45px, 6vw, 75px);
          line-height: .98;
          font-weight: 900;
          text-transform: uppercase;
        }

        .hm-hero-description {
          white-space: pre-line;
          font-size: 21px;
          line-height: 1.3;
          font-weight: 600;
          margin: 20px 0 28px;
        }

        .hm-hero-button {
          display: inline-flex;
          padding: 16px 27px;
          background: #657b22;
          color: #fff;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 700;
          font-size: 17px;
        }

        .hm-slider-dots {
          position: absolute;
          z-index: 5;
          bottom: 17px;
          left: 45px;
          display: flex;
          gap: 8px;
        }

        .hm-slider-dot {
          width: 13px;
          height: 13px;
          border: 2px solid white;
          border-radius: 50%;
        }

        .hm-slider-dot.active {
          background: #fff;
        }

        /* ================= BENEFITS ================= */

        .hm-benefits {
          background: #fff;
        }

        .hm-benefits-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          min-height: 105px;
        }

        .hm-benefit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          border-right: 1px solid #eee;
          padding: 15px;
        }

        .hm-benefit:last-child {
          border-right: 0;
        }

        .hm-benefit-icon {
          font-size: 34px;
        }

        .hm-benefit-title {
          font-size: 15px;
          font-weight: 700;
        }

        .hm-benefit-text {
          font-size: 13px;
          color: #666;
          margin-top: 4px;
        }

        /* ================= SECTIONS ================= */

        .hm-section {
          padding: 42px 0;
        }

        .hm-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
          gap: 20px;
        }

        .hm-section-title {
          margin: 0;
          font-size: 32px;
          font-weight: 900;
        }

        .hm-section-link {
          color: #333;
          text-decoration: none;
          white-space: nowrap;
        }

        /* ================= CATEGORIES ================= */

        .hm-categories {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .hm-category {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 14px;
          overflow: hidden;
          color: #111;
          text-decoration: none;
        }

        .hm-category-image,
        .hm-category-empty {
          width: 100%;
          height: 145px;
          object-fit: cover;
          display: block;
          background: #eee;
        }

        .hm-category-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 45px;
        }

        .hm-category-name {
          min-height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          white-space: pre-line;
          font-weight: 700;
          padding: 8px;
        }

        /* ================= PROMO ================= */

        .hm-promo {
          min-height: 290px;
          position: relative;
          overflow: hidden;
          color: white;
        }

        .hm-promo-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(.55);
        }

        .hm-promo-content {
          position: relative;
          z-index: 2;
          padding: 45px 0;
        }

        .hm-promo-title {
          font-size: 48px;
          line-height: .95;
          margin: 0;
          font-weight: 900;
        }

        .hm-promo-text {
          font-size: 17px;
          line-height: 1.4;
          margin: 15px 0 23px;
        }

        .hm-promo-button {
          display: inline-flex;
          padding: 13px 22px;
          background: #fff;
          color: #111;
          text-decoration: none;
          border-radius: 28px;
          font-weight: 700;
        }

        /* ================= PRODUCTS ================= */

        .hm-products {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .hm-product {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 14px;
          overflow: hidden;
          color: #111;
          text-decoration: none;
          position: relative;
        }

        .hm-product-image {
          width: 100%;
          height: 230px;
          object-fit: contain;
          background: #f4f4f2;
          display: block;
        }

        .hm-product-info {
          padding: 14px;
        }

        .hm-product-name {
          margin: 0;
          min-height: 40px;
          font-size: 16px;
          font-weight: 700;
        }

        .hm-product-price {
          margin-top: 8px;
          font-size: 19px;
          font-weight: 900;
        }

        .hm-hit {
          position: absolute;
          z-index: 3;
          left: 10px;
          top: 10px;
          background: #657b22;
          color: #fff;
          border-radius: 15px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 700;
        }

        .hm-heart {
          position: absolute;
          z-index: 3;
          right: 10px;
          top: 10px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        /* ================= FOOTER ================= */

        .hm-footer {
          background: #171717;
          color: white;
          padding: 45px 0;
        }

        .hm-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 35px;
        }

        .hm-footer h3 {
          margin-top: 0;
        }

        .hm-footer p {
          color: #bbb;
          line-height: 1.5;
        }

        .hm-footer-link {
          color: #ddd;
          text-decoration: none;
          display: block;
          margin-bottom: 10px;
        }

        /* ================= MOBILE ================= */

        @media (max-width: 700px) {
          .hm-container {
            padding: 0 14px;
          }

          .hm-header {
            height: 70px;
            padding: 0 14px;
          }

          .hm-logo {
            gap: 7px;
          }

          .hm-logo-house {
            width: 32px;
            height: 32px;
            border-width: 2px;
          }

          .hm-logo-house:before {
            width: 22px;
            height: 22px;
            border-width: 2px;
            top: -11px;
            left: 4px;
          }

          .hm-logo-leaf {
            font-size: 16px;
          }

          .hm-logo-title {
            font-size: 20px;
            letter-spacing: -.5px;
          }

          .hm-logo-subtitle {
            font-size: 7px;
            letter-spacing: .6px;
            margin-top: 3px;
          }

          .hm-header-actions {
            gap: 12px;
          }

          .hm-search-icon {
            width: 21px;
            height: 21px;
            border-width: 2px;
          }

          .hm-search-icon:after {
            width: 8px;
            height: 2px;
            right: -6px;
            bottom: -3px;
          }

          .hm-cart-icon {
            font-size: 23px;
          }

          .hm-menu-icon {
            width: 29px;
            gap: 5px;
          }

          .hm-menu-icon span {
            height: 2px;
          }

          .hm-cart-count {
            width: 17px;
            height: 17px;
            font-size: 9px;
            right: -7px;
            top: -6px;
          }

          .hm-search-box {
            top: 65px;
            right: 10px;
            left: 10px;
            width: auto;
          }

          .hm-menu {
            top: 65px;
            left: 8px;
            right: 8px;
            width: auto;
            border-radius: 0 0 16px 16px;
          }

          /* МОБІЛЬНИЙ HERO */

          .hm-hero {
            height: 610px;
          }

          .hm-hero-image {
            object-position: center;
          }

          .hm-hero-overlay {
            background:
              linear-gradient(
                180deg,
                rgba(0,0,0,.08) 0%,
                rgba(0,0,0,.2) 35%,
                rgba(0,0,0,.78) 100%
              );
          }

          .hm-hero-content {
            padding: 30px 18px 60px;
            align-items: flex-end;
          }

          .hm-hero-text {
            width: 100%;
            max-width: 100%;
          }

          .hm-hero-small {
            font-size: 13px;
            margin-bottom: 9px;
          }

          .hm-hero-title {
            font-size: 43px;
            line-height: .95;
            letter-spacing: -1px;
          }

          .hm-hero-description {
            font-size: 17px;
            line-height: 1.25;
            margin: 15px 0 20px;
          }

          .hm-hero-button {
            width: 100%;
            justify-content: center;
            padding: 15px 18px;
            font-size: 16px;
          }

          .hm-slider-dots {
            left: 18px;
            bottom: 15px;
          }

          /* ПЕРЕВАГИ 2×2 */

          .hm-benefits-grid {
            grid-template-columns: 1fr 1fr;
          }

          .hm-benefit {
            min-height: 88px;
            justify-content: flex-start;
            padding: 12px 10px;
            gap: 8px;
          }

          .hm-benefit:nth-child(1),
          .hm-benefit:nth-child(2) {
            border-bottom: 1px solid #eee;
          }

          .hm-benefit:nth-child(2) {
            border-right: 0;
          }

          .hm-benefit:nth-child(4) {
            border-right: 0;
          }

          .hm-benefit-icon {
            font-size: 25px;
          }

          .hm-benefit-title {
            font-size: 12px;
          }

          .hm-benefit-text {
            font-size: 10px;
          }

          /* ЗАГОЛОВКИ */

          .hm-section {
            padding: 28px 0;
          }

          .hm-section-header {
            margin-bottom: 15px;
          }

          .hm-section-title {
            font-size: 24px;
          }

          .hm-section-link {
            font-size: 13px;
          }

          /* КАТЕГОРІЇ */

          .hm-categories {
            grid-template-columns: 1fr 1fr;
            gap: 9px;
          }

          .hm-category-image,
          .hm-category-empty {
            height: 125px;
          }

          .hm-category-name {
            min-height: 50px;
            font-size: 13px;
          }

          /* АКЦІЇ */

          .hm-promo {
            min-height: 300px;
          }

          .hm-promo-content {
            padding: 35px 0;
          }

          .hm-promo-title {
            font-size: 38px;
          }

          .hm-promo-text {
            font-size: 15px;
            margin: 13px 0 20px;
          }

          .hm-promo-button {
            font-size: 14px;
            padding: 12px 19px;
          }

          /* ТОВАРИ */

          .hm-products {
            grid-template-columns: 1fr 1fr;
            gap: 9px;
          }

          .hm-product-image {
            height: 175px;
          }

          .hm-product-info {
            padding: 10px;
          }

          .hm-product-name {
            font-size: 13px;
            min-height: 34px;
          }

          .hm-product-price {
            font-size: 16px;
            margin-top: 6px;
          }

          .hm-hit {
            left: 7px;
            top: 7px;
            padding: 5px 9px;
            font-size: 10px;
          }

          .hm-heart {
            right: 7px;
            top: 7px;
            width: 30px;
            height: 30px;
            font-size: 19px;
          }

          /* FOOTER */

          .hm-footer {
            padding: 35px 0;
          }

          .hm-footer-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 380px) {
          .hm-logo-title {
            font-size: 18px;
          }

          .hm-logo-subtitle {
            font-size: 6px;
          }

          .hm-header-actions {
            gap: 8px;
          }

          .hm-hero {
            height: 570px;
          }

          .hm-hero-title {
            font-size: 38px;
          }

          .hm-hero-description {
            font-size: 15px;
          }

          .hm-benefit-icon {
            font-size: 22px;
          }

          .hm-benefit-title {
            font-size: 11px;
          }

          .hm-benefit-text {
            font-size: 9px;
          }
        }
      `}</style>

      {/* ================= HEADER ================= */}

      <header className="hm-header">
        <Link href="/" className="hm-logo">
          <div className="hm-logo-house">
            <div className="hm-logo-leaf">🌱</div>
          </div>

          <div>
            <div className="hm-logo-title">
              HOUSE MIX
            </div>

            <div className="hm-logo-subtitle">
              ВСЕ ДЛЯ ВАШОГО ДОМУ ♡
            </div>
          </div>
        </Link>

        <div className="hm-header-actions">
          <button
            className="hm-header-button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Пошук"
          >
            <span className="hm-search-icon" />
          </button>

          <Link
            href="/cart"
            className="hm-header-button"
            aria-label="Кошик"
          >
            <span className="hm-cart-icon">🛒</span>

            {cartCount > 0 && (
              <span className="hm-cart-count">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="hm-header-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
          >
            <span className="hm-menu-icon">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        {searchOpen && (
          <div className="hm-search-box">
            <input
              autoFocus
              className="hm-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Пошук товару..."
            />
          </div>
        )}

        {menuOpen && (
          <div className="hm-menu">
            <Link href="/" className="hm-menu-link">
              🏠 <span>Головна</span>
            </Link>

            <Link href="/catalog" className="hm-menu-link">
              ▦ <span>Каталог</span>
            </Link>

            <Link href="/cart" className="hm-menu-link">
              🛒 <span>Кошик</span>
            </Link>

            <Link href="/catalog" className="hm-menu-link">
              ♡ <span>Акції</span>
            </Link>

            <Link
              href="/order-status"
              className="hm-menu-link"
            >
              📋 <span>Мої замовлення</span>
            </Link>

            <Link href="/" className="hm-menu-link">
              ☎ <span>Контакти</span>
            </Link>

            <Link href="/" className="hm-menu-link">
              ⓘ <span>Про нас</span>
            </Link>
          </div>
        )}
      </header>

      {/* ================= SEARCH ================= */}

      {search.trim() && (
        <section
          style={{
            background: "#fff",
            padding: "30px 0",
          }}
        >
          <div className="hm-container">
            <div className="hm-section-header">
              <h2 className="hm-section-title">
                Результати пошуку
              </h2>

              <button
                onClick={() => setSearch("")}
                style={{
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                Очистити
              </button>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="hm-products">
                {filteredProducts.slice(0, 8).map((product) => (
                  <Link
                    key={product.id}
                    href={`/catalog/${product.id}`}
                    className="hm-product"
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="hm-product-image"
                      />
                    )}

                    <div className="hm-product-info">
                      <h3 className="hm-product-name">
                        {product.name}
                      </h3>

                      <div className="hm-product-price">
                        {product.price} грн
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p>Товарів не знайдено.</p>
            )}
          </div>
        </section>
      )}

      {!search.trim() && (
        <>
          {/* ================= HERO ================= */}

          <section className="hm-hero">
            <img
              src={
                home.heroImage ||
                "/house-mix-family.jpg"
              }
              alt="House Mix"
              className="hm-hero-image"
            />

            <div className="hm-hero-overlay" />

            <div className="hm-hero-content">
              <div className="hm-hero-text">
                <div className="hm-hero-small">
                  HOUSE MIX • ПОСУД • ДЛЯ ДОМУ • ЗАТИШОК
                </div>

                <h1 className="hm-hero-title">
                  {home.title}
                </h1>

                <p className="hm-hero-description">
                  {home.subtitle}
                </p>

                <Link
                  href={home.buttonLink || "/catalog"}
                  className="hm-hero-button"
                >
                  {home.buttonText ||
                    "Переглянути колекцію →"}
                </Link>
              </div>
            </div>

            <div className="hm-slider-dots">
              <span className="hm-slider-dot active" />
              <span className="hm-slider-dot" />
              <span className="hm-slider-dot" />
            </div>
          </section>

          {/* ================= BENEFITS ================= */}

          <section className="hm-benefits">
            <div className="hm-container">
              <div className="hm-benefits-grid">
                <div className="hm-benefit">
                  <div className="hm-benefit-icon">🚚</div>
                  <div>
                    <div className="hm-benefit-title">
                      Швидка доставка
                    </div>
                    <div className="hm-benefit-text">
                      по Україні
                    </div>
                  </div>
                </div>

                <div className="hm-benefit">
                  <div className="hm-benefit-icon">🛡️</div>
                  <div>
                    <div className="hm-benefit-title">
                      Гарантія
                    </div>
                    <div className="hm-benefit-text">
                      якості
                    </div>
                  </div>
                </div>

                <div className="hm-benefit">
                  <div className="hm-benefit-icon">💳</div>
                  <div>
                    <div className="hm-benefit-title">
                      Зручна
                    </div>
                    <div className="hm-benefit-text">
                      оплата
                    </div>
                  </div>
                </div>

                <div className="hm-benefit">
                  <div className="hm-benefit-icon">🎁</div>
                  <div>
                    <div className="hm-benefit-title">
                      Акції
                    </div>
                    <div className="hm-benefit-text">
                      та подарунки
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= CATEGORIES ================= */}

          {home.showCategories &&
            categories.length > 0 && (
              <section className="hm-section">
                <div className="hm-container">
                  <div className="hm-section-header">
                    <h2 className="hm-section-title">
                      Популярні категорії
                    </h2>

                    <Link
                      href="/catalog"
                      className="hm-section-link"
                    >
                      Всі категорії →
                    </Link>
                  </div>

                  <div className="hm-categories">
                    {categories.slice(0, 4).map((category) => {
                      const image =
                        getCategoryImage(category);

                      return (
                        <Link
                          key={category.id}
                          href={`/catalog?category=${category.id}`}
                          className="hm-category"
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={category.name}
                              className="hm-category-image"
                            />
                          ) : (
                            <div className="hm-category-empty">
                              🏠
                            </div>
                          )}

                          <div className="hm-category-name">
                            {categoryTitle(category.name)}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

          {/* ================= PROMOTION ================= */}

          {home.showPromotions && (
            <section className="hm-promo">
              <img
                src={
                  home.heroImage ||
                  "/house-mix-family.jpg"
                }
                alt="Акції"
                className="hm-promo-image"
              />

              <div className="hm-promo-content">
                <div className="hm-container">
                  <h2 className="hm-promo-title">
                    Вигідні
                    <br />
                    акції
                  </h2>

                  <p className="hm-promo-text">
                    Слідкуй за знижками
                    <br />
                    та спеціальними пропозиціями!
                  </p>

                  <Link
                    href="/catalog"
                    className="hm-promo-button"
                  >
                    Переглянути акції →
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* ================= BEST SELLERS ================= */}

          {home.showBestSellers &&
            products.length > 0 && (
              <section className="hm-section">
                <div className="hm-container">
                  <div className="hm-section-header">
                    <h2 className="hm-section-title">
                      Хіти продажів
                    </h2>

                    <Link
                      href="/catalog"
                      className="hm-section-link"
                    >
                      Дивитись всі →
                    </Link>
                  </div>

                  <div className="hm-products">
                    {products.slice(0, 8).map((product) => (
                      <Link
                        key={product.id}
                        href={`/catalog/${product.id}`}
                        className="hm-product"
                      >
                        <div className="hm-hit">
                          Хіт
                        </div>

                        <div className="hm-heart">
                          ♡
                        </div>

                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="hm-product-image"
                          />
                        ) : (
                          <div className="hm-product-image" />
                        )}

                        <div className="hm-product-info">
                          <h3 className="hm-product-name">
                            {product.name}
                          </h3>

                          <div className="hm-product-price">
                            {product.price} грн
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

          {/* ================= FOOTER ================= */}

          <footer className="hm-footer">
            <div className="hm-container">
              <div className="hm-footer-grid">
                <div>
                  <h3>HOUSE MIX</h3>
                  <p>
                    Все для вашого дому.
                    <br />
                    Товари для затишку,
                    організації та кухні.
                  </p>
                </div>

                <div>
                  <h3>Магазин</h3>

                  <Link
                    href="/catalog"
                    className="hm-footer-link"
                  >
                    Каталог
                  </Link>

                  <Link
                    href="/cart"
                    className="hm-footer-link"
                  >
                    Кошик
                  </Link>

                  <Link
                    href="/order-status"
                    className="hm-footer-link"
                  >
                    Моє замовлення
                  </Link>
                </div>

                <div>
                  <h3>Інформація</h3>

                  <Link
                    href="/"
                    className="hm-footer-link"
                  >
                    Про нас
                  </Link>

                  <Link
                    href="/"
                    className="hm-footer-link"
                  >
                    Контакти
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </>
  );
}
