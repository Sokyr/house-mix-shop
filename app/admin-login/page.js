"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function login(e) {
    e.preventDefault();

    if (password === "HouseMix2026") {
      localStorage.setItem("houseMixAdmin", "true");
      router.push("/admin");
    } else {
      setError("Неправильний пароль");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          padding: "35px",
          borderRadius: "18px",
          boxShadow: "0 5px 25px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          House Mix
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginTop: "10px",
          }}
        >
          Вхід в адмін-панель
        </p>

        <form onSubmit={login}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              marginTop: "25px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />

          {error && (
            <p
              style={{
                color: "#d32f2f",
                marginTop: "10px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "14px",
              border: "none",
              borderRadius: "8px",
              background: "#111",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Увійти
          </button>
        </form>
      </div>
    </main>
  );
}