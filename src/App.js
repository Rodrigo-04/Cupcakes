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
      {/* <Route path="/status/:id" element={user ? <StatusPage /> : <Navigate to="/login" replace />} /> */}
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

// import { BrowserRouter, Route, Routes } from "react-router-dom";
// // import Home from "./view/pages/Home";
// import Login from "./view/pages/Login";
// import Cadastro from "./view/pages/Cadastro";
// import Produtos from "./view/pages/Produtos";
// import Carrinho from "./view/pages/Carrinho";
// import Sobre from "./view/pages/Sobre";
// import StatusPedido from "./view/pages/StatusPedido";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// //import "bootstrap/dist/css/bootstrap.min.css";

// export default function App() {
//   return(
//     <BrowserRouter>
//     <Header />
//     <div className="cointainer mt-4">
//       <Routes>
//         {/* <Route path="/" element={<Home />} /> */}
//         <Route path="/" element={<Login />} />
//         <Route path="/cadastro" element={<Cadastro />} />
//         <Route path="/produtos" element={<Produtos />} />
//         <Route path="/carrinho" element={<Carrinho />} />
//         <Route path="/status/:id" element={<StatusPedido />} />
//         <Route path="/sobre" element={<Sobre />} />
//       </Routes>
//     </div>
//     <Footer />
//     </BrowserRouter>
//   );
// }


// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
