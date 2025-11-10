import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginWithEmail } from "../services/auth";
import { FaInstagram, FaFacebook } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Preencha email e senha.");
      return;
    }
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate("/produtos");
    } catch (err) {
      setError("Credenciais inválidas. Verifique email/senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ padding: 32, textAlign: "center" }}>
        <header>
        <img
          src="/logo-cupcake.svg"
          alt="logo"
          style={{ height: 120, marginBottom: 16 }}
        />

        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
          <span style={{ color: "#EC9DA7" }}>Cupcakes</span>{" "}
          <span style={{ color: "#425A86" }}>Cruzeiro</span>
        </div>
        </header>

        <h3 style={{ marginBottom: 16, color: "#425A86" }}>Entrar</h3>
        <form className="form" onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="error">{error}</div>}
          <button className="btn" style={{ marginLeft: "16px" }} type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p style={{ marginTop: 16 }}>
          Não tem conta? <Link to="/cadastrar">Cadastre-se</Link>
        </p>
      
      <footer
        className="footer card"
        style={{
          marginTop: 32,
          padding: 16,
          textAlign: "center",
          fontSize: 13,
          color: "#666"
        }}
      >
        <div>Cupcakes Cruzeiro © {new Date().getFullYear()}</div>
        <div>Feito com carinho!</div>
        <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 16 }}>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#EC9DA7", fontSize: 24 }}
          >
            <FaInstagram />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#425A86", fontSize: 24 }}
          >
            <FaFacebook />
          </a>
        </div>
      </footer>
      </div>
    </div>
  );
}