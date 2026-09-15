"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "../../components/Header";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!params?.id) return;

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const found = Array.isArray(data)
          ? data.find((item) => String(item.id) === String(params.id))
          : null;

        setProduct(found || null);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [params?.id]);

  function addToCart() {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("houseMixCart") || "[]");
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("houseMixCart", JSON.stringify(cart));
    setMessage("Товар додано в кошик!");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="loading">
          <h2>Завантаження товару...</h2>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="not-found">
          <h1>Товар не знайдено</h1>
          <Link href="/catalog">← Повернутися до каталогу</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      {message && <div className="message">{message}</div>}

      <main className="page">
        <div className="container">

          <Link href="/catalog" className="back">
            ← Назад до каталогу
          </Link>

          <div className="product-card">

            <div className="photo">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                />
              ) : (
                <span>Фото відсутнє</span>
              )}
            </div>

            <div className="info">

              <h1>{product.name}</h1>

              <div className="price">
                {product.price} грн
              </div>

              <div className="description">
                {product.description || "Опис товару поки відсутній."}
              </div>

              <button onClick={addToCart}>
                🛒 Додати в кошик
              </button>

            </div>

          </div>

        </div>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: calc(100vh - 80px);
          background: #f5f5f5;
          padding: 30px 20px 60px;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .back {
          display: inline-block;
          margin-bottom: 25px;
          color: #111;
          text-decoration: none;
          font-size: 17px;
        }

        .product-card {
          background: white;
          border-radius: 18px;
          padding: 30px;
          display: flex;
          gap: 40px;
        }

        .photo {
          width: 50%;
          height: 500px;
          flex-shrink: 0;
          background: #fafafa;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .photo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .info {
          flex: 1;
          min-width: 0;
        }

        .info h1 {
          font-size: 34px;
          line-height: 1.25;
          margin: 0 0 15px;
          word-break: break-word;
        }

        .price {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 25px;
        }

        .description {
          font-size: 17px;
          line-height: 1.7;
          white-space: pre-wrap;
          word-break: break-word;
          margin-bottom: 30px;
        }

        .info button {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 10px;
          background: #111;
          color: white;
          font-size: 18px;
          cursor: pointer;
        }

        .message {
          position: fixed;
          top: 95px;
          left: 20px;
          right: 20px;
          max-width: 400px;
          margin: auto;
          background: #111;
          color: white;
          padding: 15px 20px;
          border-radius: 10px;
          text-align: center;
          z-index: 100;
        }

        .loading,
        .not-found {
          min-height: calc(100vh - 80px);
          background: #f5f5f5;
          padding: 60px 20px;
          text-align: center;
        }

        @media (max-width: 700px) {

          .page {
            padding: 20px 10px 40px;
          }

          .back {
            margin-left: 5px;
            margin-bottom: 18px;
          }

          .product-card {
            display: block;
            padding: 12px;
            border-radius: 18px;
          }

          .photo {
            width: 100%;
            height: 320px;
            padding: 10px;
            margin-bottom: 20px;
          }

          .info {
            width: 100%;
          }

          .info h1 {
            font-size: 25px;
            line-height: 1.25;
            margin-bottom: 12px;
          }

          .price {
            font-size: 24px;
            margin-bottom: 18px;
          }

          .description {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 22px;
          }

          .info button {
            padding: 16px;
            font-size: 17px;
          }
        }
      `}</style>
    </>
  );
}