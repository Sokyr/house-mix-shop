"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header
      style={{
        width: "100%",
        minHeight: "80px",
        background: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 5%",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 1000,
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      <Link
        href="/"
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "28px",
          fontWeight: "700",
          whiteSpace: "nowrap",
        }}
      >
        House Mix
      </Link>

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        <Link href="/" style={navStyle}>
          🏠 Головна
        </Link>

        <Link href="/catalog" style={navStyle}>
          Каталог
        </Link>

        <Link href="/cart" style={navStyle}>
          🛒 Кошик
        </Link>

        <Link href="/order-status" style={navStyle}>
          📦 Моє замовлення
        </Link>
      </nav>
    </header>
  );
}

const navStyle = {
  color: "white",
  textDecoration: "none",
  padding: "10px 15px",
  borderRadius: "22px",
  background: "#222",
  border: "1px solid #333",
  fontSize: "14px",
};
