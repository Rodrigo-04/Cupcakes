// src/pages/Checkout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { observeAuth } from "../services/auth";
import { subscribeCart, getCartOnce } from "../services/db";
import { createOrderAndClearCart } from "../services/db";
import QRCode from "qrcode";

export default function Checkout(){
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [cart, setCart] = React.useState({ IdCarrinho: "", Itens: [] });
  const [loading, setLoading] = React.useState(false);

  // endereco
  const [tipoEndereco, setTipoEndereco] = React.useState("retirar");
  const [logradouro, setLogradouro] = React.useState("");
  const [numero, setNumero] = React.useState("");
  const [apto, setApto] = React.useState("");

  // pagamento
  const [tipoPagamento, setTipoPagamento] = React.useState("pix");
  const [cardNome, setCardNome] = React.useState("");
  const [cardNumero, setCardNumero] = React.useState("");
  const [cardValidade, setCardValidade] = React.useState("");
  const [cardCvv, setCardCvv] = React.useState("");

  const [pixQrDataUrl, setPixQrDataUrl] = React.useState(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const unsubAuth = observeAuth(u => setUser(u));
    return () => unsubAuth();
  }, []);

  React.useEffect(() => {
    if (!user) return;
    const unsub = subscribeCart(user.uid, c => setCart(c || { IdCarrinho: user.uid, Itens: [] }));
    return () => unsub();
  }, [user]);

  const total = (cart.Itens || []).reduce((s, it) => s + (Number(it.Valor || 0) * (it.quantidade || 0)), 0);

  const validateCard = () => {
    if (cardNome.trim().length < 2) return "Nome do cartão inválido";
    const digits = cardNumero.replace(/\D/g, "");
    if (digits.length < 12) return "Número do cartão inválido";
    if (!/^\d{2}\/\d{2}$/.test(cardValidade)) return "Validade inválida (MM/AA)";
    if (cardCvv.replace(/\D/g, "").length < 3) return "Código de segurança inválido";
    return null;
  };

  const handleGeneratePix = async () => {
    // Gerar um payload fictício para o QR (apenas estudo)
    const pixPayload = `cupcakes-cruzeiro|user:${user?.uid}|total:${total.toFixed(2)}|ts:${Date.now()}`;
    try {
      const url = await QRCode.toDataURL(pixPayload, { width: 250 });
      setPixQrDataUrl(url);
      return { pixPayload, qrcodeData: url };
    } catch (err) {
      console.error("Erro gerando QR:", err);
      throw err;
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) return navigate("/login");
    if (!cart || !(cart.Itens || []).length) {
      setError("Seu carrinho está vazio.");
      return;
    }

    if (tipoEndereco === "entrega") {
      if (!logradouro || !numero) {
        setError("Preencha logradouro e número para entrega.");
        return;
      }
    }

    let pagamentoPayload = null;
    setLoading(true);
    try {
      if (tipoPagamento === "pix") {
        const pixObj = await handleGeneratePix();
        pagamentoPayload = {
          qrcodeData: pixObj.qrcodeData,
          chaveFicticia: "000.000.000-00" // apenas exemplo
        };
      } else {
        const v = validateCard();
        if (v) { setError(v); setLoading(false); return; }
        // Não envie cartão não criptografado em produção; aqui é para estudo
        pagamentoPayload = {
          nomeTitular: cardNome,
          numeroMasked: cardNumero.replace(/\d(?=\d{4})/g, "*"),
          validade: cardValidade,
          codMasked: "***"
        };
      }

      const enderecoObj = tipoEndereco === "entrega" ? { logradouro, num: numero, apto: apto || null } : null;

      // const res = await createOrder({
      //   uid: user.uid,
      //   cart,
      //   enderecoInfo: { tipoEndereco, endereco: enderecoObj },
      //   pagamentoInfo: { tipoPagamento, pagamento: pagamentoPayload }
      // });

      const res = await createOrderAndClearCart({
        uid: user.uid,
        enderecoInfo: { tipoEndereco, endereco: enderecoObj },
        pagamentoInfo: { tipoPagamento, pagamento: pagamentoPayload }
      });

      localStorage.setItem("pedidoAtivo", res.id); // salva o ID

      // redireciona para status do pedido — você pode passar id como param
      navigate(`/status/${res.id}`, { replace: true });
    } catch (err) {
      console.error("Erro ao criar pedido:", err);
      setError("Erro ao processar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Header />
      <div style={{display:"grid", gap:12}}>
        <h3>Finalizar Pedido</h3>

        <div className="card">
          <h4>Resumo do pedido</h4>
          {cart.Itens && cart.Itens.map(it => (
            <div key={it.idProduto} style={{display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #eee"}}>
              <div>
                <div style={{fontWeight:700}}>{it.Nome}</div>
                <div style={{color:"#555"}}>Qtd: {it.quantidade}</div>
              </div>
              <div>R$ {(Number(it.Valor || 0) * (it.quantidade || 0)).toFixed(2)}</div>
            </div>
          ))}
          <div style={{display:"flex", justifyContent:"space-between", marginTop:8}}>
            <strong>Total</strong>
            <strong>R$ {total.toFixed(2)}</strong>
          </div>
        </div>

        <form className="card" onSubmit={handleConfirm}>
          <h4>Entrega</h4>
          <div style={{display:"flex", gap:12}}>
            <label><input type="radio" name="end" value="retirar" checked={tipoEndereco==="retirar"} onChange={()=>setTipoEndereco("retirar")} /> Retirar na loja</label>
            <label><input type="radio" name="end" value="entrega" checked={tipoEndereco==="entrega"} onChange={()=>setTipoEndereco("entrega")} /> Entrega</label>
          </div>

          {tipoEndereco === "entrega" && (
            <>
              <input className="input" placeholder="Logradouro" value={logradouro} onChange={e=>setLogradouro(e.target.value)} />
              <input className="input" placeholder="Número" value={numero} onChange={e=>setNumero(e.target.value)} />
              <input className="input" placeholder="Apto (opcional)" value={apto} onChange={e=>setApto(e.target.value)} />
            </>
          )}

          <h4>Pagamento</h4>
          <div style={{display:"grid", gap:12}}>
            <label><input type="radio" name="pay" value="pix" checked={tipoPagamento==="pix"} onChange={()=>setTipoPagamento("pix")} /> Pix</label>
            <label><input type="radio" name="pay" value="cartao" checked={tipoPagamento==="cartao"} onChange={()=>setTipoPagamento("cartao")} /> Cartão</label>
          </div>

          {tipoPagamento === "pix" && (
            <div style={{marginTop:8}}>
              <p>Ao confirmar será gerado um QR Code fictício para pagamento via Pix.</p>
              {pixQrDataUrl && <img src={pixQrDataUrl} alt="QR Pix" style={{width:180}} />}
            </div>
          )}

          {tipoPagamento === "cartao" && (
            <>
              <input className="input" placeholder="Nome no cartão" value={cardNome} onChange={e=>setCardNome(e.target.value)} />
              <input className="input" placeholder="Número do cartão" value={cardNumero} inputMode="numeric" maxLength={16} onChange={e => {const onlyNums = e.target.value.replace(/\D/g, ""); setCardNumero(onlyNums);}} />
              <input className="input" placeholder="Validade MM/AA" value={cardValidade} inputMode="numeric" maxLength={5} onChange={e => {let value = e.target.value.replace(/\D/g, "").slice(0, 4); if (value.length >= 3) {value = value.slice(0, 2) + "/" + value.slice(2);} setCardValidade(value);}} />
              <input className="input" placeholder="Código de segurança" value={cardCvv} inputMode="numeric"  maxLength={3} onChange={e => {const onlyNums = e.target.value.replace(/\D/g, ""); setCardCvv(onlyNums);}} />
            </>
          )}

          {error && <div className="error">{error}</div>}

          <div style={{display:"flex", justifyContent:"space-between", marginTop:12}}>
            <button type="button" className="btn secondary" onClick={()=>navigate("/carrinho")}>Voltar ao Carrinho</button>
            <button className="btn" type="submit" disabled={loading}>{loading ? "Processando..." : "Confirmar Pedido"}</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../services/firebaseConfig";

// export default function StatusPedido() {
//     const { id } = useParams();
//     const [pedido, setPedido] = useState(null);

//     useEffect(() => {
//         const fetchPedido = async () => {
//             const ref = doc(db, "pedidos", id);
//             const snap = await getDoc(ref);
//             if (snap.exists()) setPedido(snap.data());
//         };
//         fetchPedido();
//     }, [id]);

//     if (!pedido) return <p>Carregando pedidos...</p>;

//     return (
//         <div className="container">
//             <h2>Status do Pedido</h2>
//             <p><strong>Status: </strong>{pedido.status}</p>
//             <p><strong>Entrega: </strong>{pedido.entrega}</p>
//             <p><strong>Pagamento: </strong>{pedido.pagamento}</p>
//             <h3>Itens:</h3>
//             <ul>
//                 {pedido.itens.map((item, i) => (
//                     <li key={i}>{item.nome} - R$ {item.preco.toFixed(2)}</li>
//                 ))}
//             </ul>
//             <h3>Total: R$ {pedido.total.toFixed(2)}</h3>
//         </div>
//     );
// }