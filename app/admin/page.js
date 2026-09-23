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
const [isBestSeller, setIsBestSeller] = useState(false);

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
const [promotions, setPromotions] = useState([]);
const [newCategoryName, setNewCategoryName] = useState("");
const [newCategoryImage, setNewCategoryImage] = useState("");
const [categoryMessage, setCategoryMessage] = useState("");
const [promotionTitle, setPromotionTitle] = useState("");
const [promotionSubtitle, setPromotionSubtitle] = useState("");
const [promotionImage, setPromotionImage] = useState("");
const [promotionButtonText, setPromotionButtonText] = useState("Переглянути →");
const [promotionButtonLink, setPromotionButtonLink] = useState("/catalog");
const [promotionSortOrder, setPromotionSortOrder] = useState(0);
const [promotionActive, setPromotionActive] = useState(true);
const [promotionProductIds, setPromotionProductIds] = useState([]);
const [promotionPrice, setPromotionPrice] = useState("");
const [editingPromotionId, setEditingPromotionId] = useState(null);
const [promotionMessage, setPromotionMessage] = useState("");
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
async function addCategory() {
  const name = newCategoryName.trim();

  if (!name) {
    setCategoryMessage("Введи назву категорії");
    return;
  }

  try {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  name,
  image: newCategoryImage,
}),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Не вдалося додати категорію");
    }

    setNewCategoryName("");
    setCategoryMessage("Категорію додано ✅");
    loadCategories();
  } catch (error) {
    setCategoryMessage(error.message);
  }
}

async function deleteCategory(id) {
  if (!confirm("Видалити цю категорію?")) return;

  try {
    const res = await fetch(`/api/categories?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Не вдалося видалити категорію");
    }

    setCategoryMessage("Категорію видалено ✅");
    loadCategories();
  } catch (error) {
    setCategoryMessage(error.message);
  }
}
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
  async function loadPromotions() {
  try {
    const res = await fetch("/api/promotions");
    const data = await res.json();

    if (Array.isArray(data)) {
      setPromotions(data);
    }
  } catch (error) {
    console.error("PROMOTIONS LOAD ERROR:", error);
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
loadPromotions();
    }
  }, [checkingAuth]);
// =========================
// АКЦІЇ
// =========================

function resetPromotionForm() {
  setPromotionTitle("");
  setPromotionSubtitle("");
  setPromotionImage("");
  setPromotionButtonText("Переглянути →");
  setPromotionButtonLink("/catalog");
  setPromotionSortOrder(0);
  setPromotionActive(true);
setPromotionProductIds([]);
setPromotionPrice("");
  setEditingPromotionId(null);
  setPromotionMessage("");
}

function handlePromotionImage(e) {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setPromotionMessage("❌ Оберіть файл зображення");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    setPromotionImage(reader.result);
    setPromotionMessage("");
  };

  reader.onerror = () => {
    setPromotionMessage("❌ Не вдалося прочитати зображення");
  };

  reader.readAsDataURL(file);
}

function startEditPromotion(promotion) {
  setEditingPromotionId(promotion.id);
  setPromotionTitle(promotion.title || "");
  setPromotionSubtitle(promotion.subtitle || "");
  setPromotionImage(promotion.image || "");
  setPromotionButtonText(
    promotion.buttonText || "Переглянути →"
  );
  setPromotionButtonLink(
    promotion.buttonLink || "/catalog"
  );
  setPromotionSortOrder(promotion.sortOrder || 0);
  setPromotionActive(promotion.isActive !== false);
setPromotionProductIds(
  Array.isArray(promotion.productIds)
    ? promotion.productIds
    : JSON.parse(promotion.productIds || "[]")
);
setPromotionPrice(promotion.promoPrice || "");
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

async function savePromotion(e) {
  e.preventDefault();
  setPromotionMessage("");

  try {
    const res = await fetch("/api/promotions", {
      method: editingPromotionId ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingPromotionId,
        title: promotionTitle,
        subtitle: promotionSubtitle,
        image: promotionImage,
        buttonText: promotionButtonText,
        buttonLink: promotionButtonLink,
        sortOrder: Number(promotionSortOrder) || 0,
        isActive: promotionActive,
        productIds: promotionProductIds,
        promoPrice: Number(promotionPrice) || 0,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Помилка збереження");
    }

    setPromotionMessage(
      editingPromotionId
        ? "✅ Акцію успішно змінено!"
        : "✅ Акцію успішно додано!"
    );

    resetPromotionForm();
    await loadPromotions();
  } catch (error) {
    console.error("PROMOTION SAVE ERROR:", error);
    setPromotionMessage(
      "❌ Не вдалося зберегти акцію"
    );
  }
}

async function deletePromotion(id) {
  const confirmed = confirm(
    "Точно видалити цю акцію?"
  );

  if (!confirmed) return;

  try {
    const res = await fetch(
      `/api/promotions?id=${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("Помилка видалення");
    }

    setPromotionMessage("✅ Акцію видалено!");
    await loadPromotions();
  } catch (error) {
    console.error("PROMOTION DELETE ERROR:", error);
    setPromotionMessage(
      "❌ Не вдалося видалити акцію"
    );
  }
}
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
isBestSeller,
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
setIsBestSeller(false);

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
{/* АКЦІЇ */}
{/* ========================= */}

<section
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
      marginBottom: "20px",
    }}
  >
    <div>
      <h2
        style={{
          margin: 0,
          fontSize: "26px",
        }}
      >
        Акції
      </h2>

      <p
        style={{
          margin: "6px 0 0",
          color: "#777",
        }}
      >
        Додавайте та редагуйте акції магазину
      </p>
    </div>

    {editingPromotionId && (
      <button
        type="button"
        onClick={resetPromotionForm}
        style={{
          padding: "10px 16px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          background: "#fff",
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        Скасувати редагування
      </button>
    )}
  </div>

  <form onSubmit={savePromotion}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "15px",
      }}
    >
      <div>
        <label>Назва акції</label>
        <input
          value={promotionTitle}
          onChange={(e) => setPromotionTitle(e.target.value)}
          placeholder="Наприклад: 2+1 для випічки"
          style={inputStyle}
        />
      </div>

      <div>
        <label>Короткий опис</label>
        <input
          value={promotionSubtitle}
          onChange={(e) => setPromotionSubtitle(e.target.value)}
          placeholder="Коротко про пропозицію"
          style={inputStyle}
        />
      </div>

      <div>
        <label>Текст кнопки</label>
        <input
          value={promotionButtonText}
          onChange={(e) => setPromotionButtonText(e.target.value)}
          placeholder="Переглянути →"
          style={inputStyle}
        />
      </div>

      <div>
        <label>Посилання кнопки</label>
        <input
          value={promotionButtonLink}
          onChange={(e) => setPromotionButtonLink(e.target.value)}
          placeholder="/catalog"
          style={inputStyle}
        />
      </div>

      <div>
        <label>Порядок</label>
        <input
          type="number"
          value={promotionSortOrder}
          onChange={(e) => setPromotionSortOrder(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div>
        <label>Ціна акції</label>
        <input
          type="number"
          value={promotionPrice}
          onChange={(e) => setPromotionPrice(e.target.value)}
          placeholder="Наприклад: 250"
          style={inputStyle}
        />
      </div>

      <div>
        <label>Товари в наборі</label>

        <div
          style={{
            marginTop: "8px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "10px",
            maxHeight: "250px",
            overflowY: "auto",
          }}
        >
          {products.map((product) => (
            <label
              key={product.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 0",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={promotionProductIds.includes(product.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPromotionProductIds([
                      ...promotionProductIds,
                      product.id,
                    ]);
                  } else {
                    setPromotionProductIds(
                      promotionProductIds.filter(
                        (id) => id !== product.id
                      )
                    );
                  }
                }}
              />

              <span>
                {product.name} — {product.price} грн
              </span>
            </label>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          paddingTop: "25px",
        }}
      >
        <input
          type="checkbox"
          checked={promotionActive}
          onChange={(e) => setPromotionActive(e.target.checked)}
        />

        <span>Показувати акцію</span>
      </div>
    </div>

    <div style={{ marginTop: "18px" }}>
      <label>Зображення акції</label>

      <input
        type="file"
        accept="image/*"
        onChange={handlePromotionImage}
        style={{
          display: "block",
          marginTop: "8px",
        }}
      />

      {promotionImage && (
        <img
          src={promotionImage}
          alt="Попередній перегляд"
          style={{
            width: "100%",
            maxWidth: "500px",
            height: "220px",
            objectFit: "cover",
            borderRadius: "12px",
            marginTop: "15px",
            display: "block",
          }}
        />
      )}
    </div>

    {promotionMessage && (
      <p
        style={{
          marginTop: "15px",
          fontWeight: 700,
        }}
      >
        {promotionMessage}
      </p>
    )}

    <button
      type="submit"
      style={{
        marginTop: "20px",
        padding: "13px 22px",
        border: "none",
        borderRadius: "10px",
        background: "#657b22",
        color: "white",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: "16px",
      }}
    >
      {editingPromotionId ? "Зберегти зміни" : "Додати акцію"}
    </button>
  </form>

  {promotions.length > 0 && (
    <div
      style={{
        marginTop: "30px",
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "15px",
      }}
    >
      {promotions.map((promotion) => (
        <div
          key={promotion.id}
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: "14px",
            overflow: "hidden",
            background: "#fafafa",
          }}
        >
          {promotion.image && (
            <img
              src={promotion.image}
              alt={promotion.title || "Акція"}
              style={{
                width: "100%",
                height: "170px",
                objectFit: "cover",
                display: "block",
              }}
            />
          )}

          <div style={{ padding: "15px" }}>
            <h3 style={{ margin: "0 0 8px" }}>
              {promotion.title || "Без назви"}
            </h3>

            <p
              style={{
                margin: "0 0 12px",
                color: "#666",
              }}
            >
              {promotion.subtitle || "Без опису"}
            </p>

            <p
              style={{
                margin: "0 0 12px",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {promotion.isActive
                ? "🟢 Активна"
                : "🔴 Вимкнена"}
            </p>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => startEditPromotion(promotion)}
                style={{
                  padding: "9px 14px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#333",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Редагувати
              </button>

              <button
                type="button"
                onClick={() => deletePromotion(promotion.id)}
                style={{
                  padding: "9px 14px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#c62828",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Видалити
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
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
<label
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    marginBottom: "12px",
  }}
>
  <input
    type="checkbox"
    checked={isBestSeller}
    onChange={(e) => setIsBestSeller(e.target.checked)}
    style={{
      width: "20px",
      height: "20px",
      cursor: "pointer",
    }}
  />

  <span style={{ fontWeight: "700" }}>
    🔥 Хіт продажів
  </span>
</label>
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
{/* КАТЕГОРІЇ */}
{/* ========================= */}

<h2 style={{ marginTop: 35 }}>
  Категорії
</h2>

<div
  style={{
    display: "flex",
    gap: 10,
    marginBottom: 15,
    flexWrap: "wrap",
  }}
>
  <input
    type="text"
    placeholder="Назва нової категорії"
    value={newCategoryName}
    onChange={(e) => setNewCategoryName(e.target.value)}
    style={{
      flex: 1,
      minWidth: 250,
      padding: 12,
      border: "1px solid #ddd",
      borderRadius: 8,
      fontSize: 16,
    }}
  />

<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setNewCategoryImage(reader.result);
    };

    reader.readAsDataURL(file);
  }}
/>
  <button
    type="button"
    onClick={addCategory}
    style={{
      padding: "12px 18px",
      background: "#111",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: "700",
    }}
  >
    ➕ Додати категорію
  </button>
</div>

{categoryMessage && (
  <p style={{ fontWeight: "700" }}>
    {categoryMessage}
  </p>
)}

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 30,
  }}
>
  {categories.map((category) => (
    <div
      key={category.id}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <span style={{ fontWeight: "600" }}>
        {category.name}
      </span>

      <button
        type="button"
        onClick={() => deleteCategory(category.id)}
        style={{
          padding: "8px 12px",
          background: "#e53935",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        🗑 Видалити
      </button>
    </div>
  ))}
</div>
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