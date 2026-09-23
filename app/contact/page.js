export default function ContactPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7f5",
        padding: "60px 20px 80px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "24px",
          padding: "45px",
          boxShadow: "0 8px 30px rgba(0,0,0,.08)",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            margin: "0 0 30px",
          }}
        >
          Контакти
        </h1>

        <p style={{ fontSize: "18px", color: "#555" }}>
          Маєте запитання щодо товару або замовлення?
          Зв'яжіться з нами — ми із задоволенням допоможемо.
        </p>

        <div
          style={{
            display: "grid",
            gap: "18px",
            marginTop: "35px",
          }}
        >
          <div>
            <h3>📞 Телефон</h3>
            <p>Ваш номер телефону</p>
          </div>

          <div>
            <h3>📧 Email</h3>
            <a
              href="mailto:housemix.shopua@gmail.com"
              style={{
                color: "#222",
                textDecoration: "none",
                fontSize: "17px",
              }}
            >
              housemix.shopua@gmail.com
            </a>
          </div>

          <div>
            <h3>📱 Telegram</h3>
            <a
              href="https://t.me/house_mix_tg"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#222",
                textDecoration: "none",
                fontSize: "17px",
              }}
            >
              @house_mix_tg
            </a>
          </div>

          <div>
            <h3>📸 Instagram</h3>
            <a
              href="https://www.instagram.com/_house.mix_/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#222",
                textDecoration: "none",
                fontSize: "17px",
              }}
            >
              @_house.mix_
            </a>
          </div>

          <div>
            <h3>📍 Місто</h3>
            <p>Кропивницький</p>
          </div>

          <div>
            <h3>🚚 Доставка</h3>
            <p>Нова пошта або самовивіз.</p>
          </div>

          <div>
            <h3>💳 Оплата</h3>
            <p>Оплата при отриманні.</p>
          </div>
        </div>

        <p
          style={{
            marginTop: "40px",
            fontSize: "20px",
            fontWeight: "700",
          }}
        >
          House Mix — завжди на зв'язку ❤️
        </p>
      </div>
    </main>
  );
}