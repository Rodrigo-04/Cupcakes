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
  const [, setLoading] = React.useState(true);
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