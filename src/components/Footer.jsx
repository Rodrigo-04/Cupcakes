import React from "react";
import { FaInstagram, FaFacebook } from "react-icons/fa";


export default function Footer() {
  return (
    <footer className="footer card" style={{ marginTop: 32, padding: 16, textAlign: "center", fontSize: 13, color: "#666" }}>
      <div>Cupcakes Cruzeiro © {new Date().getFullYear()}</div>
      <div>Feito com carinho!</div>
      <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 16 }}>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#EC9DA7", fontSize: 20 }}>
          <FaInstagram />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#425A86", fontSize: 20 }}>
          <FaFacebook />
        </a>
      </div>
    </footer>
  );
}