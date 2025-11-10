import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StepperStatus from "../components/StepperStatus";
import {
  subscribeOrder,
  subscribeActiveOrders,
  confirmOrderReceived
} from "../services/db";
import { observeAuth } from "../services/auth";

const STEPS = ["Pedido recebido", "Em preparo", "Pronto", "A caminho", "Entregue"];

export default function StatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState(false);

  React.useEffect(() => {
    const unsubAuth = observeAuth(u => setUser(u));
    return () => unsubAuth();
  }, []);

  React.useEffect(() => {
    if (id) {
      const unsub = subscribeOrder(id, o => {
        setOrder(o);
        setLoading(false);
        if (o?.Status === "Entregue") {
        localStorage.removeItem("pedidoAtivo");
      }
      });
      return () => unsub();
    }
  }, [id]);

React.useEffect(() => {
  if (!id && user) {
    const idLocal = localStorage.getItem("pedidoAtivo");
    if (idLocal) {
      navigate(`/status/${idLocal}`, { replace: true });
    } else {
      const unsub = subscribeActiveOrders(user.uid, orders => {
        if (orders.length > 0) {
          setOrder(orders[0]);
        }
        setLoading(false);
      });
      return () => unsub();
    }
  }
}, [id, user, navigate]);


  const calcEta = (ts) => {
    if (!ts) return null;
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return new Date(date.getTime() + 2 * 86400000);
  };

  const handleConfirmReceipt = async () => {
    if (!user || !order) return;
    setUpdating(true);
    try {
      await confirmOrderReceived(order.id, user.uid);
    } catch (err) {
      console.error("Erro ao confirmar recebimento", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Header />
        <div className="card">Carregando status do pedido...</div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container">
        <Header />
        <div className="card">Nenhum pedido ativo encontrado.</div>
        <Footer />
      </div>
    );
  }

  if (!order && !loading) {
  return (
    <div className="container">
      <Header />
      <div className="card">Nenhum pedido ativo encontrado.</div>
      <Footer />
    </div>
  );
}

  const eta = calcEta(order.data);
  const etaFormatted = eta ? eta.toLocaleString() : "—";
  const currentStatus = order.Status || "Pedido recebido";

  return (
    <div className="container">
      <Header />
      <div style={{ display: "grid", gap: 12 }}>
        <h3>Status do Pedido</h3>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Pedido: {order.id}</div>
              <div style={{ color: "#555", marginTop: 6 }}>
                Status atual: <strong>{currentStatus}</strong>
              </div>
              <div style={{ color: "#555", marginTop: 6 }}>
                Previsão de entrega: <strong>{etaFormatted}</strong>
              </div>
            </div>
            <div>
              <div style={{ textAlign: "right" }}>Total</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>
                R$ {(order.Total || 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <StepperStatus steps={STEPS} current={currentStatus} />
        </div>

        <div className="card" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <div>
            <button
              className="btn"
              onClick={handleConfirmReceipt}
              disabled={currentStatus !== "Entregue" || updating}
            >
              {updating ? "Confirmando..." : "Confirmar recebimento"}
            </button>
          </div>
        </div>

        <div className="card">
          <h4>Detalhes do pedido</h4>
          {order.Itens && order.Itens.map(it => (
            <div key={it.idProduto} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{it.Nome}</div>
                <div style={{ fontSize: 13, color: "#666" }}>Qtd: {it.quantidade}</div>
              </div>
              <div>R$ {(Number(it.Valor || 0) * (it.quantidade || 0)).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}