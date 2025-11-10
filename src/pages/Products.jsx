import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { subscribeProducts, addOrIncrementCartItem } from "../services/db";
import { observeAuth } from "../services/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Products() {
  const [produtos, setProdutos] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [loadingAdd, setLoadingAdd] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsub = subscribeProducts(items => setProdutos(items));
    return () => unsub();
  }, []);

  React.useEffect(() => {
    const unsubAuth = observeAuth(u => setUser(u));
    return () => unsubAuth();
  }, []);

  const handleAdd = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      setLoadingAdd(true);
      await addOrIncrementCartItem(user.uid, product);
    } catch (err) {
      console.error("Erro ao adicionar ao carrinho:", err);
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <div className="container">
      <Header />
      <div className="product-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12
        }}
      >
        {produtos.map(p => (
          <ProductCard key={p.id} product={p} onAdd={handleAdd} />
        ))}
      </div>
      <Footer />
    </div>
  );
}