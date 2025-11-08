import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, observeAuth } from "../services/auth";
import { subscribeCart, subscribeActiveOrders } from "../services/db";
import { FaBoxOpen, FaShoppingCart, FaClipboardList, FaInfoCircle, FaSignOutAlt } from "react-icons/fa";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [count, setCount] = React.useState(0);
  const [activeOrders, setActiveOrders] = React.useState([]);

  React.useEffect(() => {
    const unsubAuth = observeAuth(u => setUser(u));
    return () => unsubAuth();
  }, []);

  React.useEffect(() => {
    if (!user) {
      setCount(0);
      setActiveOrders([]);
      return;
    }

    const unsubCart = subscribeCart(user.uid, cart => {
      const total = (cart.Itens || []).reduce((s, it) => s + (it.quantidade || 0), 0);
      setCount(total);
    });

    const unsubOrders = subscribeActiveOrders(user.uid, orders => {
      setActiveOrders(orders);
    });

    return () => {
      unsubCart();
      unsubOrders();
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("pedidoAtivo");
    navigate("/login");
  };

  const pedidoId = localStorage.getItem("pedidoAtivo");

  return (
    <header className="header card" style={{ marginBottom: 16 }}>
      <div className="brand" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src="/logo-cupcake.svg"
          alt="logo"
          style={{ height: 80, width: "auto", objectFit: "contain" }}
        />
        <div style={{ fontSize: 24, fontWeight: 700 }}>
          <span style={{ color: "#EC9DA7" }}>Cupcakes</span>{" "}
          <span style={{ color: "#425A86" }}>Cruzeiro</span>
        </div>
      </div>

      <nav
        className="nav"
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: 12
        }}
      >
        <Link to="/produtos" className="nav-link">
          <FaBoxOpen style={{ marginRight: 6 }} />
          Produtos
        </Link>
        <Link to="/carrinho" className="nav-link">
          <FaShoppingCart style={{ marginRight: 6 }} />
          Carrinho{count > 0 && ` (${count})`}
        </Link>
        <Link to={pedidoId ? `/status/${pedidoId}` : "/status"} className="nav-link">
          <FaClipboardList style={{ marginRight: 6 }} />
          Status{pedidoId ? " (1 ativo)" : ""}
        </Link>
        <Link to="/sobre" className="nav-link">
          <FaInfoCircle style={{ marginRight: 6 }} />
          Sobre
        </Link>
        <button
          className="btn"
          onClick={handleLogout}
          style={{
            marginLeft: "auto",
            backgroundColor: "#425A86",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </nav>
    </header>
  );
}

// // src/components/Header.jsx
// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { logout, observeAuth } from "../services/auth";
// import { subscribeCart, subscribeActiveOrders } from "../services/db";

// export default function Header() {
//   const navigate = useNavigate();
//   const [user, setUser] = React.useState(null);
//   const [count, setCount] = React.useState(0);
//   const [activeOrders, setActiveOrders] = React.useState([]);

//   React.useEffect(() => {
//     const unsubAuth = observeAuth(u => setUser(u));
//     return () => unsubAuth();
//   }, []);

//   React.useEffect(() => {
//     if (!user) {
//       setCount(0);
//       setActiveOrders([]);
//       return;
//     }

//     const unsubCart = subscribeCart(user.uid, cart => {
//       const total = (cart.Itens || []).reduce((s, it) => s + (it.quantidade || 0), 0);
//       setCount(total);
//     });

//     const unsubOrders = subscribeActiveOrders(user.uid, orders => {
//       setActiveOrders(orders);
//     });

//     return () => {
//       unsubCart();
//       unsubOrders();
//     };
//   }, [user]);

//   const handleLogout = async () => {
//     await logout();
//     localStorage.removeItem("pedidoAtivo");
//     navigate("/login");
//   };

//   const pedidoId = localStorage.getItem("pedidoAtivo");

//   return (
//     <header className="header card" style={{ marginBottom: 16 }}>
//       <div className="brand" style={{ display: "flex", alignItems: "center", gap: 12 }}>
//         <img
//           src="/logo-cupcake.svg"
//           alt="logo"
//           style={{
//             height: 80, // aumentado suavemente
//             width: "auto",
//             maxWidth: "100%",
//             objectFit: "contain"
//           }}
//         />
//         <div style={{ fontSize: 24, fontWeight: 700 }}>
//           <span style={{ color: "#EC9DA7" }}>Cupcakes</span>{" "}
//           <span style={{ color: "#425A86" }}>Cruzeiro</span>
//         </div>
//       </div>
//       <nav className="nav">
//         <Link to="/produtos">Produtos</Link>
//         <Link to="/carrinho">Carrinho{count > 0 && ` (${count})`}</Link>
//         <Link to={pedidoId ? `/status/${pedidoId}` : "/status"}>
//           Status{pedidoId ? " (1 ativo)" : ""}
//         </Link>
//         <Link to="/sobre">Sobre</Link>
//         <button className="btn" onClick={handleLogout}>Logout</button>
//       </nav>
//     </header>
//   );
// }

// // src/components/Header.jsx
// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { logout, observeAuth } from "../services/auth";
// import { subscribeCart, subscribeActiveOrders } from "../services/db";

// export default function Header() {
//   const navigate = useNavigate();
//   const [user, setUser] = React.useState(null);
//   const [count, setCount] = React.useState(0);
//   const [activeOrders, setActiveOrders] = React.useState([]);

//   React.useEffect(() => {
//     const unsubAuth = observeAuth(u => setUser(u));
//     return () => unsubAuth();
//   }, []);

//   React.useEffect(() => {
//     if (!user) {
//       setCount(0);
//       setActiveOrders([]);
//       return;
//     }

//     const unsubCart = subscribeCart(user.uid, cart => {
//       const total = (cart.Itens || []).reduce((s, it) => s + (it.quantidade || 0), 0);
//       setCount(total);
//     });

//     const unsubOrders = subscribeActiveOrders(user.uid, orders => {
//       setActiveOrders(orders);
//     });

//     return () => {
//       unsubCart();
//       unsubOrders();
//     };
//   }, [user]);

//   const handleLogout = async () => {
//     await logout();
//     localStorage.removeItem("pedidoAtivo"); // limpa pedido ativo
//     navigate("/login");
//   };

//   const pedidoId = localStorage.getItem("pedidoAtivo");

//   return (
//     <header className="header card" style={{ marginBottom: 16 }}>
//       <div className="brand" style={{ display: "flex", alignItems: "center", gap: 12 }}>
//         <img src="/logo-cupcake.svg" alt="logo" style={{ height: 64 }} /> {/* aumentada */}
//         <div style={{ fontSize: 24, fontWeight: 700 }}>
//           <span style={{ color: "#EC9DA7" }}>Cupcakes</span>{" "}
//           <span style={{ color: "#425A86" }}>Cruzeiro</span>
//         </div>
//       </div>
//       <nav className="nav">
//         <Link to="/produtos">Produtos</Link>
//         <Link to="/carrinho">Carrinho{count > 0 && ` (${count})`}</Link>
//         <Link to={pedidoId ? `/status/${pedidoId}` : "/status"}>
//           Status{pedidoId ? " (1 ativo)" : ""}
//         </Link>
//         <Link to="/sobre">Sobre</Link>
//         <button className="btn" onClick={handleLogout}>Logout</button>
//       </nav>
//     </header>
//   );
// }

// // src/components/Header.jsx
// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { logout, observeAuth } from "../services/auth";
// import { subscribeCart, subscribeActiveOrders } from "../services/db";

// export default function Header() {
//   const navigate = useNavigate();
//   const [user, setUser] = React.useState(null);
//   const [count, setCount] = React.useState(0);
//   const [activeOrders, setActiveOrders] = React.useState([]);

//   React.useEffect(() => {
//     const unsubAuth = observeAuth(u => setUser(u));
//     return () => unsubAuth();
//   }, []);

//   React.useEffect(() => {
//     if (!user) {
//       setCount(0);
//       setActiveOrders([]);
//       return;
//     }

//     const unsubCart = subscribeCart(user.uid, cart => {
//       const c = (cart.Itens || []).reduce((s, it) => s + (it.quantidade || 0), 0);
//       setCount(c);
//     });

//     const unsubOrders = subscribeActiveOrders(user.uid, orders => {
//       setActiveOrders(orders);
//     });

//     return () => {
//       unsubCart();
//       unsubOrders();
//     };
//   }, [user]);

//   const handleLogout = async () => {
//     await logout();
//     navigate("/login");
//   };

//   return (
//     <header className="header card" style={{marginBottom:16}}>
//       <div className="brand">
//         <img src="/logo-cupcake.png" alt="logo" />
//         <div><strong>Cupcakes Cruzeiro</strong></div>
//       </div>
//       <nav className="nav">
//         <Link to="/produtos">Produtos</Link>
//         <Link to="/carrinho">Carrinho{count > 0 && ` (${count})`}</Link>
//         <Link to={activeOrders.length ? `/status/${activeOrders[0].id}` : "/status"}>
//           Status{activeOrders.length ? " (1 ativo)" : ""}
//         </Link>
//         {/* <Link to={activeOrders.length ? `/status/:${activeOrders[0].id}` : "/status"}>
//           Status{activeOrders.length ? " (1 pedido ativo)" : ""}
//         </Link> */}
//         <Link to="/sobre">Sobre</Link>
//         <button className="btn" onClick={handleLogout}>Logout</button>
//       </nav>
//     </header>
//   );
// }
