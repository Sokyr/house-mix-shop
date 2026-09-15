"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [cityRef, setCityRef] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);

  const [address, setAddress] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [warehouseLoading, setWarehouseLoading] = useState(false);

  const [delivery, setDelivery] = useState("Нова пошта");
  const [payment, setPayment] = useState("Оплата онлайн");

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("houseMixCart");

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (err) {
      console.error("Помилка завантаження кошика:", err);
    }
  }, []);

  useEffect(() => {
    if (delivery !== "Нова пошта") return;

    const query = city.trim();

    if (query.length < 2 || cityRef) {
      setCitySuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setCityLoading(true);

      try {
        const response = await fetch("/api/nova-poshta", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "cities",
            query,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || "Не вдалося знайти місто."
          );
        }

        setCitySuggestions(
          Array.isArray(data.data) ? data.data : []
        );
      } catch (err) {
        console.error(err);
        setCitySuggestions([]);
      } finally {
        setCityLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [city, cityRef, delivery]);

  async function selectCity(item) {
    const selectedCity =
      item.Description ||
      item.Present ||
      item.DescriptionRu ||
      "";

    const selectedRef = item.Ref || "";

    setCity(selectedCity);
    setCityRef(selectedRef);
    setCitySuggestions([]);
    setWarehouse("");
    setAddress("");
    setWarehouseOptions([]);

    if (!selectedRef) return;

    setWarehouseLoading(true);
    setError("");

    try {
      const response = await fetch("/api/nova-poshta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "warehouses",
          cityRef: selectedRef,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Не вдалося завантажити відділення."
        );
      }

      setWarehouseOptions(
        Array.isArray(data.data) ? data.data : []
      );
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Не вдалося завантажити відділення."
      );
    } finally {
      setWarehouseLoading(false);
    }
  }

  function selectWarehouse(value) {
    setWarehouse(value);

    const item = warehouseOptions.find(
      (warehouseItem) =>
        (warehouseItem.Ref ||
          warehouseItem.SiteKey ||
          "") === value
    );

    if (!item) return;

    const shortAddress =
      item.ShortAddress ||
      item.ShortAddressRu ||
      "";

    const description =
      item.Description || "";

    setAddress(
      shortAddress &&
        description &&
        shortAddress !== description
        ? `${description} — ${shortAddress}`
        : description || shortAddress
    );
  }

  function handleCityChange(value) {
    setCity(value);
    setCityRef("");
    setWarehouse("");
    setWarehouseOptions([]);
    setAddress("");
    setError("");
  }

  function handleDeliveryChange(value) {
    setDelivery(value);
    setCitySuggestions([]);
    setCityRef("");
    setWarehouse("");
    setWarehouseOptions([]);
    setAddress("");
    setError("");
  }

  const total = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;

    return sum + price * quantity;
  }, 0);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Кошик порожній.");
      return;
    }

    if (!name.trim()) {
      setError("Введіть ваше ім'я.");
      return;
    }

    if (!phone.trim()) {
      setError("Введіть номер телефону.");
      return;
    }

    if (!city.trim()) {
      setError("Введіть місто.");
      return;
    }

    if (delivery === "Нова пошта" && !warehouse) {
      setError(
        "Оберіть відділення або поштомат Нової пошти."
      );
      return;
    }

    if (!address.trim()) {
      setError(
        "Оберіть відділення або введіть адресу."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          address: address.trim(),
          delivery,
          payment,
          total,
          products: cart,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Не вдалося оформити замовлення."
        );
      }

      const id =
        data?.id ||
        data?.orderId ||
        data?.order?.id ||
        "невідомий";

      setOrderId(String(id));
      setSuccess(true);

      localStorage.removeItem("houseMixCart");
      setCart([]);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Не вдалося оформити замовлення."
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="page">
        <div className="success">
          <div className="check">✓</div>

          <h1>Замовлення успішно оформлено!</h1>

          <p>
            Дякуємо за ваше замовлення. Ми зв'яжемося
            з вами найближчим часом.
          </p>

          <div className="order">
            Номер замовлення:{" "}
            <strong>#{orderId}</strong>
          </div>

          <div className="buttons">
            <Link
              href="/catalog"
              className="button"
            >
              Перейти до каталогу
            </Link>

            <Link
              href="/"
              className="button light"
            >
              На головну
            </Link>
          </div>
        </div>

        <style jsx>{`
          .page {
            min-height: 100vh;
            background: #f5f5f5;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .success {
            width: 100%;
            max-width: 550px;
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-sizing: border-box;
          }

          .check {
            width: 70px;
            height: 70px;
            margin: 0 auto 20px;
            border-radius: 50%;
            background: #e8f7e8;
            color: #2d8a3d;
            font-size: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          h1 {
            margin-bottom: 15px;
          }

          p {
            color: #666;
            line-height: 1.6;
          }

          .order {
            margin-top: 25px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 10px;
          }

          .buttons {
            display: flex;
            gap: 10px;
            margin-top: 25px;
          }

          .button {
            flex: 1;
            padding: 14px;
            border-radius: 10px;
            background: #111;
            color: white;
            text-decoration: none;
            font-weight: 600;
          }

          .light {
            background: #e9e9e9;
            color: #111;
          }

          @media (max-width: 600px) {
            .success {
              padding: 25px;
            }

            .buttons {
              flex-direction: column;
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <Link href="/cart" className="back">
          ← Повернутися до кошика
        </Link>

        <h1>Оформлення замовлення</h1>

        {cart.length === 0 ? (
          <div className="empty">
            <h2>Кошик порожній</h2>

            <p>
              Додайте товари до кошика, щоб оформити
              замовлення.
            </p>

            <Link
              href="/catalog"
              className="button"
            >
              Перейти до каталогу
            </Link>
          </div>
        ) : (
          <div className="layout">
            <form
              onSubmit={handleSubmit}
              className="form"
            >
              <h2>Ваші дані</h2>

              <label>
                Ім'я
                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Ваше ім'я"
                />
              </label>

              <label>
                Телефон
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="099 123 45 67"
                />
              </label>

              <label className="field">
                Місто
                <input
                  type="text"
                  value={city}
                  onChange={(e) =>
                    handleCityChange(e.target.value)
                  }
                  placeholder="Почніть вводити місто"
                  autoComplete="off"
                />

                {delivery === "Нова пошта" &&
                  (cityLoading ||
                    citySuggestions.length > 0) && (
                    <div className="suggestions">
                      {cityLoading && (
                        <div className="suggestion muted">
                          Пошук міста...
                        </div>
                      )}

                      {!cityLoading &&
                        citySuggestions.map(
                          (item, index) => (
                            <button
                              type="button"
                              className="suggestion"
                              key={
                                item.Ref ||
                                `${item.Description}-${index}`
                              }
                              onClick={() =>
                                selectCity(item)
                              }
                            >
                              {item.Description ||
                                item.Present ||
                                item.DescriptionRu}
                            </button>
                          )
                        )}
                    </div>
                  )}
              </label>

              <label>
                Доставка
                <select
                  value={delivery}
                  onChange={(e) =>
                    handleDeliveryChange(
                      e.target.value
                    )
                  }
                >
                  <option value="Нова пошта">
                    Нова пошта
                  </option>
                  <option value="Укрпошта">
                    Укрпошта
                  </option>
                  <option value="Самовивіз">
                    Самовивіз
                  </option>
                </select>
              </label>

              {delivery === "Нова пошта" ? (
                <label>
                  Відділення або поштомат

                  <select
                    value={warehouse}
                    onChange={(e) =>
                      selectWarehouse(
                        e.target.value
                      )
                    }
                    disabled={
                      !cityRef || warehouseLoading
                    }
                  >
                    <option value="">
                      {warehouseLoading
                        ? "Завантаження..."
                        : cityRef
                          ? "Оберіть відділення або поштомат"
                          : "Спочатку оберіть місто"}
                    </option>

                    {warehouseOptions.map((item) => {
                      const value =
                        item.Ref ||
                        item.SiteKey ||
                        "";

                      const number = item.Number
                        ? `№${item.Number} — `
                        : "";

                      return (
                        <option
                          key={value}
                          value={value}
                        >
                          {number}
                          {item.Description ||
                            item.ShortAddress ||
                            ""}
                        </option>
                      );
                    })}
                  </select>
                </label>
              ) : (
                <label>
                  Адреса
                  <input
                    type="text"
                    value={address}
                    onChange={(e) =>
                      setAddress(
                        e.target.value
                      )
                    }
                    placeholder="Введіть адресу"
                  />
                </label>
              )}

              {delivery === "Нова пошта" &&
                address && (
                  <div className="selectedAddress">
                    <span>
                      Обране місце доставки:
                    </span>

                    <strong>{address}</strong>
                  </div>
                )}

              <div className="payments">
                <h3>Спосіб оплати</h3>

                <label className="radio">
                  <input
                    type="radio"
                    name="payment"
                    value="Оплата онлайн"
                    checked={
                      payment === "Оплата онлайн"
                    }
                    onChange={(e) =>
                      setPayment(e.target.value)
                    }
                  />
                  Оплата онлайн
                </label>

                <label className="radio">
                  <input
                    type="radio"
                    name="payment"
                    value="Оплата при отриманні"
                    checked={
                      payment ===
                      "Оплата при отриманні"
                    }
                    onChange={(e) =>
                      setPayment(e.target.value)
                    }
                  />
                  Оплата при отриманні
                </label>
              </div>

              {error && (
                <div className="error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="submit"
                disabled={loading}
              >
                {loading
                  ? "Оформлення..."
                  : "Оформити замовлення"}
              </button>
            </form>

            <aside className="summary">
              <h2>Ваше замовлення</h2>

              {cart.map((item, index) => {
                const price =
                  Number(item.price) || 0;

                const quantity =
                  Number(item.quantity) || 1;

                return (
                  <div
                    className="product"
                    key={
                      item.id ||
                      `${item.name}-${index}`
                    }
                  >
                    <div>
                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        {quantity} шт. ×{" "}
                        {price} грн
                      </span>
                    </div>

                    <strong>
                      {price * quantity} грн
                    </strong>
                  </div>
                );
              })}

              <div className="total">
                <span>Разом:</span>
                <strong>{total} грн</strong>
              </div>
            </aside>
          </div>
        )}
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f5f5f5;
          padding: 30px 20px 60px;
          box-sizing: border-box;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .back {
          display: inline-block;
          margin-bottom: 20px;
          color: #333;
          text-decoration: none;
        }

        h1 {
          font-size: 36px;
          margin-bottom: 30px;
        }

        .layout {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 25px;
        }

        .form,
        .summary,
        .empty {
          background: white;
          padding: 25px;
          border-radius: 18px;
          box-sizing: border-box;
        }

        label {
          display: block;
          margin-bottom: 18px;
          font-weight: 600;
          position: relative;
        }

        input,
        select {
          display: block;
          width: 100%;
          margin-top: 8px;
          padding: 13px;
          border: 1px solid #ddd;
          border-radius: 10px;
          box-sizing: border-box;
          font-size: 16px;
          background: white;
        }

        input:focus,
        select:focus {
          outline: none;
          border-color: #111;
        }

        .suggestions {
          position: absolute;
          top: calc(100% - 10px);
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 10px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.12);
          overflow: hidden;
          z-index: 20;
        }

        .suggestion {
          width: 100%;
          display: block;
          border: 0;
          border-bottom: 1px solid #eee;
          background: white;
          padding: 12px 14px;
          text-align: left;
          cursor: pointer;
          font-size: 15px;
        }

        .suggestion:hover {
          background: #f5f5f5;
        }

        .suggestion.muted {
          cursor: default;
          color: #777;
        }

        .selectedAddress {
          margin: -5px 0 20px;
          padding: 12px 14px;
          background: #f5f5f5;
          border-radius: 10px;
          color: #666;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .payments {
          margin-top: 25px;
        }

        .radio {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
        }

        .radio input {
          width: auto;
          margin: 0;
        }

        .error {
          margin: 15px 0;
          padding: 12px;
          border-radius: 10px;
          background: #ffe7e7;
          color: #a00000;
        }

        .submit,
        .empty .button {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 10px;
          background: #111;
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: block;
          text-align: center;
          box-sizing: border-box;
        }

        .submit:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .product {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        }

        .product div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .product span {
          color: #777;
          font-size: 14px;
        }

        .total {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #111;
          font-size: 20px;
        }

        .empty {
          text-align: center;
        }

        @media (max-width: 800px) {
          .layout {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 30px;
          }
        }
      `}</style>
    </main>
  );
}
