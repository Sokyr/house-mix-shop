"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem("houseMixAdmin");

    if (isAdmin !== "true") {
      router.replace("/admin-login");
      return;
    }

    setCheckingAuth(false);
  }, [router]);

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

  useEffect(() => {
    if (!checkingAuth) {
      loadProducts();
    }
  }, [checkingAuth]);

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
    setMessage("");
  }

  async function saveProduct(e) {
    e.preventDefault();
    setMessage("");

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
      <header
        style={{
          height: "80px",
          background: "#111",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 5%",
          boxSizing: "border-box",
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
            href="/admin/orders"
            style={headerButtonStyle}
          >
            📦 Замовлення
          </a>

          <a
            href="/"
            style={headerButtonStyle}
          >
            🏠 На сайт
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
          maxWidth: "900px",
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
          Керування товарами магазину
        </p>

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
            onChange={(e) => setDescription(e.target.value)}
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
                boxShadow: "0 3px 10px rgba(0,0,0,0.04)",
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
                      onClick={() => startEdit(product)}
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
                      onClick={() => deleteProduct(product.id)}
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

const headerButtonStyle = {
  color: "white",
  textDecoration: "none",
  padding: "10px 15px",
  borderRadius: "22px",
  background: "#222",
  border: "1px solid #333",
  fontSize: "14px",
};