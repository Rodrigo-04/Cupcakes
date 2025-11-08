
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
      {/* <div style={{display:"grid", gap:12}}>
        <h3>Produtos</h3>
        {produtos.length === 0 && <div className="card">Nenhum produto cadastrado.</div>}
        <div style={{display:"grid", gap:12}}>
          {produtos.map(p => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
        </div>
      </div> */}
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


// import { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../services/firebaseConfig";

// export default function Produtos() {
//     const [produtos, setProdutos] = useState([]);

//     useEffect(() => {
//         const fetchData = async() => {
//             const data = await getDocs(collection(db, "produto"));
//             setProdutos(data.docs.map((doc)=>({id: doc.id, ...doc.data()})));
//         };
//         fetchData();
//     }, []);

//     const adicionarAoCarrinho = (produto) => {
//         localStorage.setItem("carrinho", JSON.stringify([...Produtos(JSON.parse(localStorage.getItem("carrinho")) || [] ),produto]));
//     }

//     return (
//         <div className="container">
//             <h2>Produtos</h2>
//             <div className="row">
//                 {produtos.map((p) => (
//                     <div key={p.id} className="col-md-3 mb-4">
//                         <div className="card">
//                             <img src={p.imagem} className="card-img-top" alt="p.nome" />
//                             <div className="card-body text-center">
//                                 <h5>{p.nome}</h5>
//                                 <p>{p.descricao}</p>
//                                 <p><strong>{p.preco}</strong></p>
//                                 <button className="btn btn-warning" onClick={() => adicionarAoCarrinho(p)}>Adicionar ao carrinho</button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }