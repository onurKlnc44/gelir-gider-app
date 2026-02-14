import { useState, useEffect } from "react";

// İkonlar
const IconTrendingUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
);
const IconTrendingDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>
);
const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
);
const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [editingId, setEditingId] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    if (editingId) {
      const updatedTransactions = transactions.map((item) =>
        item.id === editingId 
          ? { ...item, title, amount: parseFloat(amount), type } 
          : item
      );
      setTransactions(updatedTransactions);
      setEditingId(null);
    } else {
      const newTransaction = {
        id: Date.now(),
        title,
        amount: parseFloat(amount),
        type,
        date: new Date().toLocaleDateString("tr-TR")
      };
      setTransactions([newTransaction, ...transactions]);
    }

    setTitle("");
    setAmount("");
    setType("income");
  };

  const deleteTransaction = (id) => {
    const confirmDelete = window.confirm("Bu işlemi silmek istediğinize emin misiniz?");
    if (confirmDelete) {
      if (editingId === id) setEditingId(null);
      setTransactions(transactions.filter(item => item.id !== id));
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setAmount(item.amount);
    setType(item.type);
    if(windowWidth < 968) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const incomeTotal = transactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expenseTotal = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = incomeTotal - expenseTotal;

  const formatMoney = (val) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY"
    }).format(val);

  const isMobile = windowWidth < 968;

  return (
    <div style={{ 
      background: "#0f172a", 
      minHeight: "100vh", 
      color: "white", 
      fontFamily: "Inter, sans-serif", 
      padding: isMobile ? "15px" : "30px",
      display: "flex", // Merkeze almak için
      justifyContent: "center",
      boxSizing: "border-box" 
    }}>
      <div style={{ 
        display: "grid", 
        // Masaüstünde sol 400px, sağ ise kalan tüm alan (1fr)
        gridTemplateColumns: isMobile ? "1fr" : "400px 1fr", 
        gap: isMobile ? "20px" : "30px", 
        width: "100%",
        maxWidth: "1600px" // Geniş ekranlarda çok yayılmasın diye limit
      }}>

        {/* SOL PANEL */}
        <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <header style={{ textAlign: isMobile ? "center" : "left" }}>
            <h1 style={{ 
              fontSize: isMobile ? "1.8rem" : "2.5rem", 
              fontWeight: "800", 
              background: "linear-gradient(to right, #4ade80, #3b82f6)", 
              WebkitBackgroundClip: "text", 
              WebkitTextFillColor: "transparent",
              margin: "0 0 5px 0"
            }}>
              Cüzdanım
            </h1>
            <p style={{ color: "#94a3b8", margin: 0 }}>Finansal durumunuzu yönetin</p>
          </header>

          <div style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", padding: "25px", borderRadius: "24px" }}>
            <small>Toplam Bakiye</small>
            <h2 style={{ fontSize: "2rem", fontWeight: "bold", margin: "5px 0" }}>{formatMoney(totalBalance)}</h2>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", flexWrap: "wrap", gap: "10px" }}>
              <span style={{ color: "#4ade80", fontSize: "0.9rem" }}>Gelir: {formatMoney(incomeTotal)}</span>
              <span style={{ color: "#f87171", fontSize: "0.9rem" }}>Gider: {formatMoney(expenseTotal)}</span>
            </div>
          </div>

          <div style={{ background: "#1e293b", padding: "20px", borderRadius: "20px", border: editingId ? "1px solid #3b82f6" : "1px solid #334155" }}>
            <h4 style={{ color: editingId ? "#3b82f6" : "white", marginTop: 0 }}>
              {editingId ? "İşlemi Güncelle" : "İşlem Ekle"}
            </h4>

            <form onSubmit={handleSubmit}>
              <input
                placeholder="İşlem adı..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", marginBottom: "12px", padding: "12px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "white", boxSizing: "border-box" }}
              />

              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <input
                  type="number"
                  placeholder="Tutar"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "white", boxSizing: "border-box", minWidth: 0 }}
                />

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{ width: "100px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "white", cursor: "pointer" }}
                >
                  <option value="income">Gelir</option>
                  <option value="expense">Gider</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "none",
                  background: editingId ? "#f59e0b" : "#3b82f6",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "0.3s"
                }}
              >
                {editingId ? "Değişiklikleri Kaydet" : "Listeye Ekle"}
              </button>
              
              {editingId && (
                <button 
                  type="button"
                  onClick={() => { setEditingId(null); setTitle(""); setAmount(""); }}
                  style={{ width: "100%", marginTop: "10px", background: "transparent", color: "#64748b", border: "none", cursor: "pointer" }}
                >
                  Vazgeç
                </button>
              )}
            </form>
          </div>
        </section>

        {/* SAĞ PANEL - ARTIK BOŞLUĞU TAMAMLAYAN KISIM BURASI */}
        <section style={{ 
          background: "#1e293b", 
          borderRadius: "24px", 
          border: "1px solid #334155", 
          padding: "25px", 
          // Masaüstünde ekranın kalan yüksekliğini kullanır
          height: isMobile ? "auto" : "calc(100vh - 60px)", 
          overflowY: "auto",
          display: "flex",
          flexDirection: "column"
        }}>
          <h3 style={{ marginBottom: "20px", marginTop: 0 }}>Son Hareketler ({transactions.length})</h3>

          {transactions.length === 0 && <p style={{ color: "#64748b" }}>Henüz veri girişi yapılmadı.</p>}

          <div style={{ display: "grid", gap: "10px" }}>
            {transactions.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  flexDirection: windowWidth < 480 ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: windowWidth < 480 ? "flex-start" : "center",
                  padding: "18px",
                  background: "#0f172a",
                  borderRadius: "16px",
                  border: editingId === item.id ? "1px solid #3b82f6" : "1px solid transparent",
                  transition: "0.2s",
                  gap: "10px"
                }}
              >
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                  <div style={{ 
                    color: item.type === "income" ? "#4ade80" : "#f87171",
                    background: item.type === "income" ? "rgba(74, 222, 128, 0.1)" : "rgba(248, 113, 113, 0.1)",
                    padding: "10px",
                    borderRadius: "12px",
                    display: "flex"
                  }}>
                    {item.type === "income" ? <IconTrendingUp /> : <IconTrendingDown />}
                  </div>
                  <div>
                    <div style={{ fontSize: "1.05rem", fontWeight: "500" }}>{item.title}</div>
                    <small style={{ color: "#64748b" }}>{item.date}</small>
                  </div>
                </div>

                <div style={{ 
                  display: "flex", 
                  gap: "20px", 
                  alignItems: "center", 
                  width: windowWidth < 480 ? "100%" : "auto", 
                  justifyContent: windowWidth < 480 ? "space-between" : "flex-end" 
                }}>
                  <strong style={{ 
                    fontSize: "1.1rem",
                    color: item.type === "income" ? "#4ade80" : "#f87171", 
                    whiteSpace: "nowrap" 
                  }}>
                    {item.type === "income" ? "+" : "-"} {formatMoney(item.amount)}
                  </strong>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => startEdit(item)}
                      style={{ background: "#1e293b", border: "none", color: "#3b82f6", cursor: "pointer", padding: "8px", borderRadius: "8px" }}
                      title="Düzenle"
                    >
                      <IconEdit />
                    </button>

                    <button
                      onClick={() => deleteTransaction(item.id)}
                      style={{ background: "#1e293b", border: "none", color: "#f87171", cursor: "pointer", padding: "8px", borderRadius: "8px" }}
                      title="Sil"
                    >
                      <IconTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;