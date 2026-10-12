import React from "react";

const PRODUCTS = [
  { id: 1, name: "Premium Hardcover Notebook", price: "UGX 35,000", tag: "Best Seller" },
  { id: 2, name: "Gel Ink Rollerball Pen Set (5-Pack)", price: "UGX 18,000", tag: "Popular" },
  { id: 3, name: "Executive Desk Organizer", price: "UGX 65,000", tag: "Office" },
  { id: 4, name: "A4 High-Grade Printing Paper (500 sheets)", price: "UGX 28,000", tag: "Essentials" },
];

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", color: "#0f172a", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <header style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", margin: 0, color: "#1e293b" }}>Stationery Express</h1>
        <span style={{ fontSize: "14px", backgroundColor: "#dbeafe", color: "#1d4ed8", padding: "4px 12px", borderRadius: "9999px", fontWeight: "600" }}>Live Demo</span>
      </header>

      <section style={{ textAlign: "center", padding: "48px 20px 32px" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "800", margin: "0 0 12px 0", color: "#0f172a" }}>Premium Stationery & Office Supplies</h2>
        <p style={{ fontSize: "16px", color: "#64748b", maxWidth: "560px", margin: "0 auto" }}>
          Explore our wide selection of pens, notebooks, organizers, and everyday essentials delivered directly to your doorstep.
        </p>
      </section>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
        {PRODUCTS.map((item) => (
          <div key={item.id} style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div>
              <span style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: "700", color: "#0284c7", letterSpacing: "0.05em" }}>{item.tag}</span>
              <h3 style={{ fontSize: "17px", fontWeight: "600", margin: "8px 0 12px 0", color: "#1e293b" }}>{item.name}</h3>
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#047857", marginBottom: "12px" }}>{item.price}</div>
              <button style={{ width: "100%", backgroundColor: "#2563eb", color: "#ffffff", border: "none", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

