import React from "react";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card" style={{display:"flex", gap:16, alignItems:"center"}}>
      <img src={product.Img || product.img || product.image} alt={product.Nome || product.nome} style={{width:96, height:96, objectFit:"cover", borderRadius:8}} />
      <div style={{flex:1}}>
        <h4 style={{margin:"0 0 8px 0"}}>{product.Nome || product.nome || "Produto"}</h4>
        <p style={{margin:"0 0 12px 0", color:"#555"}}>{product.Descricao || product.descricao || ""}</p>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <strong>R$ {(product.Valor || product.valor || product.price || 0).toFixed(2)}</strong>
          <button className="btn" onClick={() => onAdd(product)} aria-label={`Adicionar ${product.Nome || product.nome}`}>+</button>
        </div>
      </div>
    </div>
  );
}