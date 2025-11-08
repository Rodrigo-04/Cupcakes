// src/pages/Cart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartItem from "../components/CartItem";
import { subscribeCart, updateCartItemQuantity, removeCartItem } from "../services/db";
import { observeAuth } from "../services/auth";

export default function Cart() {
  const [user, setUser] = React.useState(null);
  const [cart, setCart] = React.useState({ IdCarrinho: "", Itens: [] });
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsubAuth = observeAuth(u => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubAuth();
  }, []);

  React.useEffect(() => {
    if (!user) {
      setCart({ IdCarrinho: "", Itens: [] });
      return;
    }
    const unsub = subscribeCart(user.uid, (c) => {
      setCart(c);
    });
    return () => unsub();
  }, [user]);

  const handleChangeQty = async (idProduto, novaQtd) => {
    if (!user) return navigate("/login");
    try {
      await updateCartItemQuantity(user.uid, idProduto, novaQtd);
    } catch (err) {
      console.error("Erro ao atualizar quantidade:", err);
    }
  };

  const handleRemove = async (idProduto) => {
    if (!user) return navigate("/login");
    try {
      await removeCartItem(user.uid, idProduto);
    } catch (err) {
      console.error("Erro ao remover item:", err);
    }
  };

  const total = (cart.Itens || []).reduce((acc, it) => acc + (Number(it.Valor || 0) * (it.quantidade || 0)), 0);

  return (
    <div className="container">
      <Header />
      <div style={{display:"grid", gap:12}}>
        <h3>Seu Carrinho</h3>

        {(!cart.Itens || cart.Itens.length === 0) && (
          <div className="card">Seu carrinho está vazio.</div>
        )}

        <div style={{display:"grid", gap:12}}>
          {cart.Itens && cart.Itens.map(item => (
            <CartItem key={item.idProduto} item={item} onChangeQty={handleChangeQty} onRemove={handleRemove} />
          ))}
        </div>

        <div className="card" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div>
            <strong>Total:</strong> R$ {total.toFixed(2)}
          </div>
          <div>
            <button className="btn" onClick={() => navigate("/pedido")} disabled={(cart.Itens || []).length === 0}>Finalizar Pedido</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


// import { useEffect, useState } from "react";
// import { addDoc, collection } from "firebase/firestore";
// import { db } from "../../services/firebaseConfig"
// import { useNavigate } from "react-router-dom";

// export default function Carrinho() {
//     const [carrinho, setCarrinho] = useState([]);
//     const [entrega, setEntrega] = useState("");
//     const [pagamento, setPagamento] = useState("");
//     const navigate = useNavigate();

// useEffect(() => {
//     const itens = JSON.parse(localStorage.getItem("carrinho")) || [];
//     setCarrinho(itens);
// }, []);

// const total = carrinho.reduce((acc, item) => acc + item.preco, 0);

// const confirmarPedido = async () => {
//     if(!entrega || !pagamento) {
//         alert("Escolha entrega e pagamento antes de confirmar.");
//         return;
//     }
    
//     try {
//         const pedido = {
//             itens: carrinho,
//             entrega,
//             pagamento,
//             total,
//             status: "Pedido recebido",
//             data: new Date().toISOString(),
//         };

//         const docRef = await addDoc(collection( db, "pedidos"), pedido);
//         localStorage.removeItem("carrinho");
//         navigate(`/status/${docRef.id}`);
//     } catch (error) {
//         console.error("Erro ao salvar pedido: ", error);
//         alert("Erro ao salvar pedido. Tente Novamente.");
//     }
// };
// return (
//     <div className="container">
//         <h2>Carrinho</h2>
//         {carrinho.length === 0?(
//             <p>Seu carrinho está vazio</p>
//         ):(
//             <>
//                 <ul>
//                     {carrinho.map((item, index) => (
//                         <li key={index}>
//                             {item.nome} - R$ {item.preco.toFixed(2)}
//                         </li>
//                     ))}
//                 </ul>

//                 <h3> Total: R$ {total.toFixed(2)}</h3>

//                 <div>
//                     <label>Entrega:</label>
//                     <select value={entrega} onChange={(e) => setEntrega(e.target.value)}>
//                         <optition value="">Selecione...</optition>
//                         <optition value="retirada">Retirar no local...</optition>
//                         <optition value="entrega">Entrega em domicílio</optition>
//                     </select>
//                 </div>

//                 <div>
//                     <label>Pagamento:</label>
//                     <select value={pagamento} onChange={(e) => setPagamento(e.target.value)}>
//                         <optition value="">Selecione...</optition>
//                         <optition value="pix">Pix</optition>
//                         <optition value="cartao">Cartão</optition>
//                     </select>
//                 </div>

//                 <button onClick={confirmarPedido}>Confirmar Pedido</button>
//             </>
//         )}
//     </div>
// )
// }