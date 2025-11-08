// src/pages/Register.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerWithEmail } from "../services/auth";
import { saveClient } from "../services/db";
import { FaInstagram, FaFacebook } from "react-icons/fa";

export default function Register(){
  const [nome, setNome] = React.useState("");
  const [cpf, setCpf] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [confirmSenha, setConfirmSenha] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const senhaValida = (s) => {
    if (!s) return false;
    if (s.length <= 3) return false;
    const temNumero = /[0-9]/.test(s);
    const temLetra = /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(s);
    return temNumero && temLetra;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nome || !cpf || !email || !senha || !confirmSenha) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!senhaValida(senha)) {
      setError("A senha deve ter mais de 3 caracteres, conter ao menos 1 número e 1 letra.");
      return;
    }

    if (senha !== confirmSenha) {
      setError("A confirmação de senha não confere.");
      return;
    }

    setLoading(true);
    try{
      const userCred = await registerWithEmail(email, senha);
      const uid = userCred.user.uid;
      await saveClient(uid, { nome, cpf, email });
      navigate("/produtos");
    }catch(err){
      console.error("Erro ao cadastrar:", err);
      // Mensagem genérica para não vazar detalhes sensíveis
      setError("Erro ao cadastrar. Verifique os dados e tente novamente.");
    }finally{
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
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: "#425A86" }}>
          <span style={{ color: "#EC9DA7" }}>Cupcakes</span>{" "}
          <span style={{ color: "#425A86" }}>Cruzeiro</span>
        </div>
      </header>

        <main>
          <h3>Cadastre-se</h3>
          <form className="form" onSubmit={handleSubmit}>
            <input className="input" placeholder="Nome" value={nome} onChange={e=>setNome(e.target.value)} />
            <input className="input" placeholder="CPF" value={cpf} inputMode="numeric" maxLength={11} onChange={e => {const onlyNums = e.target.value.replace(/\D/g, ""); setCpf(onlyNums);}} />
            <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="input" type="password" placeholder="Senha" value={senha} onChange={e=>setSenha(e.target.value)} />
            <input className="input" type="password" placeholder="Confirmar Senha" value={confirmSenha} onChange={e=>setConfirmSenha(e.target.value)} />
            {error && <div className="error">{error}</div>}
            <button className="btn" type="submit" disabled={loading}>{loading ? "Cadastrando..." : "Cadastrar"}</button>
          </form>

          <p style={{textAlign:"center", marginTop:16}}>
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </main>
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

// import { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "../../services/firebaseConfig";
// import { doc, setDoc } from "firebase/firestore";

// export default function Cadastro() {
//   const [nome, setNome] = useState("");
//   const [cpf, setCpf] = useState("");
//   const [email, setEmail] = useState("");
//   const [senha, setSenha] = useState("");
//   const [confirmarSenha, setConfirmarSenha] = useState("");

//   const handleCadastro = async (e) => {
//     e.preventDefault();

//     // ✅ Validação de senhas
//     if (senha !== confirmarSenha) {
//       alert("As senhas não coincidem!");
//       return;
//     }

//     try {
//       // 1️⃣ Cria usuário no Firebase Auth
//       const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
//       const user = userCredential.user;

//       // 2️⃣ Salva dados do usuário no Firestore (coleção 'clientes')
//       await setDoc(doc(db, "clientes", user.uid), {
//         idCliente: user.uid,  // vincula o UID do Auth
//         nome,
//         cpf,
//         email,
//         senha                // ⚠️ em produção, não armazene senha em texto puro
//       });

//       alert("Usuário cadastrado com sucesso!");
//       // opcional: redirecionar para login
//       // navigate("/login");
//     } catch (error) {
//       alert("Erro: " + error.message);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Cadastro</h2>
//       <form onSubmit={handleCadastro}>
//         <input
//           className="form-control mb-2"
//           type="text"
//           placeholder="Nome completo"
//           value={nome}
//           onChange={(e) => setNome(e.target.value)}
//           required
//         />
//         <input
//           className="form-control mb-2"
//           type="text"
//           placeholder="CPF"
//           value={cpf}
//           onChange={(e) => setCpf(e.target.value)}
//           required
//         />
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
//         <input
//           className="form-control mb-2"
//           type="password"
//           placeholder="Confirmar Senha"
//           value={confirmarSenha}
//           onChange={(e) => setConfirmarSenha(e.target.value)}
//           required
//         />
//         <button className="btn btn-primary w-100" type="submit">
//           Cadastrar
//         </button>
//       </form>
//     </div>
//   );
// }



// import { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../services/firebaseConfig"

// export default function Cadastro() {
//     const [email, setEmail] = useState("");
//     const [senha, setSenha] = useState("");

//     const handleCadastro = async (e) => {
//         e.preventDefault();
//         try {
//             await createUserWithEmailAndPassword(auth, email, senha);
//             alert ("Usuário cadastrado com sucesso");
//         } catch (error) {
//             alert("Erro: " + error.message);
//         }
//     };

//     return (
//         <div className="Container">
//             <h2>Cadastro</h2>
//             <form onSubmit={handleCadastro}>
//                 <input className="form-control mb-2" type="email" placeholder="E-mail" onChange={(e) => setEmail(e.targer.value)} />
//                 <input className="form-control mb-2" type="password" placeholder="Senha" onChange={(e) => setSenha(e.targer.value)} />
//                 <button className="btn btn-primary w-100"type="submit">Cadastrar</button>
//             </form>
//         </div>
//     );
// }