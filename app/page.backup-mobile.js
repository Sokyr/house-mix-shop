"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
const [promotions, setPromotions] = useState([]);
const [bestSellers, setBestSellers] = useState([]);
const [activeSlide, setActiveSlide] = useState(0);

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

  const lastTouchRef = useRef(0);

  function runHeaderAction(action, event) {
    if (event?.type === "touchstart") {
      event.preventDefault();
      event.stopPropagation();
      lastTouchRef.current = Date.now();
      action();
      return;
    }

    if (
      event?.type === "click" &&
      Date.now() - lastTouchRef.current < 700
    ) {
      return;
    }

    action();
  }

  function toggleSearch() {
    setSearchOpen((open) => !open);
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((open) => !open);
    setSearchOpen(false);
  }

  function handleButtonKeyDown(event, action) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
  const [homeRes, categoriesRes, productsRes, bestSellersRes, promotionsRes] =
  await Promise.all([
    fetch("/api/home"),
    fetch("/api/categories"),
    fetch("/api/products?home=1"),
    fetch("/api/products?bestSellers=1"),
    fetch("/api/promotions"),
  ]);
        const homeData = await homeRes.json();
        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();
const bestSellersData = await bestSellersRes.json();
if (Array.isArray(bestSellersData)) {
  setBestSellers(bestSellersData);
}
const promotionsData = await promotionsRes.json();

if (Array.isArray(promotionsData)) {
  setPromotions(
    promotionsData.filter((promotion) => promotion.isActive)
  );
}

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

  try {
    localStorage.setItem(
      "houseMixProductsCache",
      JSON.stringify(productsData)
    );
  } catch {}
 } 
     } catch (error) {
        console.error("HOME ERROR:", error);
      }
    }

    loadData();
  }, []);
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

      setCartCount(
        cart.reduce(
          (sum, item) => sum + Number(item.quantity || 1),
          0
        )
      );
    } catch (error) {
      console.error("PROMOTION CART ERROR:", error);
    }
  }

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
  const product = products.find(
    (item) =>
      Number(item.categoryId) === Number(category.id) &&
      item.image
  );

  return product?.image || "";
}  function categoryTitle(name) {
    if (name === "Посуд") return "Посуд";

    if (name === "Організація простору") {
      return "Організація\nпростору";
    }

    if (name.toLowerCase().includes("суш")) {
      return "Сушарки\nдля одягу";
    }

    if (name.toLowerCase().includes("взут")) {
      return "Полиці\nдля взуття";
    }

    return name;
  }

  return (
    <div className="hm-page">

      {/* ================= HEADER ================= */}

      <header className="hm-header">

        <Link href="/" className="hm-logo">
          <div>
            <div className="hm-logo-title">HOUSE MIX</div>
            <div className="hm-logo-subtitle">
              ВСЕ ДЛЯ ВАШОГО ДОМУ ♡
            </div>
          </div>
        </Link>

        <div
          className="hm-header-actions"
          style={{
            position: "relative",
            zIndex: 99999,
            pointerEvents: "auto",
          }}
        >


        
          {/* ПОШУК */}
<button
  type="button"
  className="hm-header-button"
  onTouchStart={(e) => runHeaderAction(toggleSearch, e)}
  onClick={(e) => runHeaderAction(toggleSearch, e)}
  aria-label="Пошук"
>
  <span className="hm-search-icon" />
</button>
          {/* КОШИК */}

          <Link
            href="/cart"
            className="hm-header-button"
            aria-label="Кошик"
          >
            <span className="hm-cart-icon">
              🛒
            </span>

            {cartCount > 0 && (
              <span className="hm-cart-count">
                {cartCount}
              </span>
            )}
          </Link>

          {/* МЕНЮ */}

         <button
  type="button"
  className="hm-header-button"
  onTouchStart={(e) => runHeaderAction(toggleMenu, e)}
  onClick={(e) => runHeaderAction(toggleMenu, e)}
  aria-label="Меню"
>
  <span className="hm-menu-icon">
    <span />
    <span />
    <span />
  </span>
</button>
        </div>
        {/* ПОШУК */}

        {searchOpen && (
          <div
            className="hm-search-box"
            style={{
              position: "absolute",
              zIndex: 99999,
              pointerEvents: "auto",
            }}
          >
            <input
              autoFocus
              className="hm-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Пошук товару..."
            />
          </div>
        )}

        {/* МЕНЮ */}

        {menuOpen && (
          <div
            className="hm-menu"
            style={{
              position: "absolute",
              zIndex: 99999,
              pointerEvents: "auto",
            }}
          >

            <Link
              href="/"
              className="hm-menu-link"
              onClick={() => setMenuOpen(false)}
            >
              🏠 <span>Головна</span>
            </Link>

            <Link
              href="/catalog"
              className="hm-menu-link"
              onClick={() => setMenuOpen(false)}
            >
              ▦ <span>Каталог</span>
            </Link>

            <Link
              href="/cart"
              className="hm-menu-link"
              onClick={() => setMenuOpen(false)}
            >
              🛒 <span>Кошик</span>
            </Link>

            <Link
              href="/promotions"

              className="hm-menu-link"
              onClick={() => setMenuOpen(false)}
            >
              ♡ <span>Акції</span>
            </Link>

            <Link
              href="/order-status"
              className="hm-menu-link"
              onClick={() => setMenuOpen(false)}
            >
              📋 <span>Мої замовлення</span>
            </Link>

            <Link
              href="/"
              className="hm-menu-link"
              onClick={() => setMenuOpen(false)}
            >
              ☎ <span>Контакти</span>
            </Link>

            <Link
              href="/"
              className="hm-menu-link"
              onClick={() => setMenuOpen(false)}
            >
              ⓘ <span>Про нас</span>
            </Link>

          </div>
        )}

      </header>

      {/* ================= SEARCH RESULTS ================= */}

      {search.trim() ? (
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
                type="button"
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

                {filteredProducts
                  .slice(0, 8)
                  .map((product) => (
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
      ) : (
        <>

          {/* ================= HERO ================= */}

<section className="hm-hero">

  {activeSlide === 0 && (
    <>
      <img
        src={home.heroImage || "/house-mix-family.jpg"}
        alt="House Mix"
        className="hm-hero-image"
      />

      <div className="hm-hero-overlay" />

      <div className="hm-hero-content">
        <div className="hm-container">
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
              {home.buttonText || "Переглянути колекцію →"}
            </Link>

          </div>
        </div>
      </div>
    </>
  )}

  {activeSlide === 1 && (
    <>
      <img
       src="/house-mix-history.jpg"
        alt="Історія House Mix"
        className="hm-hero-image"
      />

      <div className="hm-hero-overlay" />

      <div className="hm-hero-content">
        <div className="hm-container">
        <div
  className="hm-hero-text"
  style={{ transform: "translateY(-30px)" }}
>

            <div className="hm-hero-small">
              HOUSE MIX • НАША ІСТОРІЯ
            </div>

           <p
  className="hm-hero-description"
style={{ fontSize: "16px", lineHeight: "1.45" }}
>
            Я гадаю вам не цікаво чути про те, який крутий магазин, як багато товарів у ньому та наскільки в нас все за**ісь. Самостійно побачите і відчуєте це. Я гадаю ви пришли сюди за якоюсь історією про 2 довб*нутих власників цього магазину, тому слухайте!
Все почалося з того, що один торговий представник просто за**ався працювати на дядю.
Вставати зранку, їздити по клієнтах, виконувати чужі плани й заробляти комусь гроші. І в один момент подумав:
«А нах*й воно мені треба? Чому б не зробити щось своє?»
Ідея була, бажання було — не вистачало тільки напарника.
І тут, як це часто буває, в один день зустрічаєш старого товариша. Поговорили про життя, про роботу, про те, як усіх уже за**ало працювати на когось.
І тут він каже:
«Я теж хочу щось своє мут*ти».
Ну і все. Зійшлися два таких самих довб*нутих підприємця 😄
Об’єдналися, почали шукати товар, думати, як усе організувати, і поступово запустили свій магазин.
Без великих інвесторів, без золотих ложок і без гарантій, що все вийде.
Просто двоє хлопців, які одного дня сказали:
«Та пішло воно н*хуй. Будемо робити своє».
Так і почалася наша історія.
А далі — тільки більше. 🚀            </p>

          </div>
        </div>
      </div>
    </>
  )}

  {activeSlide === 2 && (
    <>
      <img
        src="/house-mix-family.jpg"
        alt="House Mix"
        className="hm-hero-image"
      />

      <div className="hm-hero-overlay" />

      <div className="hm-hero-content">
        <div className="hm-container">
          <div className="hm-hero-text">

            <div className="hm-hero-small">
              HOUSE MIX • ДЛЯ ВАШОГО ДОМУ
            </div>

            <h1 className="hm-hero-title">
              Затишок починається з деталей
            </h1>

            <p className="hm-hero-description">
              Практичні товари для кухні, дому та комфортного
              повсякденного життя.
            </p>

          </div>
        </div>
      </div>
    </>
  )}

  {/* Ліва стрілка */}
  <button
    type="button"
    className="hm-slider-arrow hm-slider-arrow-left"
    onClick={() =>
      setActiveSlide(
        activeSlide === 0 ? 2 : activeSlide - 1
      )
    }
    aria-label="Попередній слайд"
  >
    ←
  </button>

  {/* Права стрілка */}
  <button
    type="button"
    className="hm-slider-arrow hm-slider-arrow-right"
    onClick={() =>
      setActiveSlide(
        activeSlide === 2 ? 0 : activeSlide + 1
      )
    }
    aria-label="Наступний слайд"
  >
    →
  </button>

  {/* Крапки */}
  <div className="hm-slider-dots">

    <button
      type="button"
      className={`hm-slider-dot ${
        activeSlide === 0 ? "active" : ""
      }`}
      onClick={() => setActiveSlide(0)}
      aria-label="Головний слайд"
    />

    <button
      type="button"
      className={`hm-slider-dot ${
        activeSlide === 1 ? "active" : ""
      }`}
      onClick={() => setActiveSlide(1)}
      aria-label="Історія House Mix"
    />

    <button
      type="button"
      className={`hm-slider-dot ${
        activeSlide === 2 ? "active" : ""
      }`}
      onClick={() => setActiveSlide(2)}
      aria-label="Третій слайд"
    />

  </div>

</section>
          {/* ================= BENEFITS ================= */}

          <section className="hm-benefits">

            <div className="hm-container">

              <div className="hm-benefits-grid">

                <div className="hm-benefit">

                  <div className="hm-benefit-icon">
                    🚚
                  </div>

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

                  <div className="hm-benefit-icon">
                    🛡️
                  </div>

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

                  <div className="hm-benefit-icon">
                    💳
                  </div>

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

                  <div className="hm-benefit-icon">
                    🎁
                  </div>

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
                    href="/categories"
                      className="hm-section-link"
                    >
                      Всі категорії →
                    </Link>

                  </div>

                  <div className="hm-categories">

                    {categories
                      .slice(0, 4)
                      .map((category) => {

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
                              {categoryTitle(
                                category.name
                              )}
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
    <Link href="/promotions" className="hm-promo-link">
      <img
       src="/promotions-banner.png"
        alt="Акції та пропозиції"
        className="hm-promo-image"
      />
    </Link>
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
  onPointerEnter={() => {
    fetch("/api/products");
    fetch("/api/categories");
  }}
>                      Дивитись всі →
                    </Link>

                  </div>

                  <div className="hm-products">

             
  {bestSellers.map((product) => (
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
  href="/about"
  className="hm-footer-link"
>
  Про нас
</Link>
                  <Link
                  href="/contact"
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

    </div>
  );
}