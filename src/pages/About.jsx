// src/pages/About.jsx
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="container">
      <Header />
      <div className="card" style={{ padding: 24 }}>
        <h2>Sobre a Cupcakes Cruzeiro</h2>
        <p>
          Somos apaixonados por confeitaria artesanal e por criar experiências doces inesquecíveis.
          Fundada em São Paulo, SP, nossa loja nasceu do sonho de levar cupcakes frescos, criativos e deliciosos para todos os momentos especiais.
        </p>
        <p>
          Começamos como um negócio familiar em 2020, oferencendo nossos doces na rua e com encomendas pelo WhatsApp e Instagram.
          Em 2023 conseguimos nosso próprio espaço, onde temos nossa loja, permitindo que nossos clientes desfrutem de nossos deliciosos cupcakes, em um ambiente agradavel.
        </p>
        <p>
          Agora nos modernizamos para que nossos clientes possam aproveitar os cupcakes sem sair de casa, com nosso Delivery.
        </p>
        <p>
          Trabalhamos com ingredientes selecionados, receitas exclusivas e muito carinho em cada fornada.
          Além dos nossos sabores clássicos, oferecemos opções veganas, sem glúten e personalizadas para eventos.
        </p>
        <p>
          Agradecemos por fazer parte da nossa história. Esperamos adoçar o seu dia!
        </p>
        <h4>Contato</h4>
        <p>Email: atendimento@cupcakescruzeiro.com.br</p>
        <p>WhatsApp: (12) 99999-9999</p>
        <p>Endereço: Rua das Delícias, 123 - São Paulo, SP</p>
      </div>
      <Footer />
    </div>
  );
}