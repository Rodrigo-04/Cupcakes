import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import StatusPage from "./pages/Status";
import About from "./pages/About";
import { observeAuth } from "./services/auth";

function App() {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => observeAuth(u => setUser(u)), []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastrar" element={<Register />} />
      <Route path="/carrinho" element={user ? <Cart /> : <Navigate to="/login" replace />} />
      <Route path="/pedido" element={user ? <Checkout /> : <Navigate to="/login" replace />} />
      <Route path="/status/:id" element={<StatusPage />} />
      <Route path="/status" element={<StatusPage />} />
      <Route
        path="/produtos"
        element={user ? <Products user={user} /> : <Navigate to="/login" replace />}
      />
      <Route path="/sobre" element={<About />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;