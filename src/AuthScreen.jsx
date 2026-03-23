import { useState } from 'react'

const P = {
  a: "#FF7A45", pu: "#B08CFA", gr: "#4ADE80", cy: "#2DD4BF",
  bg: "#0B0B12", cd: "rgba(255,255,255,0.045)", bd: "rgba(255,255,255,0.10)",
  t1: "#F1F1F4", t2: "#A8A8B8", t3: "#7A7A92", t4: "#55556B",
}
const FN = { ui: "'Outfit',sans-serif", m: "'DM Mono',monospace" }

export default function AuthScreen({ onLogin, onSignUp, error, loading }) {
  const [mode, setMode] = useState("login") // login | signup
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("trainer")

  const handleSubmit = () => {
    if (mode === "login") onLogin(email, password)
    else onSignUp(email, password, name, role)
  }

  return (
    <div style={{ fontFamily: FN.ui, background: P.bg, color: P.t1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 28px" }}>
      
      {/* Logo */}
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <h1 style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-0.07em" }}>
          FORGE<span style={{ color: P.a }}>FIT</span>
        </h1>
        <p style={{ fontSize: 15, color: P.t2, marginTop: 8 }}>
          {mode === "login" ? "Entre na sua conta" : "Crie sua conta"}
        </p>
      </div>

      {/* Form */}
      <div style={{ width: "100%", maxWidth: 380 }}>
        {mode === "signup" && (
          <>
            <label style={{ fontSize: 13, fontWeight: 600, color: P.t2, marginBottom: 8, display: "block" }}>Nome completo</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Prof. Ricardo"
              style={{ width: "100%", padding: "14px 16px", background: P.cd, border: `1px solid ${P.bd}`, borderRadius: 18, color: P.t1, fontSize: 15, fontFamily: FN.ui, outline: "none", marginBottom: 16, boxSizing: "border-box" }} />
            
            <label style={{ fontSize: 13, fontWeight: 600, color: P.t2, marginBottom: 8, display: "block" }}>Você é</label>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              {[{ id: "trainer", label: "Personal Trainer", icon: "🏋️" }, { id: "student", label: "Aluno", icon: "💪" }].map(r => (
                <button key={r.id} onClick={() => setRole(r.id)}
                  style={{ flex: 1, padding: "14px 12px", borderRadius: 16, border: role === r.id ? `2px solid ${P.a}` : `1px solid ${P.bd}`, background: role === r.id ? `${P.a}12` : P.cd, color: role === r.id ? P.a : P.t2, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FN.ui }}>
                  <span style={{ fontSize: 20 }}>{r.icon}</span> {r.label}
                </button>
              ))}
            </div>
          </>
        )}

        <label style={{ fontSize: 13, fontWeight: 600, color: P.t2, marginBottom: 8, display: "block" }}>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com"
          style={{ width: "100%", padding: "14px 16px", background: P.cd, border: `1px solid ${P.bd}`, borderRadius: 18, color: P.t1, fontSize: 15, fontFamily: FN.ui, outline: "none", marginBottom: 16, boxSizing: "border-box" }} />
        
        <label style={{ fontSize: 13, fontWeight: 600, color: P.t2, marginBottom: 8, display: "block" }}>Senha</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
          style={{ width: "100%", padding: "14px 16px", background: P.cd, border: `1px solid ${P.bd}`, borderRadius: 18, color: P.t1, fontSize: 15, fontFamily: FN.ui, outline: "none", marginBottom: 24, boxSizing: "border-box" }} />

        {error && (
          <div style={{ padding: "12px 16px", borderRadius: 14, background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.2)", color: "#FB7185", fontSize: 14, marginBottom: 16, textAlign: "center" }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", padding: "16px 22px", borderRadius: 18, border: "none", background: `linear-gradient(135deg,${P.a},${P.pu})`, color: "#fff", fontSize: 16, fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: FN.ui, boxShadow: `0 8px 24px ${P.a}30`, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Criar Conta"}
        </button>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")}
            style={{ background: "none", border: "none", color: P.a, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FN.ui }}>
            {mode === "login" ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
          </button>
        </div>
      </div>
    </div>
  )
}
