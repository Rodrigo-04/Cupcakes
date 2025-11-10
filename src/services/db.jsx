import { db } from "./firebaseConfig";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
  onSnapshot,
  addDoc,
  serverTimestamp,
  where,
  orderBy,
  query,
  runTransaction
} from "firebase/firestore";

// Salva os dados do cliente na coleção Cliente usando o uid do auth como IdCliente
export const saveClient = async (uid, { nome, cpf, email }) => {
  const ref = doc(db, "Cliente", uid);
  await setDoc(ref, {
    IdCliente: uid,
    Nome: nome,
    CPF: cpf,
    Email: email
  });
};

// Recupera documento do cliente por uid
export const getClient = async (uid) => {
  const ref = doc(db, "Cliente", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

// BUSCAR produtos (você já tem getProducts, mas com onSnapshot melhor)
export const subscribeProducts = (callback) => {
  const colRef = collection(db, "Produto");
  return onSnapshot(colRef, snapshot => {
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(items);
  });
};

// Recupera carrinho do usuário (documento id = uid)
export const getCartOnce = async (uid) => {
  const ref = doc(db, "Carrinho", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : { IdCarrinho: uid, Itens: [] };
};

// Observador em tempo real do carrinho
export const subscribeCart = (uid, callback) => {
  const ref = doc(db, "Carrinho", uid);
  return onSnapshot(ref, snap => {
    if (!snap.exists()) return callback({ IdCarrinho: uid, Itens: [] });
    callback(snap.data());
  });
};

// Cria/atualiza carrinho inteiro
export const setCart = async (uid, cartObj) => {
  await setDoc(doc(db, "Carrinho", uid), cartObj);
};

// Função para adicionar 1 item (ou incrementar) no carrinho do usuário
export const addOrIncrementCartItem = async (uid, product) => {
  const ref = doc(db, "Carrinho", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const cart = {
      IdCarrinho: uid,
      Itens: [
        { idProduto: product.id, Nome: product.Nome || product.nome || product.Name, Valor: product.Valor || product.valor || product.price, Img: product.Img || product.img || product.image, quantidade: 1 }
      ]
    };
    await setDoc(ref, cart);
    return;
  }

  const cart = snap.data();
  const idx = cart.Itens.findIndex(i => i.idProduto === product.id);
  if (idx === -1) {
    cart.Itens.push({ idProduto: product.id, Nome: product.Nome || product.nome, Valor: product.Valor || product.valor, Img: product.Img || product.img, quantidade: 1 });
  } else {
    cart.Itens[idx].quantidade = (cart.Itens[idx].quantidade || 0) + 1;
  }
  await setDoc(ref, cart);
};

// Atualizar quantidade para um item (novaQuantidade pode ser 0 para remover)
export const updateCartItemQuantity = async (uid, idProduto, novaQuantidade) => {
  const ref = doc(db, "Carrinho", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const cart = snap.data();
  const itens = cart.Itens || [];
  const idx = itens.findIndex(i => i.idProduto === idProduto);
  if (idx === -1) return;
  if (novaQuantidade <= 0) {
    itens.splice(idx, 1);
  } else {
    itens[idx].quantidade = novaQuantidade;
  }
  cart.Itens = itens;
  await setDoc(ref, cart);
};

// remover item diretamente
export const removeCartItem = async (uid, idProduto) => {
  await updateCartItemQuantity(uid, idProduto, 0);
};

export const createOrderAndClearCart = async ({ uid, enderecoInfo, pagamentoInfo }) => {
  if (!uid) throw new Error("UID necessário");

  const cartRef = doc(db, "Carrinho", uid);
  const pedidosCol = collection(db, "Pedido");
  const newOrderRef = doc(pedidosCol);

  // transação: lê o carrinho, cria pedido e zera o carrinho
  const result = await runTransaction(db, async (transaction) => {
    const cartSnap = await transaction.get(cartRef);
    const cart = cartSnap.exists() ? cartSnap.data() : { IdCarrinho: uid, Itens: [] };

    if (!cart || !(cart.Itens || []).length) {
      throw new Error("Carrinho vazio");
    }

    const total = (cart.Itens || []).reduce((s, it) => s + (Number(it.Valor || 0) * (it.quantidade || 0)), 0);

    const payload = {
      IdPedido: newOrderRef.id,
      IdCarrinho: cart.IdCarrinho || uid,
      IdCliente: uid,
      Itens: cart.Itens,
      Total: total,
      tipoEndereco: enderecoInfo.tipoEndereco,
      Endereco: enderecoInfo.endereco || null,
      tipoPagamento: pagamentoInfo.tipoPagamento,
      Pagamento: [pagamentoInfo.pagamento],
      Status: "Pedido recebido",
      data: serverTimestamp()
    };

    transaction.set(newOrderRef, payload);

    transaction.set(cartRef, { IdCarrinho: uid, Itens: [] });

    return { id: newOrderRef.id, payload };
  });
  try {
    const clientRef = doc(db, "Cliente", uid);
    const clientSnap = await getDoc(clientRef);
    if (clientSnap.exists()) {
      const { endereco } = enderecoInfo;
      const pagamento = pagamentoInfo.pagamento;
      await import("firebase/firestore").then(({ updateDoc, arrayUnion }) =>
        updateDoc(clientRef, {
          enderecos: endereco ? arrayUnion(endereco) : undefined,
          pagamentos: pagamento ? arrayUnion(pagamento) : undefined
        }).catch(()=>{})
      );
    }
  } catch (err) {
    console.warn("Não foi possível atualizar histórico do cliente:", err);
  }

  return result;
};

// Assina um pedido por id em tempo real
export const subscribeOrder = (orderId, callback) => {
  const ref = doc(db, "Pedido", orderId);
  return onSnapshot(ref, snap => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
};

// Atualiza o status do pedido
export const updateOrderStatus = async (orderId, novoStatus) => {
  const ref = doc(db, "Pedido", orderId);
  await updateDoc(ref, {
    Status: novoStatus,
    updatedAt: serverTimestamp()
  });
};

// Marca pedido como confirmado pelo cliente (ex: recebimento)
export const confirmOrderReceived = async (orderId, userId) => {
  const ref = doc(db, "Pedido", orderId);
  await updateDoc(ref, {
    Status: "Entregue",
    entregueConfirmadoPor: userId || null,
    entregueConfirmadoEm: serverTimestamp()
  });
};

// busca ativa única de pedidos do usuário que não foram entregues
export const getActiveOrdersOnce = async (uid) => {
  const q = query(
    collection(db, "Pedido"),
    where("IdCliente", "==", uid),
    where("Status", "!=", "Entregue"),
    orderBy("data", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// subscribe real-time de pedidos ativos do usuário
export const subscribeActiveOrders = (uid, callback) => {
  const q = query(
    collection(db, "Pedido"),
    where("IdCliente", "==", uid),
    where("Status", "!=", "Entregue"),
    orderBy("data", "desc")
  );
  return onSnapshot(q, snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(items);
  });
};

