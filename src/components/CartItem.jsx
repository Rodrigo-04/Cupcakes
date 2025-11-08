import React from "react";

export default function CartItem({ item, onChangeQty, onRemove }) {
  const { Nome, Img, Valor, quantidade, idProduto } = item;
  const subtotal = (Number(Valor) || 0) * (quantidade || 0);

  return (
    <div className="card" style={{display:"flex", gap:16, alignItems:"center"}}>
      <img src={Img} alt={Nome} style={{width:96, height:96, objectFit:"cover", borderRadius:8}} />
      <div style={{flex:1}}>
        <h4 style={{margin:"0 0 8px 0"}}>{Nome}</h4>
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <button className="btn" onClick={() => onChangeQty(idProduto, (quantidade || 1) - 1)}>-</button>
          <div style={{minWidth:36, textAlign:"center"}}>{quantidade}</div>
          <button className="btn" onClick={() => onChangeQty(idProduto, (quantidade || 0) + 1)}>+</button>
          <div style={{marginLeft:16, fontWeight:700}}>R$ {subtotal.toFixed(2)}</div>
        </div>
      </div>
      <div>
        <button className="btn secondary" onClick={() => onRemove(idProduto)}>Remover</button>
      </div>
    </div>
  );
}