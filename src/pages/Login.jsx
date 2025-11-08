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
        {/* Logo centralizada e ampliada */}
        <img
          src="/logo-cupcake.svg"
          alt="logo"
          style={{ height: 120, marginBottom: 16 }}
        />

        {/* Título estilizado */}
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
          <span style={{ color: "#EC9DA7" }}>Cupcakes</span>{" "}
          <span style={{ color: "#425A86" }}>Cruzeiro</span>
        </div>
        </header>

        {/* Formulário */}
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
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p style={{ marginTop: 16 }}>
          Não tem conta? <Link to="/cadastrar">Cadastre-se</Link>
        </p>
      

      {/* Footer com ícones */}
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

// import React from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { loginWithEmail } from "../services/auth";
// import { FaInstagram, FaFacebook } from "react-icons/fa";

// export default function Login(){
//   const [email, setEmail] = React.useState("");
//   const [password, setPassword] = React.useState("");
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     if(!email || !password){ setError("Preencha email e senha."); return; }
//     setLoading(true);
//     try{
//       await loginWithEmail(email, password);
//       navigate("/produtos");
//     }catch(err){
//       setError("Credenciais inválidas. Verifique email/senha.");
//     }finally{
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <div className="card">
//         <header className="header">
//           <div className="brand" style={{ display: "flex", alignItems: "center", gap: 12 }}>
//         <img src="/logo-cupcake.svg" alt="logo" style={{ height: 40 }} />
//         <div style={{ fontSize: 24, fontWeight: 700 }}>
//           <span style={{ color: "#EC9DA7" }}>Cupcakes</span>{" "}
//           <span style={{ color: "#425A86" }}>Cruzeiro</span>
//         </div>
//       </div>
//         </header>

//         <main>
//           <h3>Entrar</h3>
//           <form className="form" onSubmit={handleSubmit}>
//             <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
//             <input className="input" type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} />
//             {error && <div className="error">{error}</div>}
//             <button className="btn" type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
//           </form>

//           <p style={{textAlign:"center", marginTop:16}}>
//             Não tem conta? <Link to="/cadastrar">Cadastre-se</Link>
//           </p>
//         </main>
//       </div>

//       <footer className="footer card" style={{ marginTop: 32, padding: 16, textAlign: "center", fontSize: 13, color: "#666" }}>
//       <div>Cupcakes Cruzeiro © {new Date().getFullYear()}</div>
//       <div>Feito com carinho!</div>
//       <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 16 }}>
//               <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#EC9DA7", fontSize: 20 }}>
//                 <FaInstagram />
//               </a>
//               <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#425A86", fontSize: 20 }}>
//                 <FaFacebook />
//               </a>
//             </div>
//     </footer>
//     </div>
//   );
// }

// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useState } from "react";
// import { auth, db } from "../../services/firebaseConfig";
// import { doc, getDoc } from "firebase/firestore";
// import { useNavigate, Link } from "react-router-dom";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [senha, setSenha] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, senha);
//       const user = userCredential.user;

//       // Busca dados do usuário no Firestore
//       const docRef = doc(db, "clientes", user.uid);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         const cliente = docSnap.data();
//         localStorage.setItem("usuario", JSON.stringify(cliente));
//         alert(`Login realizado com sucesso! Bem-vindo, ${cliente.nome}`);
//         navigate("/"); // Redireciona para home
//       } else {
//         alert("Usuário logado, mas dados do cliente não encontrados no banco!");
//       }
//     } catch (error) {
//       alert("Erro: " + error.message);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           className="form-control mb-2"
//           type="email"
//           placeholder="E-mail"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           className="form-control mb-2"
//           type="password"
//           placeholder="Senha"
//           value={senha}
//           onChange={(e) => setSenha(e.target.value)}
//           required
//         />
//         <button className="btn btn-success w-100 mb-2" type="submit">
//           Entrar
//         </button>
//       </form>

//       <p className="text-center mt-2">
//         Não tem uma conta?{" "}
//         <Link to="/cadastro" className="text-primary">
//           Cadastre-se
//         </Link>
//       </p>
//     </div>
//   );
// }



// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useState } from "react";
// import { auth } from "../../services/firebaseConfig"


// export default function Login() {
//     const [email, setEmail] = useState("");
//     const [senha,setSenha] = useState("");

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             await signInWithEmailAndPassword(auth, email, senha);
//             alert("Login realizado com sucesso!");
//         } catch (error) {
//             alert("Erro: " + error.message);
//         }
//     };
//     return (
//         <div className="container">
//             <h2>Login</h2>
//             <form onSubmit={handleLogin}>
//                 <input className="form-control mb-2" type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} />
//                 <input className="form-control mb-2" type="password" placeholder="Senha" onChange={(e) => setSenha(e.target.value)} />
//                 <button className="btn btn-sucess w-100" type="submit">Entrar</button>
//             </form>
//         </div>
//     );
// }