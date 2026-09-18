"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // =========================
  // ТОВАР
  // =========================

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // =========================
  // ГОЛОВНА СТОРІНКА
  // =========================

  const [homeLoading, setHomeLoading] = useState(true);
  const [homeSaving, setHomeSaving] = useState(false);

  const [heroImage, setHeroImage] = useState("");
  const [homeTitle, setHomeTitle] = useState("House Mix");
  const [homeSubtitle, setHomeSubtitle] = useState(
    "Все для затишку вашого дому"
  );
  const [homeButtonText, setHomeButtonText] = useState(
    "Перейти до каталогу"
  );
  const [homeButtonLink, setHomeButtonLink] = useState("/catalog");

  const [showCategories, setShowCategories] = useState(true);
  const [showPromotions, setShowPromotions] = useState(true);
  const [showBestSellers, setShowBestSellers] = useState(true);

  // =========================
  // СТАН
  // =========================

  const [message, setMessage] = useState("");
  const [homeMessage, setHomeMessage] = useState("");

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // =========================
  // АВТОРИЗАЦІЯ
  // =========================

  useEffect(() => {
    const isAdmin = localStorage.getItem("houseMixAdmin");

    if (isAdmin !== "true") {
      router.replace("/admin-login");
      return;
    }

    setCheckingAuth(false);
  }, [router]);

  // =========================
  // ТОВАРИ
  // =========================

  async function loadProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function loadCategories() {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();

      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // =========================
  // ГОЛОВНА
  // =========================

  async function loadHomeSettings() {
    try {
      setHomeLoading(true);

      const res = await fetch("/api/home");

      if (!res.ok) {
        throw new Error("Не вдалося завантажити головну");
      }

      const data = await res.json();

      if (data.settings) {
        setHeroImage(data.settings.heroImage || "");
        setHomeTitle(data.settings.title || "House Mix");
        setHomeSubtitle(
          data.settings.subtitle || "Все для затишку вашого дому"
        );
        setHomeButtonText(
          data.settings.buttonText || "Перейти до каталогу"
        );
        setHomeButtonLink(
          data.settings.buttonLink || "/catalog"
        );

        setShowCategories(
          data.settings.showCategories !== false
        );

        setShowPromotions(
          data.settings.showPromotions !== false
        );

        setShowBestSellers(
          data.settings.showBestSellers !== false
        );
      }
    } catch (error) {
      console.error("HOME LOAD ERROR:", error);
      setHomeMessage("Не вдалося завантажити налаштування головної");
    } finally {
      setHomeLoading(false);
    }
  }

  async function saveHomeSettings(e) {
    e.preventDefault();

    setHomeMessage("");
    setHomeSaving(true);

    try {
      const res = await fetch("/api/home", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heroImage,
          title: homeTitle,
          subtitle: homeSubtitle,
          buttonText: homeButtonText,
          buttonLink: homeButtonLink,
          showCategories,
          showPromotions,
          showBestSellers,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Помилка збереження");
      }

      setHomeMessage("✅ Головну сторінку успішно збережено!");
    } catch (error) {
      console.error("HOME SAVE ERROR:", error);
      setHomeMessage("❌ Не вдалося зберегти налаштування");
    } finally {
      setHomeSaving(false);
    }
  }

  function handleHomeImage(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setHomeMessage("❌ Оберіть файл зображення");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setHeroImage(reader.result);
      setHomeMessage("");
    };

    reader.onerror = () => {
      setHomeMessage("❌ Не вдалося прочитати зображення");
    };

    reader.readAsDataURL(file);
  }

  // =========================
  // ЗАВАНТАЖЕННЯ
  // =========================

  useEffect(() => {
    if (!checkingAuth) {
      loadProducts();
      loadCategories();
      loadHomeSettings();
    }
  }, [checkingAuth]);

  // =========================
  // РЕДАГУВАННЯ ТОВАРУ
  // =========================

  function handleImage(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function startEdit(product) {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description || "");
    setImage(product.image || "");
    setCategoryId(
      product.categoryId ? String(product.categoryId) : ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setPrice("");
    setDescription("");
    setImage("");
    setCategoryId("");
    setMessage("");
  }

  // =========================
  // ЗБЕРЕЖЕННЯ ТОВАРУ
  // =========================

  async function saveProduct(e) {
    e.preventDefault();
    setMessage("");

    if (!categoryId) {
      setMessage("Оберіть категорію товару");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          name,
          price,
          description,
          image,
          categoryId: Number(categoryId),
        }),
      });

      if (res.ok) {
        setMessage(
          editingId
            ? "Товар успішно змінено!"
            : "Товар успішно додано!"
        );

        setEditingId(null);
        setName("");
        setPrice("");
        setDescription("");
        setImage("");
        setCategoryId("");

        e.target.reset();

        loadProducts();
      } else {
        setMessage(
          editingId
            ? "Помилка при редагуванні товару"
            : "Помилка при додаванні товару"
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Помилка з'єднання із сервером");
    }
  }

  // =========================
  // ВИДАЛЕННЯ ТОВАРУ
  // =========================

  async function deleteProduct(id) {
    const confirmed = confirm("Точно видалити цей товар?");

    if (!confirmed) return;

    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (res.ok) {
        setMessage("Товар видалено!");
        loadProducts();
      } else {
        setMessage("Помилка при видаленні товару");
      }
    } catch (error) {
      console.error(error);
      setMessage("Помилка з'єднання із сервером");
    }
  }

  // =========================
  // ВИХІД
  // =========================

  function logout() {
    localStorage.removeItem("houseMixAdmin");
    router.replace("/admin-login");
  }

  // =========================
  // ПЕРЕВІРКА
  // =========================

  if (checkingAuth) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2>Перевірка доступу...</h2>
      </main>
    );
  }

  // =========================
  // АДМІНКА
  // =========================

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        paddingBottom: "60px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ================= HEADER ================= */}

      <header
        style={{
          minHeight: "80px",
          background: "#111",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px 5%",
          boxSizing: "border-box",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          House Mix
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <a
            href="#home-editor"
            style={headerButtonStyle}
          >
            🏠 Головна
          </a>

          <a
            href="/admin/orders"
            style={headerButtonStyle}
          >
            📦 Замовлення
          </a>

          <a
            href="/"
            style={headerButtonStyle}
          >
            🌐 На сайт
          </a>

          <button
            onClick={logout}
            style={{
              ...headerButtonStyle,
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
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        <h1>Адмін-панель House Mix</h1>

        <p
          style={{
            color: "#666",
            marginTop: "8px",
          }}
        >
          Керування сайтом, головною сторінкою та товарами
        </p>

        {/* ========================= */}
        {/* РЕДАКТОР ГОЛОВНОЇ */}
        {/* ========================= */}

        <section
          id="home-editor"
          style={{
            marginTop: "30px",
            background: "white",
            padding: "25px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>
                🏠 Головна сторінка
              </h2>

              <p
                style={{
                  color: "#666",
                  marginTop: "7px",
                  marginBottom: 0,
                }}
              >
                Редагування головного блоку сайту без коду
              </p>
            </div>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                background: "#111",
                color: "white",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              👀 Переглянути
            </a>
          </div>

          {homeLoading ? (
            <div
              style={{
                marginTop: "25px",
                padding: "25px",
                background: "#f7f7f7",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              Завантаження налаштувань...
            </div>
          ) : (
            <form
              onSubmit={saveHomeSettings}
              style={{
                display: "grid",
                gap: "16px",
                marginTop: "25px",
              }}
            >
              {/* ФОТО */}

              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "700",
                    marginBottom: "8px",
                  }}
                >
                  🖼️ Головне фото
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHomeImage}
                />

                {heroImage && (
                  <div style={{ marginTop: "15px" }}>
                    <img
                      src={heroImage}
                      alt="Головне фото"
                      style={{
                        width: "100%",
                        maxWidth: "700px",
                        height: "300px",
                        objectFit: "cover",
                        borderRadius: "14px",
                        border: "1px solid #ddd",
                        display: "block",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* ЗАГОЛОВОК */}

              <div>
                <label style={labelStyle}>
                  ✏️ Заголовок
                </label>

                <input
                  value={homeTitle}
                  onChange={(e) =>
                    setHomeTitle(e.target.value)
                  }
                  placeholder="House Mix"
                  style={inputStyle}
                />
              </div>

              {/* ПІДЗАГОЛОВОК */}

              <div>
                <label style={labelStyle}>
                  📝 Текст під заголовком
                </label>

                <textarea
                  value={homeSubtitle}
                  onChange={(e) =>
                    setHomeSubtitle(e.target.value)
                  }
                  placeholder="Все для затишку вашого дому"
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />
              </div>

              {/* КНОПКА */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(0, 1fr) minmax(0, 1fr)",
                  gap: "15px",
                }}
              >
                <div>
                  <label style={labelStyle}>
                    🔘 Текст кнопки
                  </label>

                  <input
                    value={homeButtonText}
                    onChange={(e) =>
                      setHomeButtonText(e.target.value)
                    }
                    placeholder="Перейти до каталогу"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>
                    🔗 Посилання кнопки
                  </label>

                  <input
                    value={homeButtonLink}
                    onChange={(e) =>
                      setHomeButtonLink(e.target.value)
                    }
                    placeholder="/catalog"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* ПЕРЕМИКАЧІ */}

              <div
                style={{
                  borderTop: "1px solid #eee",
                  paddingTop: "20px",
                  marginTop: "5px",
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  👁️ Блоки головної сторінки
                </h3>

                <label style={checkRowStyle}>
                  <input
                    type="checkbox"
                    checked={showCategories}
                    onChange={(e) =>
                      setShowCategories(e.target.checked)
                    }
                  />

                  <span>
                    Показувати категорії
                  </span>
                </label>

                <label style={checkRowStyle}>
                  <input
                    type="checkbox"
                    checked={showPromotions}
                    onChange={(e) =>
                      setShowPromotions(e.target.checked)
                    }
                  />

                  <span>
                    Показувати акції
                  </span>
                </label>

                <label style={checkRowStyle}>
                  <input
                    type="checkbox"
                    checked={showBestSellers}
                    onChange={(e) =>
                      setShowBestSellers(e.target.checked)
                    }
                  />

                  <span>
                    Показувати популярні товари
                  </span>
                </label>
              </div>

              {/* ЗБЕРЕГТИ */}

              <button
                type="submit"
                disabled={homeSaving}
                style={{
                  padding: "15px",
                  fontSize: "17px",
                  fontWeight: "700",
                  cursor: homeSaving
                    ? "not-allowed"
                    : "pointer",
                  background: "#111",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  opacity: homeSaving ? 0.6 : 1,
                }}
              >
                {homeSaving
                  ? "Збереження..."
                  : "💾 Зберегти головну сторінку"}
              </button>

              {homeMessage && (
                <div
                  style={{
                    padding: "13px",
                    borderRadius: "10px",
                    background: "#f3f3f3",
                    fontWeight: "600",
                  }}
                >
                  {homeMessage}
                </div>
              )}
            </form>
          )}
        </section>

        {/* ========================= */}
        {/* ТОВАР */}
        {/* ========================= */}

        <form
          onSubmit={saveProduct}
          style={{
            display: "grid",
            gap: 14,
            marginTop: 30,
            background: "white",
            padding: 25,
            borderRadius: 16,
            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
          }}
        >
          <h2>
            {editingId
              ? "✏️ Редагувати товар"
              : "➕ Додати товар"}
          </h2>

          <input
            placeholder="Назва товару"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            placeholder="Ціна, грн"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={inputStyle}
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">
              Оберіть категорію
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <label>
            <b>Фото товару</b>
            <br />

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              style={{
                marginTop: 8,
              }}
            />
          </label>

          {image && (
            <img
              src={image}
              alt="Попередній перегляд"
              style={{
                width: 200,
                height: 200,
                objectFit: "contain",
                border: "1px solid #ddd",
                borderRadius: 10,
              }}
            />
          )}

          <textarea
            placeholder="Опис товару"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={5}
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />

          <button
            type="submit"
            style={{
              padding: 14,
              fontSize: 16,
              cursor: "pointer",
              background: "#111",
              color: "white",
              border: "none",
              borderRadius: 8,
            }}
          >
            {editingId
              ? "💾 Зберегти зміни"
              : "➕ Додати товар"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                padding: 14,
                fontSize: 16,
                cursor: "pointer",
                background: "#ddd",
                color: "#111",
                border: "none",
                borderRadius: 8,
              }}
            >
              ❌ Скасувати редагування
            </button>
          )}
        </form>

        {message && (
          <p
            style={{
              marginTop: 15,
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}

        {/* ========================= */}
        {/* ТОВАРИ */}
        {/* ========================= */}

        <h2 style={{ marginTop: 35 }}>
          Товари
        </h2>

        {products.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "14px",
              marginTop: "15px",
              textAlign: "center",
            }}
          >
            <p>Товарів поки немає.</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              style={{
                background: "white",
                border: "1px solid #ddd",
                padding: 18,
                marginTop: 12,
                borderRadius: 12,
                boxShadow:
                  "0 3px 10px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: 150,
                      height: 150,
                      objectFit: "contain",
                      borderRadius: 8,
                      background: "#fafafa",
                    }}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      marginTop: 0,
                      fontSize: 21,
                    }}
                  >
                    {product.name}
                  </h3>

                  <p>
                    <b>{product.price} грн</b>
                  </p>

                  {product.category && (
                    <p>
                      <b>Категорія:</b>{" "}
                      {product.category.name}
                    </p>
                  )}

                  <p
                    style={{
                      color: "#666",
                    }}
                  >
                    {product.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: 15,
                    }}
                  >
                    <button
                      onClick={() =>
                        startEdit(product)
                      }
                      style={{
                        padding: "10px 18px",
                        background: "#111",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 15,
                      }}
                    >
                      ✏️ Редагувати
                    </button>

                    <button
                      onClick={() =>
                        deleteProduct(product.id)
                      }
                      style={{
                        padding: "10px 18px",
                        background: "#d32f2f",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 15,
                      }}
                    >
                      🗑️ Видалити
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      <style jsx>{`
        @media (max-width: 700px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

const inputStyle = {
  padding: 12,
  fontSize: 16,
  border: "1px solid #ccc",
  borderRadius: 8,
  boxSizing: "border-box",
  width: "100%",
};

const labelStyle = {
  display: "block",
  fontWeight: "700",
  marginBottom: "8px",
};

const checkRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "13px",
  cursor: "pointer",
  fontSize: "16px",
};

const headerButtonStyle = {
  color: "white",
  textDecoration: "none",
  padding: "10px 15px",
  borderRadius: "22px",
  background: "#222",
  border: "1px solid #333",
  fontSize: "14px",
};