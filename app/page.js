import Link from "next/link";
import Header from "./components/Header";

export default function HomePage() {
  return (
    <>
      <Header />

      <main
        style={{
          minHeight: "calc(100vh - 80px)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <img
          src="/house-mix-family.jpg"
          alt="House Mix"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(5px)",
            transform: "scale(1.05)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.48)",
          }}
        />

        <section
          style={{
            position: "relative",
            zIndex: 2,
            minHeight: "calc(100vh - 80px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "white",
            padding: "40px 20px",
            boxSizing: "border-box",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(50px, 8vw, 90px)",
                margin: 0,
                fontWeight: "800",
              }}
            >
              House Mix
            </h1>

            <p
              style={{
                fontSize: "clamp(20px, 3vw, 30px)",
                marginTop: "20px",
                marginBottom: "35px",
              }}
            >
              Все для затишку вашого дому
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/catalog"
                style={{
                  display: "inline-block",
                  padding: "15px 30px",
                  background: "white",
                  color: "#111",
                  borderRadius: "30px",
                  textDecoration: "none",
                  fontSize: "17px",
                  fontWeight: "700",
                }}
              >
                Перейти до каталогу
              </Link>

              <Link
                href="/order-status"
                style={{
                  display: "inline-block",
                  padding: "15px 30px",
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.7)",
                  borderRadius: "30px",
                  textDecoration: "none",
                  fontSize: "17px",
                  fontWeight: "700",
                }}
              >
                📦 Статус замовлення
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
