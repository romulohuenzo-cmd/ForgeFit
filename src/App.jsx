import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase.js";

const P = {
  a: "#FF7A45", al: "#FFA070", ad: "#E05A20",
  cy: "#2DD4BF", pu: "#B08CFA", gr: "#4ADE80", go: "#FCD34D", re: "#FB7185",
  bg: "#0B0B12", cd: "rgba(255,255,255,0.045)", bd: "rgba(255,255,255,0.10)",
  hv: "rgba(255,255,255,0.06)", ip: "rgba(255,255,255,0.06)",
  t1: "#F1F1F4", t2: "#A8A8B8", t3: "#7A7A92", t4: "#55556B",
  SC: ["#FF7A45","#2DD4BF","#B08CFA","#4ADE80","#FCD34D","#FB7185","#818CF8","#34D399"],
};
const FN = { ui: "'Outfit',sans-serif", m: "'DM Mono',monospace" };
const sc = (id) => P.SC[typeof id === "string" ? id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % P.SC.length : (id||0) % P.SC.length];

const PLANS = [
  { id: "basico", nm: "Básico", s: 2, pr: 197, c: "#4ADE80", ic: "🌱" },
  { id: "intermediario", nm: "Intermediário", s: 3, pr: 297, c: "#2DD4BF", ic: "⚡" },
  { id: "avancado", nm: "Avançado", s: 5, pr: 497, c: "#FF7A45", ic: "🔥" },
];
const DAYS = ["Seg","Ter","Qua","Qui","Sex","Sáb"];
const HOURS = [7,8,9,10,11,12,13,14,15,16,17,18,19];
const TT = ["Iniciante","Dedicado","Guerreiro","Incansável","Veterano","Mestre","Lenda","Titã","Imortal","Deus do Treino"];

const ST = [
  { id:"s1",nm:"Lucas Mendes",av:"LM",lv:12,xp:2450,xn:3500,sk:14,pg:85,gl:"Hipertrofia",wt:"78.5 kg",bf:"14.2%",lm:"67.3 kg",fq:"3x/sem",pl:"intermediario",lw:"Hoje",sl:["Seg-8","Qua-8","Sex-8"],
    wk:[{id:"w1",nm:"Treino A — Peito & Tríceps",dy:"Seg/Qua",ex:[
      {id:"e1",nm:"Supino Reto",st:"4x10",wt:"80kg",rs:"90s",mu:"Peito"},
      {id:"e2",nm:"Supino Inclinado",st:"4x10",wt:"60kg",rs:"90s",mu:"Peito"},
      {id:"e3",nm:"Crucifixo",st:"3x12",wt:"16kg",rs:"60s",mu:"Peito"},
      {id:"e4",nm:"Tríceps Corda",st:"4x12",wt:"30kg",rs:"60s",mu:"Tríceps"},
      {id:"e5",nm:"Tríceps Francês",st:"3x12",wt:"20kg",rs:"60s",mu:"Tríceps"},
    ]},{id:"w2",nm:"Treino B — Costas & Bíceps",dy:"Ter/Qui",ex:[
      {id:"e6",nm:"Puxada Frontal",st:"4x10",wt:"70kg",rs:"90s",mu:"Costas"},
      {id:"e7",nm:"Remada Curvada",st:"4x10",wt:"60kg",rs:"90s",mu:"Costas"},
      {id:"e8",nm:"Rosca Direta",st:"4x10",wt:"20kg",rs:"60s",mu:"Bíceps"},
    ]}],wp:[{l:"S",v:85},{l:"T",v:70},{l:"Q",v:90},{l:"Q",v:60},{l:"S",v:95},{l:"S",v:40},{l:"D",v:0}]},
  { id:"s2",nm:"Carla Oliveira",av:"CO",lv:19,xp:8200,xn:9000,sk:28,pg:95,gl:"Definição",wt:"62.0 kg",bf:"16.8%",lm:"51.6 kg",fq:"5x/sem",pl:"avancado",lw:"Hoje",sl:["Seg-10","Ter-10","Qua-10","Qui-10","Sex-10"],
    wk:[{id:"w3",nm:"Treino Full Body",dy:"Seg/Qua/Sex",ex:[
      {id:"e9",nm:"Agachamento",st:"4x10",wt:"80kg",rs:"120s",mu:"Pernas"},
      {id:"e10",nm:"Supino Reto",st:"4x10",wt:"40kg",rs:"90s",mu:"Peito"},
      {id:"e11",nm:"Puxada",st:"4x10",wt:"50kg",rs:"90s",mu:"Costas"},
    ]}],wp:[{l:"S",v:100},{l:"T",v:95},{l:"Q",v:100},{l:"Q",v:90},{l:"S",v:100},{l:"S",v:80},{l:"D",v:0}]},
  { id:"s3",nm:"Ana Silva",av:"AS",lv:8,xp:1200,xn:2500,sk:7,pg:72,gl:"Saúde",wt:"68.0 kg",bf:"22.0%",lm:"53.0 kg",fq:"3x/sem",pl:"intermediario",lw:"Ontem",sl:["Ter-14","Qui-14","Sáb-9"],
    wk:[{id:"w4",nm:"Treino Funcional",dy:"Ter/Qui/Sáb",ex:[
      {id:"e12",nm:"Kettlebell Swing",st:"3x15",wt:"12kg",rs:"60s",mu:"Full Body"},
      {id:"e13",nm:"Burpee",st:"3x10",wt:"—",rs:"60s",mu:"Full Body"},
      {id:"e14",nm:"Prancha",st:"3x45s",wt:"—",rs:"30s",mu:"Core"},
    ]}],wp:[{l:"S",v:0},{l:"T",v:80},{l:"Q",v:0},{l:"Q",v:75},{l:"S",v:0},{l:"S",v:70},{l:"D",v:0}]},
];

const css = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{-webkit-font-smoothing:antialiased}body{font-family:'Outfit',sans-serif;background:#0B0B12;color:#F1F1F4;overflow-x:hidden}::selection{background:rgba(255,122,69,.35)}input::placeholder{color:#6B6B80}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:10px}:focus-visible{outline:2px solid #FF7A45;outline-offset:2px;border-radius:4px}@keyframes fu{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}@keyframes su{from{opacity:0;transform:translateY(32px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes si{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}@keyframes fi{from{opacity:0}to{opacity:1}}@keyframes br{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.08);opacity:1}}@keyframes pu{0%,100%{opacity:1}50%{opacity:.35}}@keyframes sh{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes ga{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}@keyframes hf{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-12px) rotate(3deg)}}@keyframes ob{0%{transform:rotate(0deg) translateX(56px) rotate(0deg)}100%{transform:rotate(360deg) translateX(56px) rotate(-360deg)}}@media(max-width:400px){.fs{padding-left:14px!important;padding-right:14px!important}.fht{font-size:40px!important}.ffg{grid-template-columns:1fr!important}}@media(min-width:768px){.fs{max-width:560px!important}}@media(min-width:1024px){.fs{max-width:640px!important;margin-left:80px!important;padding-bottom:40px!important}.fn{left:0!important;right:auto!important;bottom:0!important;top:0!important;width:80px!important;height:100vh!important;border-top:none!important;border-right:1px solid rgba(255,255,255,.06)!important;padding:24px 0!important}.fni{flex-direction:column!important;height:100%!important;justify-content:flex-start!important;padding-top:28px!important;gap:4px!important}}`;

const I = {
  Hm:()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Us:()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/></svg>,
  Ca:()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  Wa:()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>,
  Se:()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Db:()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M6.5 6.5h11M6.5 17.5h11M3 10h1.5M3 14h1.5M19.5 10H21M19.5 14H21M4.5 10v4M19.5 10v4M6.5 6.5v11M17.5 6.5v11"/></svg>,
  Tr:()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V22M14 14.66V22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>,
  Ch:()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  Be:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Fr:({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" opacity=".9"><path d="M12 23c-4-3-8-6-8-11a8 8 0 0116 0c0 5-4 8-8 11z"/></svg>,
  Ck:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Pl:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg>,
  Ri:({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Le:()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  Tu:({s=14})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Zp:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Tg:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Ur:()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Sh:()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Lo:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Im:()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Ed:({s=14})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Cm:()=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Ms:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
};

const An = ({ value: v, dur: d = 1000 }) => { const [n, sn] = useState(0); const r = useRef(0); useEffect(() => { const s = r.current, df = v - s, t = performance.now(); const a = (now) => { const p = Math.min((now - t) / d, 1); sn(Math.round(s + df * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(a); else r.current = v; }; requestAnimationFrame(a); }, [v, d]); return <>{n.toLocaleString()}</>; };

const Bars = ({ data, color: co = P.a, h = 88, unit = "", prefix = "" }) => { const mx = Math.max(...data.map(d => d.v), 1); const fmt = (v) => v >= 10000 ? `${prefix}${(v/1000).toFixed(1)}k` : v >= 1000 ? `${prefix}${(v/1000).toFixed(1)}k` : `${prefix}${v}${unit}`; return ( <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: h }}>{data.map((d, i) => { const pct = (d.v / mx) * 100; return ( <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}><span style={{ fontSize: 11, fontWeight: 700, color: pct >= 80 ? co : P.t2, fontFamily: FN.m, whiteSpace: "nowrap" }}>{fmt(d.v)}</span><div style={{ width: "100%", height: `${Math.max(pct, 6)}%`, background: `linear-gradient(180deg,${co},${co}55)`, borderRadius: "6px 6px 3px 3px", transition: "height 1.4s cubic-bezier(.16,1,.3,1)", minHeight: 5 }} /><span style={{ fontSize: 11, color: P.t3, fontFamily: FN.m, fontWeight: 500 }}>{d.l}</span></div> ); })}</div> ); };

const Ring = ({ value: v, max: m, color: co = P.a, label: lb, sub: su, size: sz = 82 }) => { const pct = m > 0 ? Math.min((v / m) * 100, 100) : 0, r = (sz - 10) / 2, ci = 2 * Math.PI * r; return ( <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 14 }}><div style={{ position: "relative", width: sz, height: sz }}><svg width={sz} height={sz} style={{ transform: "rotate(-90deg)" }}><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={5} /><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={co} strokeWidth={5} strokeLinecap="round" strokeDasharray={ci} strokeDashoffset={ci-(ci*pct)/100} style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(.16,1,.3,1)", filter: `drop-shadow(0 0 10px ${co}55)` }} /></svg><div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}><span style={{ fontSize: sz > 70 ? 22 : 16, fontWeight: 800, color: co, fontFamily: FN.m, lineHeight: 1 }}>{v}</span>{su && <span style={{ fontSize: 10, color: P.t4, fontFamily: FN.m, marginTop: 3 }}>{su}</span>}</div></div>{lb && <span style={{ fontSize: 12, color: P.t3, fontWeight: 600 }}>{lb}</span>}</div> ); };

const Cd = ({ children: ch, style: s, onClick: oc }) => { const [hv, setHv] = useState(false); return ( <div onClick={oc} role={oc ? "button" : undefined} tabIndex={oc ? 0 : undefined} onMouseEnter={() => oc && setHv(true)} onMouseLeave={() => setHv(false)} style={{ background: P.cd, border: `1px solid ${hv ? "rgba(255,255,255,0.15)" : P.bd}`, borderRadius: 24, padding: 22, cursor: oc ? "pointer" : undefined, transition: "all .35s cubic-bezier(.4,0,.2,1)", transform: hv ? "translateY(-2px)" : "none", boxShadow: hv ? "0 8px 30px rgba(0,0,0,0.3)" : "none", ...s }}>{ch}</div> ); };

const Bt = ({ children: ch, primary: pr, danger: dg, full: fl, style: s, ...props }) => ( <button style={{ fontFamily: FN.ui, fontWeight: 700, borderRadius: 16, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .3s", width: fl ? "100%" : undefined, border: "none", outline: "none", padding: "13px 22px", fontSize: 15, ...(pr ? { background: `linear-gradient(135deg,${P.a},${P.pu})`, color: "#fff", boxShadow: `0 8px 24px ${P.a}30` } : dg ? { background: "rgba(251,113,133,.12)", color: P.re, border: `1px solid rgba(251,113,133,.25)` } : { background: P.cd, color: P.t1, border: `1px solid ${P.bd}` }), ...s }} {...props}>{ch}</button> );

export default function App({ supabaseUser, onSignOut }) {
  const [user, setUser] = useState(null);

  // Auto-login from Supabase
  useEffect(() => {
    if (supabaseUser && !user) {
      setUser({ role: supabaseUser.role || "trainer", name: supabaseUser.name || "Usuário", id: supabaseUser.id });
      setPg("home");
    }
  }, [supabaseUser]);

  const [pg, setPg] = useState("home");
  const [toast, setToast] = useState(null);
  const [sel, setSel] = useState(null);
  const [flt, setFlt] = useState("Todos");
  const [sDay, setSDay] = useState("Seg");
  const [done, setDone] = useState([]);
  const [xp, setXP] = useState(2450);
  const [rT, setRT] = useState(0);
  const [aR, setAR] = useState(false);
  const [sLU, setSLU] = useState(false);
  const [sW, setSW] = useState(null);
  const [photos, setPhotos] = useState({});
  const [profPh, setProfPh] = useState({});

  const [modal, setModal] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authName, setAuthName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login or register
  const [realStudents, setRealStudents] = useState([]);

  const show = (m) => { setToast(m); setTimeout(() => setToast(null), 3000); };

  // Auth functions
  const handleLogin = async (role) => {
    if (!supabase) { show("Supabase não configurado"); return; }
    setAuthLoading(true);
    try {
      if (authMode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail, password: authPass,
          options: { data: { name: authName || authEmail.split("@")[0], role } }
        });
        if (error) throw error;
        // Create profile
        if (data.user) {
          await supabase.from("profiles").insert({ id: data.user.id, name: authName || authEmail.split("@")[0], email: authEmail, role });
        }
        show("Conta criada! Verifique seu email se necessário.");
        setUser({ role, id: data.user?.id, name: authName || authEmail.split("@")[0] });
        setModal(null); setPg("home");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPass });
        if (error) throw error;
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
        setUser({ role: profile?.role || role, id: data.user.id, name: profile?.name || authEmail.split("@")[0] });
        setModal(null); setPg("home");
        show("Login realizado! 🎉");
      }
    } catch (err) {
      show("Erro: " + (err.message || "Tente novamente"));
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    if (onSignOut) { await onSignOut(); }
    setUser(null); setPg("home"); setSel(null);
  };

  // Check existing session on load
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from("profiles").select("*").eq("id", session.user.id).single().then(({ data: profile }) => {
          if (profile) setUser({ role: profile.role, id: session.user.id, name: profile.name });
        });
      }
    });
  }, []);

  // Fetch real students if trainer
  useEffect(() => {
    if (!supabase || !user || user.role !== "trainer") return;
    supabase.from("students").select("*, profiles(name, email, photo_url)").eq("trainer_id", user.id).then(({ data }) => {
      if (data) setRealStudents(data);
    });
  }, [user]);
  useEffect(() => { if (!aR || rT <= 0) return; const t = setTimeout(() => setRT(p => p - 1), 1000); return () => clearTimeout(t); }, [aR, rT]);
  useEffect(() => { if (aR && rT <= 0) setAR(false); }, [rT, aR]);

  const isTr = user?.role === "trainer";
  const cSt = !isTr ? ST[0] : null;
  const rev = ST.reduce((s, st) => { const p = PLANS.find(x => x.id === st.pl); return s + (p?.pr || 0); }, 0);

  const handlePhoto = (e, type, sid) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (type === "profile") { setProfPh(p => ({ ...p, [sid]: ev.target.result })); show("Foto de perfil atualizada! 📸"); }
      else { const lb = ["Frente","Costas","Lateral"][Math.floor(Math.random()*3)]; setPhotos(p => ({ ...p, [sid]: [...(p[sid]||[]), { src: ev.target.result, lb, dt: new Date().toLocaleDateString("pt-BR") }] })); show("Foto adicionada! 💪"); }
    };
    reader.readAsDataURL(file);
  };

  const Avatar = ({ id, av, sz = 42 }) => ( <div style={{ width: sz, height: sz, borderRadius: sz * .38, background: profPh[id] ? "transparent" : `linear-gradient(135deg,${sc(id)}1A,transparent)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: sz * .3, overflow: "hidden", flexShrink: 0 }}>{profPh[id] ? <img src={profPh[id]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : av}</div> );

  // ═══ LANDING ═══
  if (!user) return (
    <div style={{ fontFamily: FN.ui, background: P.bg, color: P.t1, minHeight: "100vh", position: "relative", overflow: "auto" }}>
      <style>{css}</style>
      <div style={{ position: "fixed", top: "-30%", right: "-20%", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle,${P.a}0A,transparent 50%)`, pointerEvents: "none", animation: "br 10s ease-in-out infinite" }} />
      <div style={{ position: "fixed", bottom: "-30%", left: "-20%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle,${P.pu}08,transparent 50%)`, pointerEvents: "none", animation: "br 14s ease-in-out infinite 5s" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "0 28px" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "52px 0" }}>
          {/* Logo */}
          <div style={{ position: "relative", width: 130, height: 130, marginBottom: 52 }}>
            <div style={{ position: "absolute", inset: -28, borderRadius: "50%", background: `radial-gradient(circle,${P.a}10,transparent 55%)`, animation: "br 4s ease-in-out infinite" }} />
            <div style={{ position: "absolute", inset: -8, animation: "ob 6s linear infinite" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: P.a, boxShadow: `0 0 10px ${P.a}` }} /></div>
            <svg viewBox="0 0 130 130" width="130" height="130" style={{ animation: "hf 8s ease-in-out infinite" }}>
              <defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={P.a} /><stop offset="100%" stopColor={P.pu} /></linearGradient><linearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={P.cy} stopOpacity=".35" /><stop offset="100%" stopColor={P.pu} stopOpacity=".1" /></linearGradient><filter id="gl"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
              <circle cx="65" cy="65" r="56" fill="none" stroke="url(#g2)" strokeWidth="1" opacity=".4"><animateTransform attributeName="transform" type="rotate" from="0 65 65" to="360 65 65" dur="24s" repeatCount="indefinite" /></circle>
              <circle cx="65" cy="65" r="44" fill="none" stroke="url(#g2)" strokeWidth="1.5" strokeDasharray="12 16" opacity=".45"><animateTransform attributeName="transform" type="rotate" from="360 65 65" to="0 65 65" dur="18s" repeatCount="indefinite" /></circle>
              <circle cx="65" cy="65" r="32" fill="none" stroke="url(#g1)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="70 130" filter="url(#gl)"><animateTransform attributeName="transform" type="rotate" from="0 65 65" to="360 65 65" dur="10s" repeatCount="indefinite" /></circle>
              <g transform="translate(65,65)" fill="url(#g1)" filter="url(#gl)"><polygon points="-3,-18 -10,2 -2,2 0,18 10,-2 2,-2" opacity=".95" /></g>
            </svg>
          </div>
          <div style={{ animation: "su .7s cubic-bezier(.16,1,.3,1) both" }}><h1 className="fht" style={{ fontSize: 56, fontWeight: 900, letterSpacing: "-0.07em", lineHeight: .92, background: "linear-gradient(180deg,rgba(241,241,244,.98) 20%,rgba(241,241,244,.35) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FORGE<span style={{ WebkitTextFillColor: P.a }}>FIT</span></h1></div>
          <div style={{ width: 44, height: 3, background: `linear-gradient(90deg,transparent,${P.a}90,transparent)`, margin: "24px 0 26px", borderRadius: 3, animation: "fu .5s .3s both" }} />
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.4, maxWidth: 360, animation: "fu .5s .4s both" }}>Seus alunos evoluem.<br /><span style={{ color: P.a }}>Seu negócio cresce.</span></h2>
          <p style={{ fontSize: 16, color: P.t2, lineHeight: 1.75, maxWidth: 340, marginTop: 16, animation: "fu .5s .5s both" }}>A plataforma que faz seus alunos <strong style={{ color: P.t1, fontWeight: 600 }}>viciarem em treinar</strong>. Gamificação, gestão e retenção.</p>
        </div>

        <div style={{ paddingBottom: 52 }}>
          {/* Features */}
          <div className="ffg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
            {[{ icon: <I.Tr />, t: "Gamificação", d: "XP, níveis, streak e conquistas que viciam", c: P.a }, { icon: <I.Sh />, t: "Retenção", d: "Alunos engajados que não cancelam", c: P.gr }, { icon: <I.Ca />, t: "Agenda", d: "Horários organizados automaticamente", c: P.cy }, { icon: <I.Ch />, t: "Financeiro", d: "Receita, projeções e simulador", c: P.go }].map((f, i) => (
              <div key={i} style={{ background: P.cd, border: `1px solid ${f.c}18`, borderRadius: 24, padding: 20, animation: `fu .6s ${.15 + i * .1}s both` }}>
                <div style={{ width: 42, height: 42, borderRadius: 14, background: `${f.c}12`, border: `1px solid ${f.c}18`, display: "flex", alignItems: "center", justifyContent: "center", color: f.c, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{f.t}</div>
                <div style={{ fontSize: 13, color: P.t2, lineHeight: 1.65 }}>{f.d}</div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <h3 style={{ fontSize: 20, fontWeight: 800, textAlign: "center", marginBottom: 16 }}>Planos</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
            {[{ n: "Starter", p: "Grátis", d: "Até 5 alunos", c: P.t3 }, { n: "Pro", p: "R$39", d: "Até 30 alunos", c: P.a, pop: true }, { n: "Elite", p: "R$69", d: "Alunos ilimitados", c: P.pu }].map((pl, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center", padding: "20px 12px", borderRadius: 20, border: pl.pop ? `2px solid ${pl.c}40` : `1px solid ${P.bd}`, background: pl.pop ? `${pl.c}08` : P.cd }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: pl.c, marginBottom: 8 }}>{pl.n}</div>
                <div style={{ fontSize: 24, fontWeight: 800, fontFamily: FN.m }}>{pl.p}</div>
                <div style={{ fontSize: 11, color: P.t2, marginTop: 6 }}>{pl.d}</div>
              </div>
            ))}
          </div>

          {/* Como Funciona */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, textAlign: "center", marginBottom: 20 }}>Como Funciona</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[{ n: "1", t: "Cadastre-se", d: "Crie sua conta em menos de 2 minutos", c: P.a }, { n: "2", t: "Adicione alunos", d: "Monte treinos e defina horários", c: P.cy }, { n: "3", t: "Eles evoluem", d: "Gamificação faz o resto — XP, streak, conquistas", c: P.gr }].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", borderRadius: 20, background: P.cd, border: `1px solid ${s.c}12` }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: `${s.c}12`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: s.c, fontFamily: FN.m, flexShrink: 0 }}>{s.n}</div>
                  <div><div style={{ fontSize: 15, fontWeight: 700 }}>{s.t}</div><div style={{ fontSize: 13, color: P.t2, marginTop: 3 }}>{s.d}</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
            {[{ q: "Meus alunos pararam de cancelar. O streak mudou tudo.", nm: "Prof. Marcos", loc: "São Paulo · 32 alunos", c: P.a }, { q: "A gamificação fez meus alunos treinarem nos dias que não tem aula comigo.", nm: "Prof. Juliana", loc: "Curitiba · 18 alunos", c: P.cy }].map((t, i) => (
              <div key={i} style={{ padding: "18px 20px", borderLeft: `3px solid ${t.c}60`, borderRadius: "0 14px 14px 0", background: `${t.c}05` }}>
                <p style={{ fontSize: 14, color: P.t2, lineHeight: 1.75, fontStyle: "italic" }}>"{t.q}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: `${t.c}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: t.c }}>{t.nm[0]}</div>
                  <div><div style={{ fontSize: 12, fontWeight: 700 }}>{t.nm}</div><div style={{ fontSize: 11, color: P.t3 }}>{t.loc}</div></div>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
            <button onClick={() => setModal("login-trainer")} style={{ width: "100%", padding: "20px 24px", cursor: "pointer", textAlign: "left", borderRadius: 28, border: `1px solid ${P.a}35`, background: `linear-gradient(135deg,${P.a}16,${P.a}06)`, display: "flex", alignItems: "center", gap: 18, color: P.t1, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: "-100%", width: "200%", height: "100%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent)", animation: "sh 5s infinite", pointerEvents: "none" }} />
              <div style={{ width: 52, height: 52, borderRadius: 18, background: `${P.a}1A`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.Db /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 17, fontWeight: 700 }}>Começar como Personal</div><div style={{ fontSize: 14, color: P.t2, marginTop: 5 }}>Gestão completa + gamificação</div></div>
              <I.Ri s={20} />
            </button>
            <button onClick={() => setModal("login-student")} style={{ width: "100%", padding: "18px 24px", cursor: "pointer", textAlign: "left", borderRadius: 28, border: `1px solid ${P.bd}`, background: P.cd, display: "flex", alignItems: "center", gap: 18, color: P.t1 }}>
              <div style={{ width: 52, height: 52, borderRadius: 18, background: P.hv, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.Ur /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 700 }}>Entrar como Aluno</div><div style={{ fontSize: 14, color: P.t2, marginTop: 5 }}>Treinos gamificados</div></div>
              <I.Ri s={20} />
            </button>
          </div>
          <div style={{ textAlign: "center", paddingBottom: 28 }}><div style={{ fontSize: 11, color: P.t4, fontFamily: FN.m }}>FORGEFIT © 2026</div></div>
        </div>
      </div>
    </div>
  );

  const nav = isTr
    ? [{id:"home",ic:<I.Hm/>,l:"Home"},{id:"students",ic:<I.Us/>,l:"Alunos"},{id:"schedule",ic:<I.Ca/>,l:"Agenda"},{id:"finance",ic:<I.Wa/>,l:"Financeiro"},{id:"settings",ic:<I.Se/>,l:"Config"}]
    : [{id:"home",ic:<I.Hm/>,l:"Home"},{id:"workout",ic:<I.Db/>,l:"Treino"},{id:"evolucao",ic:<I.Tr/>,l:"Evolução"},{id:"photos",ic:<I.Im/>,l:"Fotos"},{id:"progress",ic:<I.Ch/>,l:"Progresso"}];

  // ═══ TRAINER HOME ═══
  const THome = () => {
    const tk = ST.length > 0 ? Math.round(rev / ST.length) : 0;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingTop: 10, animation: "fu .5s both" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: P.gr, boxShadow: `0 0 10px ${P.gr}70` }} /><span style={{ fontSize: 12, color: P.t3, fontFamily: FN.m, letterSpacing: ".12em" }}>{new Date().getHours() < 12 ? "BOM DIA" : "BOA TARDE"}</span></div>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em" }}>Ricardo</h1>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 18, background: profPh["trainer"]?"transparent":P.cd, border: `1px solid ${P.bd}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: P.t3, position: "relative", overflow: "hidden" }}>
            {profPh["trainer"]?<img src={profPh["trainer"]} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<I.Be />}<div style={{ position: "absolute", top: -4, right: -4, width: 20, height: 20, borderRadius: 10, background: P.re, border: `3px solid ${P.bg}`, fontSize: 11, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>3</div>
          </div>
        </div>
        {/* Revenue */}
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 28, border: `1px solid ${P.gr}16`, padding: "26px 24px 22px", background: `linear-gradient(150deg,${P.gr}08,${P.cy}04,${P.bg})`, animation: "su .6s .1s both" }}>
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
              <div>
                <div style={{ fontSize: 12, color: P.t3, fontFamily: FN.m, letterSpacing: ".1em", marginBottom: 12 }}>RECEITA MENSAL</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}><span style={{ fontSize: 14, color: P.gr, fontWeight: 600, fontFamily: FN.m }}>R$</span><span style={{ fontSize: 44, fontWeight: 800, color: P.gr, letterSpacing: "-0.04em", fontFamily: FN.m, lineHeight: 1 }}><An value={rev} /></span></div>
              </div>
              <div style={{ background: `${P.gr}12`, border: `1px solid ${P.gr}22`, borderRadius: 12, padding: "6px 12px", display: "flex", alignItems: "center", gap: 4 }}><I.Tu s={13} /><span style={{ fontSize: 14, fontWeight: 800, color: P.gr, fontFamily: FN.m }}>+18%</span></div>
            </div>
            <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,.05)", paddingTop: 16 }}>
              {[{v:String(ST.length),l:"ALUNOS"},{v:`R$${tk}`,l:"TICKET"},{v:`R$${((rev*12)/1000).toFixed(0)}k`,l:"ANO"},{v:"42%",l:"CAPAC."}].map((k,i)=>(<div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,.05)" : "none" }}><div style={{ fontSize: 16, fontWeight: 800, color: P.t2, fontFamily: FN.m }}>{k.v}</div><div style={{ fontSize: 11, color: P.t4, fontFamily: FN.m, marginTop: 4 }}>{k.l}</div></div>))}
            </div>
          </div>
        </div>
        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, animation: "fu .5s .3s both" }}>
          {[{l:"Alunos",s:`${ST.length}`,ic:<I.Us/>,c:P.a,p:"students"},{l:"Financeiro",s:`R$${(rev/1000).toFixed(1)}k`,ic:<I.Wa/>,c:P.gr,p:"finance"},{l:"Agenda",s:"42%",ic:<I.Ca/>,c:P.cy,p:"schedule"},{l:"Config",s:"Perfil",ic:<I.Se/>,c:P.pu,p:"settings"}].map((a,i)=>(
            <button key={i} onClick={()=>setPg(a.p)} style={{ padding: 20, cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: 14, borderRadius: 24, border: `1px solid ${a.c}0A`, background: `linear-gradient(150deg,${a.c}06,transparent)`, color: P.t1 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${a.c}0C`, display: "flex", alignItems: "center", justifyContent: "center", color: a.c }}>{a.ic}</div>
              <div><div style={{ fontSize: 15, fontWeight: 700 }}>{a.l}</div><div style={{ fontSize: 12, color: P.t3, marginTop: 4, fontFamily: FN.m }}>{a.s}</div></div>
            </button>
          ))}
        </div>
        {/* Activity */}
        <div style={{ animation: "fu .5s .4s both" }}>
          <div style={{ marginBottom: 18, padding: "16px 18px", borderRadius: 20, background: `${P.a}05`, border: `1px solid ${P.a}10` }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 16 }}>📅</span><span style={{ fontSize: 15, fontWeight: 700 }}>Hoje · {DAYS[new Date().getDay() === 0 ? 5 : new Date().getDay() - 1]}</span></div><span style={{ fontSize: 13, color: P.a, fontWeight: 700, fontFamily: FN.m }}>{ST.filter(s => s.lw === "Hoje").length} aulas</span></div>{ST.filter(s => s.lw === "Hoje").map((s, i) => { const sl = s.sl?.find(x => x.startsWith(DAYS[new Date().getDay() === 0 ? 5 : new Date().getDay() - 1])); const hr = sl ? sl.split("-")[1] : "?"; return <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderTop: i > 0 ? `1px solid ${P.a}08` : "none" }}><span style={{ fontSize: 14, fontWeight: 700, color: P.a, fontFamily: FN.m, width: 42 }}>{hr}:00</span><Avatar id={s.id} av={s.av} sz={32} /><span style={{ fontSize: 13, fontWeight: 600 }}>{s.nm}</span></div> })}</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Todos os Alunos</div>
          {ST.map((s, i) => (<div key={s.id} onClick={() => { setSel(s); setPg("detail"); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < ST.length - 1 ? `1px solid ${P.bd}` : "none", cursor: "pointer" }}><Avatar id={s.id} av={s.av} /><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{s.nm}</div><div style={{ fontSize: 12, color: P.t3, marginTop: 3 }}>{s.lw}{s.sk > 0 ? ` · ${s.sk}d streak` : ""}</div></div><div style={{ fontSize: 13, fontWeight: 700, color: sc(s.id), fontFamily: FN.m }}>{s.pg}%</div></div>))}
        </div>
      </div>
    );
  };

  // ═══ STUDENT HOME ═══
  const SHome = () => {
    const s = cSt; if (!s) return null;
    const tl = TT[Math.min(Math.floor(s.lv / 2), TT.length - 1)]; const xpP = Math.round((xp / s.xn) * 100); const td = s.lw === "Hoje"; const tw = s.wk[0];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingTop: 10, animation: "fu .5s both" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: td ? P.gr : P.a, boxShadow: `0 0 10px ${td ? P.gr : P.a}70`, animation: td ? "none" : "pu 2s infinite" }} /><span style={{ fontSize: 12, color: P.t3, fontFamily: FN.m, letterSpacing: ".12em" }}>{new Date().getHours() < 12 ? "BOM DIA" : "BOA TARDE"}</span></div>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em" }}>{s.nm.split(" ")[0]}</h1>
          </div>
          <Avatar id={s.id} av={s.av} sz={46} />
        </div>
        {/* Character */}
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 28, border: `1px solid ${P.a}14`, background: `linear-gradient(150deg,${P.a}08,${P.pu}04,${P.bg})`, padding: "24px 24px 18px", animation: "su .6s .1s both" }}>
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><span style={{ background: `linear-gradient(135deg,${P.a},${P.pu})`, borderRadius: 12, padding: "5px 14px", fontSize: 13, fontWeight: 800, fontFamily: FN.m }}>LVL {s.lv}</span><span style={{ fontSize: 13, color: P.t2 }}>{tl}</span></div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}><span style={{ fontSize: 38, fontWeight: 800, fontFamily: FN.m, lineHeight: 1 }}><An value={xp} /></span><span style={{ fontSize: 12, color: P.t3, fontFamily: FN.m }}>/{s.xn.toLocaleString()} XP</span></div>
              </div>
              <div style={{ width: 58, height: 58, borderRadius: 18, background: s.sk > 0 ? `${P.a}0E` : "rgba(255,255,255,.025)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", border: `1px solid ${s.sk > 0 ? `${P.a}1A` : P.bd}` }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: s.sk > 0 ? P.a : P.t4, fontFamily: FN.m, lineHeight: 1 }}>{s.sk}</span>
                <span style={{ fontSize: 11, color: P.t4, fontWeight: 700, letterSpacing: ".1em", marginTop: 2 }}>STREAK</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 11, color: P.t4, fontFamily: FN.m }}>PRÓXIMO NÍVEL</span><span style={{ fontSize: 11, color: P.a, fontWeight: 700, fontFamily: FN.m }}>{xpP}%</span></div>
            <div style={{ height: 5, background: "rgba(255,255,255,.05)", borderRadius: 5, overflow: "hidden" }}><div style={{ height: "100%", width: `${xpP}%`, background: `linear-gradient(90deg,${P.a},${P.pu},${P.cy})`, backgroundSize: "200% 100%", animation: "ga 3s ease infinite", borderRadius: 5 }} /></div>
          </div>
        </div>
        {/* CTA */}
        <button onClick={() => setPg("workout")} style={{ position: "relative", overflow: "hidden", borderRadius: 28, border: td ? `1px solid ${P.gr}1A` : `1px solid ${P.a}1A`, background: td ? `linear-gradient(150deg,${P.gr}06,${P.bg})` : `linear-gradient(150deg,${P.a}06,${P.bg})`, display: "flex", cursor: "pointer", color: P.t1, textAlign: "left", padding: 0, animation: "fu .5s .25s both" }}>
          {!td && <div style={{ position: "absolute", top: 0, left: "-100%", width: "200%", height: "100%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.025),transparent)", animation: "sh 5s infinite", pointerEvents: "none" }} />}
          <div style={{ flex: 1, padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: td ? P.gr : P.a }} /><span style={{ fontSize: 11, fontWeight: 700, color: td ? P.gr : P.a, fontFamily: FN.m, letterSpacing: ".14em" }}>{td ? "CONCLUÍDO" : "INICIAR TREINO"}</span></div>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 7 }}>{tw?.nm || "Treino do Dia"}</div>
            <div style={{ display: "flex", gap: 12 }}><span style={{ fontSize: 12, color: P.t3, fontFamily: FN.m }}>{tw?.ex.length || 0} exercícios</span><span style={{ fontSize: 12, color: P.a, fontWeight: 700, fontFamily: FN.m }}>+{(tw?.ex.length || 0) * 25}XP</span></div>
          </div>
          <div style={{ width: 60, display: "flex", alignItems: "center", justifyContent: "center", background: td ? `${P.gr}08` : `${P.a}08` }}>{td ? <I.Ck /> : <div style={{ width: 40, height: 40, borderRadius: 14, background: `linear-gradient(135deg,${P.a},${P.ad})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 20px ${P.a}40` }}><I.Pl /></div>}</div>
        </button>
        {/* Horários */}
        {s.sl?.length > 0 && <div style={{ borderRadius: 24, border: `1px solid ${P.cy}0A`, background: `${P.cy}04`, padding: "16px 18px", animation: "fu .5s .3s both" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><span style={{ fontSize: 14, fontWeight: 700 }}>Seus Horários</span><span style={{ fontSize: 11, color: P.t3, fontFamily: FN.m }}>{s.sl.length} sessões</span></div><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{s.sl.map(sl => { const [d, h] = sl.split("-"); return <span key={sl} style={{ background: `${P.cy}10`, border: `1px solid ${P.cy}20`, borderRadius: 12, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: P.cy, fontFamily: FN.m }}>{d} {h}h</span>; })}</div></div>}
        {/* Weekly */}
        <div style={{ borderRadius: 24, border: `1px solid ${P.bd}`, background: P.cd, padding: 20, animation: "fu .5s .35s both" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><span style={{ fontSize: 16, fontWeight: 700 }}>Desempenho Semanal</span><div style={{ fontSize: 12, color: P.gr, fontWeight: 700, fontFamily: FN.m, display: "flex", alignItems: "center", gap: 4 }}><I.Tu s={12} /> +12%</div></div><div style={{ fontSize: 12, color: P.t3, marginBottom: 14 }}>Intensidade dos treinos por dia (%)</div><Bars data={s.wp} h={72} unit="%" /></div>
        {/* Motivational */}
        <div style={{ padding: "16px 18px", borderLeft: `3px solid ${P.a}20`, animation: "fu .5s .45s both" }}><p style={{ fontSize: 14, color: P.t2, lineHeight: 1.7, fontStyle: "italic" }}>{s.sk >= 14 ? "Você está imparável! Top 5% de consistência." : s.sk >= 7 ? "Uma semana sem falhar. Continue assim!" : s.sk > 0 ? "Cada dia conta. Não quebre o streak!" : "Hoje é um bom dia para recomeçar."}</p></div>
      </div>
    );
  };

  // ═══ STUDENT WORKOUT ═══
  const SWk = () => {
    const s = cSt; if (!s) return null;
    const w = sW || s.wk[0]; if (!w) return <div style={{ textAlign: "center", padding: 70 }}><span style={{ fontSize: 68 }}>🏋️</span><h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 20 }}>Nenhum treino</h2></div>;
    const ex = w.ex; const pct = ex.length > 0 ? (done.length / ex.length) * 100 : 0;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div><span style={{ fontSize: 12, fontWeight: 700, color: P.a, fontFamily: FN.m, letterSpacing: ".14em" }}>TREINO ATIVO</span><h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 8 }}>{w.nm}</h2><div style={{ fontSize: 13, color: P.t3, marginTop: 4 }}>{w.dy}</div></div>
          <div style={{ textAlign: "right" }}><div style={{ fontSize: 28, fontWeight: 800, color: pct === 100 ? P.gr : P.a, fontFamily: FN.m }}>{Math.round(pct)}%</div><div style={{ fontSize: 12, color: P.t3, fontFamily: FN.m }}>{done.length}/{ex.length}</div></div>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,.05)", borderRadius: 5, overflow: "hidden", marginTop: -8 }}><div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? `linear-gradient(90deg,${P.gr},${P.cy})` : `linear-gradient(90deg,${P.a},${P.pu})`, borderRadius: 5, transition: "width 1s cubic-bezier(.16,1,.3,1)" }} /></div>
        {s.wk.length > 1 && <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>{s.wk.map(wk => <button key={wk.id} onClick={() => { setSW(wk); setDone([]); }} style={{ padding: "10px 18px", borderRadius: 14, border: "none", background: (sW?.id || s.wk[0].id) === wk.id ? `${P.a}1A` : P.cd, color: (sW?.id || s.wk[0].id) === wk.id ? P.a : P.t3, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{wk.nm.split("—")[0].trim()}</button>)}</div>}
        {aR && rT > 0 && <Cd style={{ padding: 22, border: `1px solid ${P.cy}28`, background: `${P.cy}06`, textAlign: "center", animation: "si .3s" }}><div style={{ fontSize: 12, color: P.cy, fontWeight: 700, fontFamily: FN.m, marginBottom: 10, letterSpacing: ".14em" }}>DESCANSO</div><div style={{ fontSize: 48, fontWeight: 800, color: P.cy, fontFamily: FN.m }}>{Math.floor(rT / 60)}:{(rT % 60).toString().padStart(2, "0")}</div><button onClick={() => { setAR(false); setRT(0); }} style={{ marginTop: 14, background: "none", border: "none", color: P.t3, fontSize: 14, cursor: "pointer", fontWeight: 600 }}>Pular →</button></Cd>}
        {ex.map((e, i) => { const dn = done.includes(e.id); return (
          <div key={e.id} style={{ background: dn ? `${P.a}06` : P.cd, border: dn ? `1px solid ${P.a}22` : `1px solid ${P.bd}`, borderRadius: 24, padding: "18px 20px", transition: "all .4s", animation: `fu .5s ${.12 + i * .08}s both`, opacity: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, cursor: "pointer" }} onClick={() => { if (dn) return; setDone(p => [...p, e.id]); setXP(p => p + 25); setRT(parseInt(e.rs) || 90); setAR(true); if (done.length + 1 === ex.length) setTimeout(() => setSLU(true), 600); }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: dn ? `linear-gradient(135deg,${P.a},${P.pu})` : P.cd, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: dn ? `0 6px 20px ${P.a}28` : "none", flexShrink: 0, border: dn ? "none" : `1px solid ${P.bd}` }}>{dn ? <I.Ck /> : <span style={{ fontSize: 15, fontWeight: 800, color: P.t3, fontFamily: FN.m }}>{i + 1}</span>}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, textDecoration: dn ? "line-through" : "none", opacity: dn ? .5 : 1 }}>{e.nm}</div>
                <div style={{ display: "flex", gap: 12, marginTop: 5, flexWrap: "wrap" }}><span style={{ fontSize: 12, color: P.t3, fontFamily: FN.m }}>{e.st}</span>{e.wt && e.wt !== "—" && <span style={{ fontSize: 12, color: P.a, fontWeight: 600 }}>{e.wt}</span>}<span style={{ fontSize: 12, color: P.t4 }}>{e.rs}</span>{e.mu && <span style={{ fontSize: 12, color: P.cy, background: `${P.cy}0E`, fontWeight: 500, padding: "2px 8px", borderRadius: 6 }}>{e.mu}</span>}</div>
              </div>
              {dn && <span style={{ fontSize: 12, color: P.a, fontWeight: 700, background: `${P.a}14`, padding: "5px 12px", borderRadius: 8, fontFamily: FN.m, flexShrink: 0 }}>+25</span>}
            </div>
            {!dn && <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${P.bd}` }}><button onClick={(ev) => { ev.stopPropagation(); show("Carga atualizada! 💪"); }} style={{ width: "100%", background: P.hv, border: `1px solid ${P.bd}`, borderRadius: 12, padding: "10px 0", color: P.t2, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><I.Ed s={14} /> Atualizar Carga</button></div>}
          </div>
        ); })}
        {pct === 100 && <Cd style={{ padding: 28, border: `1px solid ${P.gr}28`, background: `${P.gr}08`, textAlign: "center", animation: "si .5s" }}><div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div><div style={{ fontSize: 20, fontWeight: 800, color: P.gr }}>Treino Finalizado!</div><div style={{ fontSize: 14, color: P.t2, marginTop: 6 }}>+{ex.length * 25} XP conquistados</div></Cd>}
      </div>
    );
  };

  // ═══ STUDENT PHOTOS ═══
  const SPhotos = () => {
    const s = cSt; if (!s) return null;
    const ph = photos[s.id] || []; const pp = profPh[s.id];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 26, fontWeight: 800 }}>Minhas Fotos 📸</h2>
          <label style={{ background: `linear-gradient(135deg,${P.a},${P.pu})`, borderRadius: 14, padding: "10px 18px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: `0 6px 20px ${P.a}30` }}><I.Cm /> Adicionar<input type="file" accept="image/*" onChange={(e) => handlePhoto(e, "evolution", s.id)} style={{ display: "none" }} /></label>
        </div>
        {/* Profile */}
        <Cd style={{ display: "flex", alignItems: "center", gap: 18, padding: 18 }}>
          <div style={{ width: 76, height: 76, borderRadius: 22, background: pp ? "transparent" : `linear-gradient(135deg,${P.a}30,${P.pu}15)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, overflow: "hidden", flexShrink: 0, border: `3px solid ${P.a}40` }}>{pp ? <img src={pp} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : s.av}</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Foto de Perfil</div><label style={{ fontSize: 14, color: P.a, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}><I.Cm /> {pp ? "Trocar foto" : "Adicionar foto"}<input type="file" accept="image/*" onChange={(e) => handlePhoto(e, "profile", s.id)} style={{ display: "none" }} /></label></div>
        </Cd>
        {/* Quick labels */}
        <div style={{ display: "flex", gap: 10 }}>{["Frente","Costas","Lateral"].map(lb => <label key={lb} style={{ flex: 1, padding: "14px 10px", borderRadius: 16, textAlign: "center", background: P.cd, border: `1px solid ${P.bd}`, cursor: "pointer", fontSize: 13, fontWeight: 600, color: P.t2 }}>📷 {lb}<input type="file" accept="image/*" onChange={(e) => handlePhoto(e, "evolution", s.id)} style={{ display: "none" }} /></label>)}</div>
        {/* Gallery */}
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Galeria de Evolução</h3>
        <div style={{ fontSize: 13, color: P.t3, marginBottom: 12 }}>Registre seu progresso com fotos regulares — compare frente, costas e lateral ao longo dos meses</div>
        {ph.length === 0 ? (
          <Cd style={{ textAlign: "center", padding: 44 }}><span style={{ fontSize: 52, display: "block", marginBottom: 14 }}>📷</span><p style={{ fontSize: 15, fontWeight: 600, marginBottom: 5 }}>Nenhuma foto ainda</p><p style={{ fontSize: 13, color: P.t2 }}>Adicione fotos para acompanhar sua evolução!</p></Cd>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{ph.map((p, i) => (
            <div key={i} style={{ background: P.cd, border: `1px solid ${P.bd}`, borderRadius: 20, overflow: "hidden", animation: `fu .4s ${i * .08}s both` }}>
              <div style={{ height: 170, background: `url(${p.src}) center/cover` }} />
              <div style={{ padding: 14 }}><div style={{ fontSize: 14, fontWeight: 700 }}>{p.lb}</div><div style={{ fontSize: 12, color: P.t3, marginTop: 3 }}>{p.dt}</div></div>
            </div>
          ))}</div>
        )}
      </div>
    );
  };

  // ═══ STUDENT EVOLUTION ═══
  const SEvol = () => {
    const s = cSt; if (!s) return null;
    const pct = Math.round((s.xp / s.xn) * 100); const tl = TT[Math.min(Math.floor(s.lv / 2), TT.length - 1)];
    const achs = [{i:"🔥",n:"Em Chamas",d:s.sk>=7,p:Math.min(s.sk,7),m:7,c:P.a},{i:"💪",n:"Consistente",d:s.pg>=80,p:s.pg,m:80,c:P.gr},{i:"📅",n:"14 Dias",d:s.sk>=14,p:Math.min(s.sk,14),m:14,c:P.cy},{i:"⚡",n:"Nível 10",d:s.lv>=10,p:Math.min(s.lv,10),m:10,c:P.pu},{i:"🏆",n:"Veterano",d:s.lv>=15,p:Math.min(s.lv,15),m:15,c:P.go}];
    const mis = [{t:"Completar treino",d:s.lw==="Hoje",xp:25,i:"🎯"},{t:"Manter streak",d:s.sk>0,xp:15,i:"🔥"},{t:"Registrar evolução",d:s.wt!=="—",xp:20,i:"📊"}];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800 }}>Evolução 🚀</h2>
        <Cd style={{ padding: 24, background: `linear-gradient(135deg,${P.a}0C,${P.pu}08)`, border: `1px solid ${P.a}22` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><span style={{ background: `linear-gradient(135deg,${P.a},${P.pu})`, borderRadius: 12, padding: "6px 16px", fontSize: 16, fontWeight: 800, fontFamily: FN.m }}>LVL {s.lv}</span><span style={{ fontSize: 15, fontWeight: 700, color: P.t2 }}>{tl}</span></div><div style={{ display: "flex", alignItems: "center", gap: 8 }}><I.Zp /><span style={{ fontSize: 30, fontWeight: 800 }}>{s.xp.toLocaleString()}</span><span style={{ fontSize: 14, color: P.t2 }}>/ {s.xn.toLocaleString()}</span></div></div>
            <div style={{ width: 68, height: 68, borderRadius: 20, background: `linear-gradient(135deg,${P.a}22,${P.pu}14)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, animation: "fl 3s ease-in-out infinite" }}>{s.lv >= 15 ? "👑" : s.lv >= 10 ? "⚔️" : "💪"}</div>
          </div>
          <div style={{ height: 12, background: "rgba(255,255,255,.07)", borderRadius: 8, overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${P.a},${P.pu})`, borderRadius: 8 }} /></div>
        </Cd>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[{ icon: "🔥", label: "Streak", value: `${s.sk}d`, color: s.sk > 0 ? P.a : P.re }, { icon: "🏅", label: "Conquistas", value: `${achs.filter(a => a.d).length}/${achs.length}`, color: P.go }, { icon: "🎯", label: "Aderência", value: `${s.pg}%`, color: s.pg >= 80 ? P.gr : P.cy }].map((st, i) => (
            <Cd key={i} style={{ padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{st.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: st.color, fontFamily: FN.m }}>{st.value}</div>
              <div style={{ fontSize: 12, color: P.t3, marginTop: 3 }}>{st.label}</div>
            </Cd>
          ))}
        </div>

        {/* Missions */}
        <Cd style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><h3 style={{ fontSize: 16, fontWeight: 700 }}>Missões do Dia</h3><span style={{ fontSize: 13, color: mis.filter(m=>m.d).length===mis.length?P.gr:P.a, fontWeight: 700 }}>{mis.filter(m=>m.d).length}/{mis.length} ✓</span></div>
          {mis.map((m, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < mis.length - 1 ? `1px solid ${P.bd}` : "none", opacity: m.d ? 1 : .5 }}><div style={{ width: 40, height: 40, borderRadius: 12, background: m.d ? `${P.a}15` : P.cd, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{m.d ? "✅" : m.i}</div><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, textDecoration: m.d ? "line-through" : "none" }}>{m.t}</div><div style={{ fontSize: 12, color: m.d ? P.gr : P.t3, marginTop: 2 }}>+{m.xp} XP</div></div></div>)}
        </Cd>
        {/* Achievements */}
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Conquistas</h3>
        {achs.map((a, i) => { const pg = Math.min(Math.round((a.p / a.m) * 100), 100); return (
          <Cd key={i} style={{ padding: 18, marginBottom: 10, border: a.d ? `1px solid ${a.c}30` : undefined, background: a.d ? `${a.c}06` : undefined, opacity: a.d ? 1 : .6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: a.d ? `${a.c}1A` : P.cd, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, filter: a.d ? "none" : "grayscale(.5)" }}>{a.i}</div>
              <div style={{ flex: 1 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 15, fontWeight: 700 }}>{a.n}</span>{a.d && <span style={{ fontSize: 12, color: P.gr, fontWeight: 700, background: `${P.gr}14`, padding: "3px 12px", borderRadius: 8 }}>✓</span>}</div><div style={{ height: 6, background: "rgba(255,255,255,.06)", borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", width: `${pg}%`, background: a.d ? a.c : `${a.c}70`, borderRadius: 4 }} /></div><div style={{ fontSize: 11, color: P.t3, marginTop: 5, fontFamily: FN.m }}>{a.p}/{a.m}</div></div>
            </div>
          </Cd>
        ); })}
      </div>
    );
  };

  // ═══ STUDENT PROGRESS ═══
  const SProg = () => {
    const s = cSt; if (!s) return null;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800 }}>Progresso</h2>
        <div style={{ display: "flex", justifyContent: "space-around", background: P.cd, border: `1px solid ${P.bd}`, borderRadius: 24, padding: 12 }}><Ring value={s.pg} max={100} color={P.a} label="Aderência" sub="%" /><Ring value={s.sk} max={30} color={P.cy} label="Streak" sub="dias" /><Ring value={s.lv} max={20} color={P.pu} label="Nível" /></div>
        <Cd style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}><h3 style={{ fontSize: 18, fontWeight: 700 }}>Composição Corporal</h3><button onClick={() => show("Medidas atualizadas! 📊")} style={{ background: `${P.a}10`, border: `1px solid ${P.a}20`, borderRadius: 12, padding: "8px 14px", color: P.a, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}><I.Ed s={14} /> Atualizar</button></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{[{l:"Peso",v:s.wt,i:"⚖️"},{l:"% Gordura",v:s.bf,i:"📊"},{l:"Massa Magra",v:s.lm,i:"💪"},{l:"Frequência",v:s.fq,i:"📅"}].map((m,i) => <div key={i} style={{ background: P.hv, borderRadius: 20, padding: 18, border: `1px solid ${P.bd}` }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><span style={{ fontSize: 18 }}>{m.i}</span><span style={{ fontSize: 13, color: P.t3 }}>{m.l}</span></div><div style={{ fontSize: 22, fontWeight: 800 }}>{m.v}</div></div>)}</div>
        </Cd>
        <Cd style={{ padding: 22 }}><h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Treinos no Mês</h3><div style={{ fontSize: 12, color: P.t3, marginBottom: 16 }}>Sessões completadas por semana</div><Bars data={[{l:"Sem 1",v:3},{l:"Sem 2",v:4},{l:"Sem 3",v:3},{l:"Sem 4",v:5}]} color={P.cy} h={95} /><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:14,paddingTop:14,borderTop:`1px solid ${P.bd}`}}><div><span style={{fontSize:13,color:P.t3}}>Total: </span><span style={{fontSize:15,fontWeight:800,color:P.cy}}>15 treinos</span></div><div><span style={{fontSize:13,color:P.t3}}>Média: </span><span style={{fontSize:15,fontWeight:800,color:P.t1}}>3.8x/sem</span></div></div></Cd>
      </div>
    );
  };

  // ═══ TRAINER: Students + Schedule + Finance + Settings + Detail (condensed) ═══
  const TStd = () => { const f = ST.filter(s => flt==="Todos"?true:flt==="Ativos"?s.lw==="Hoje":flt==="Inativos"?s.sk===0:s.pg>=80); return <div style={{display:"flex",flexDirection:"column",gap:20}}><h2 style={{fontSize:26,fontWeight:800}}>Meus Alunos</h2><div style={{display:"flex",gap:10,overflowX:"auto"}}>{["Todos","Ativos","Inativos","Top"].map(t=><button key={t} onClick={()=>setFlt(t)} style={{background:flt===t?`${P.a}1A`:P.cd,border:`1px solid ${flt===t?P.a+"40":P.bd}`,borderRadius:22,padding:"8px 18px",color:flt===t?P.a:P.t2,fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{t}</button>)}</div>{f.map((s,i)=>{const c=sc(s.id);const pl=PLANS.find(p=>p.id===s.pl);return <Cd key={s.id} onClick={()=>{setSel(s);setPg("detail")}} style={{display:"flex",alignItems:"center",gap:18,padding:20,animation:`fu .5s ${i*.06}s both`,cursor:"pointer"}}><Avatar id={s.id} av={s.av} sz={54}/><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}><span style={{fontSize:16,fontWeight:700}}>{s.nm}</span>{pl&&<span style={{fontSize:11,fontWeight:600,background:`${pl.c}14`,border:`1px solid ${pl.c}22`,borderRadius:8,padding:"3px 10px",color:pl.c}}>{pl.ic} {pl.nm}</span>}</div><div style={{display:"flex",gap:14}}>{s.sk>0&&<span style={{fontSize:13,color:P.a,display:"flex",alignItems:"center",gap:4,fontWeight:600}}><I.Fr/> {s.sk}d</span>}<span style={{fontSize:13,color:P.t3}}>{s.lw}</span></div></div><div style={{fontSize:18,fontWeight:800,color:s.pg>=80?P.gr:P.a,fontFamily:FN.m}}>{s.pg}%</div></Cd>})}</div>; };

  const TSch = () => { const nowH = new Date().getHours(); return <div style={{display:"flex",flexDirection:"column",gap:20}}><h2 style={{fontSize:26,fontWeight:800}}>Agenda</h2><div style={{fontSize:13,color:P.t2,marginTop:-8,marginBottom:4}}>Gerencie horários dos seus alunos · {HOURS.filter(h=>ST.find(s=>(s.sl||[]).includes(`${sDay}-${h}`))).length} aulas {sDay}</div><div style={{display:"flex",gap:6,overflowX:"auto"}}>{DAYS.map(d=><button key={d} onClick={()=>setSDay(d)} style={{padding:"11px 20px",borderRadius:14,border:"none",background:sDay===d?`${P.a}1A`:P.cd,color:sDay===d?P.a:P.t2,fontSize:14,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{d}</button>)}</div>{HOURS.map(h=>{const k=`${sDay}-${h}`;const ow=ST.find(s=>(s.sl||[]).includes(k));const bl=h===12;const c=ow?sc(ow.id):null;const pl=ow?PLANS.find(p=>p.id===ow.pl):null;return <Cd key={h} style={{padding:18,display:"flex",alignItems:"center",gap:18,border:bl?`1px solid ${P.re}22`:ow?`1px solid ${c}22`:`1px solid ${P.bd}`,background:bl?`${P.re}04`:ow?`${c}04`:P.cd}}><div style={{width:56,textAlign:"center",flexShrink:0}}><div style={{fontSize:18,fontWeight:800,color:bl?P.re:ow?c:P.t4,fontFamily:FN.m}}>{h}:00</div><div style={{fontSize:11,color:P.t4,fontFamily:FN.m}}>{h+1}:00</div></div><div style={{flex:1}}>{bl?<div style={{fontSize:15,fontWeight:600,color:P.re}}>🔒 Bloqueado</div>:ow?<div><div style={{fontSize:15,fontWeight:700}}>{ow.nm}</div><div style={{fontSize:13,color:P.t2,marginTop:2}}>{pl?.ic} {pl?.nm} · {ow.gl}</div></div>:<div style={{fontSize:14,color:P.t4}}>Disponível</div>}</div>{ow&&<button onClick={()=>{setSel(ow);setPg("detail")}} style={{background:P.cd,border:"none",borderRadius:12,padding:"9px 16px",cursor:"pointer",color:P.a,fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>Ver</button>}</Cd>})}</div>; };

  const TFin = () => { const tk=ST.length>0?Math.round(rev/ST.length):0;const pc=PLANS.map(p=>({...p,ct:ST.filter(s=>s.pl===p.id).length}));const mt=8000;const mp=Math.min(Math.round((rev/mt)*100),100);return <div style={{display:"flex",flexDirection:"column",gap:20}}><h2 style={{fontSize:26,fontWeight:800}}>Financeiro</h2><Cd style={{padding:0,overflow:"hidden",border:`1px solid ${P.gr}16`,background:`linear-gradient(135deg,${P.gr}08,${P.cy}04,${P.bg})`}}><div style={{padding:"26px 24px 22px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}><div><div style={{fontSize:12,color:P.t3,fontFamily:FN.m,marginBottom:10,letterSpacing:".1em"}}>RECEITA MENSAL</div><span style={{fontSize:44,fontWeight:800,color:P.gr,fontFamily:FN.m}}>R$<An value={rev}/></span></div><div style={{background:`${P.gr}12`,border:`1px solid ${P.gr}22`,borderRadius:12,padding:"6px 12px",display:"flex",alignItems:"center",gap:4,height:"fit-content"}}><I.Tu s={13}/><span style={{fontSize:14,fontWeight:800,color:P.gr,fontFamily:FN.m}}>+18%</span></div></div><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:11,color:P.t3,fontFamily:FN.m}}>META R${mt.toLocaleString()}</span><span style={{fontSize:11,color:P.gr,fontWeight:700,fontFamily:FN.m}}>{mp}%</span></div><div style={{height:5,background:"rgba(255,255,255,.05)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${mp}%`,background:`linear-gradient(90deg,${P.gr},${P.cy})`,borderRadius:4}}/></div></div></Cd><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>{[{l:"R$/Hora",v:"R$62",c:P.a},{l:"Horas/Sem",v:"11h",c:P.cy},{l:"Capacidade",v:"42%",c:P.pu}].map((k,i)=><Cd key={i} style={{padding:16,textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:k.c,fontFamily:FN.m}}>{k.v}</div><div style={{fontSize:12,color:P.t3,marginTop:4}}>{k.l}</div></Cd>)}</div><Cd style={{padding:22}}><h4 style={{fontSize:17,fontWeight:700,marginBottom:18}}>Por Plano</h4><div style={{display:"flex",gap:12,marginBottom:18}}>{pc.map(p=><div key={p.id} style={{flex:1,textAlign:"center",padding:"18px 10px",borderRadius:20,border:`1px solid ${p.c}14`,background:`linear-gradient(135deg,${p.c}08,transparent)`}}><div style={{fontSize:26,marginBottom:8}}>{p.ic}</div><div style={{fontSize:26,fontWeight:800,color:p.c,fontFamily:FN.m}}>{p.ct}</div><div style={{fontSize:12,color:P.t3,marginTop:4}}>{p.nm}</div><div style={{fontSize:13,fontWeight:700,color:p.c,marginTop:6,fontFamily:FN.m}}>R${p.pr}</div></div>)}</div>{pc.map(p=>{const r=p.ct*p.pr;const pct=rev>0?(r/rev)*100:0;return <div key={p.id} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,fontWeight:600}}>{p.ic} {p.nm} ({p.ct})</span><span style={{fontSize:14,fontWeight:800,color:p.c,fontFamily:FN.m}}>R${r}</span></div><div style={{height:7,background:"rgba(255,255,255,.05)",borderRadius:5,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:p.c,borderRadius:5,transition:"width 1.4s cubic-bezier(.16,1,.3,1)"}}/></div></div>})}</Cd><Cd style={{padding:22}}><h4 style={{fontSize:17,fontWeight:700,marginBottom:18}}>Evolução 6 Meses</h4><Bars data={[{l:"Out",v:4200},{l:"Nov",v:4800},{l:"Dez",v:5100},{l:"Jan",v:5400},{l:"Fev",v:5700},{l:"Mar",v:rev}]} color={P.gr} h={105} prefix="R$" /></Cd></div>; };

  const TSet = () => <div style={{display:"flex",flexDirection:"column",gap:22}}><h2 style={{fontSize:26,fontWeight:800}}>Configurações</h2><Cd><div style={{display:"flex",alignItems:"center",gap:20,marginBottom:24}}><label style={{position:"relative",cursor:"pointer"}}><div style={{width:72,height:72,borderRadius:24,background:profPh["trainer"]?"transparent":`linear-gradient(135deg,${P.a},${P.pu})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:26,overflow:"hidden"}}>{profPh["trainer"]?<img src={profPh["trainer"]} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:"PR"}</div><div style={{position:"absolute",bottom:-2,right:-2,width:24,height:24,borderRadius:12,background:P.a,border:`3px solid ${P.bg}`,display:"flex",alignItems:"center",justifyContent:"center"}}><I.Cm/></div><input type="file" accept="image/*" onChange={(e)=>handlePhoto(e,"profile","trainer")} style={{display:"none"}}/></label><div><div style={{fontSize:22,fontWeight:700}}>Prof. Ricardo</div><div style={{fontSize:14,color:P.t2,marginTop:3}}>Personal Trainer</div></div></div>{["Gerenciar Planos","Notificações","Editar Perfil","Ajuda"].map((x,i)=><div key={i} onClick={()=>show(`${x} — em breve!`)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 0",borderTop:`1px solid ${P.bd}`,cursor:"pointer"}}><span style={{fontSize:16,fontWeight:500}}>{x}</span><I.Ri/></div>)}</Cd><Bt danger full onClick={handleLogout}><I.Lo/> Sair da Conta</Bt></div>;

  const SDet = () => { const s=sel;if(!s) return null;const c=sc(s.id);const pl=PLANS.find(p=>p.id===s.pl);return <div style={{display:"flex",flexDirection:"column",gap:20}}><div style={{display:"flex",alignItems:"center",gap:14}}><button onClick={()=>{setSel(null);setPg("students")}} style={{background:P.cd,border:"none",borderRadius:16,width:46,height:46,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}><I.Le/></button><span style={{fontSize:16,color:P.t2}}>Perfil do Aluno</span></div><Cd style={{padding:0,overflow:"hidden"}}><div style={{height:100,background:`linear-gradient(135deg,${c}30,${P.pu}14)`}}/><div style={{padding:"0 24px 24px",marginTop:-44}}><div style={{display:"flex",alignItems:"flex-end",gap:18,marginBottom:20}}><Avatar id={s.id} av={s.av} sz={84}/><div style={{flex:1,paddingBottom:6}}><h2 style={{fontSize:24,fontWeight:800,marginBottom:6}}>{s.nm}</h2><div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}><span style={{background:`${c}1A`,borderRadius:12,padding:"4px 12px",fontSize:13,fontWeight:800,fontFamily:FN.m}}>LVL {s.lv}</span>{pl&&<span style={{fontSize:13,color:pl.c,fontWeight:600}}>{pl.ic} {pl.nm}</span>}</div></div></div><div style={{display:"flex",gap:10}}><Bt primary full onClick={()=>show("Editar treino — em breve!")}><I.Ed s={16}/> Editar Treino</Bt><Bt full onClick={()=>show("Chat — em breve!")}><I.Ms/> Mensagem</Bt></div></div></Cd><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>{[{l:"XP",v:s.xp.toLocaleString(),c:P.a},{l:"Streak",v:s.sk+"d",c:s.sk>0?P.gr:P.re},{l:"Aderência",v:s.pg+"%",c:s.pg>80?P.gr:P.a},{l:"Freq.",v:s.fq.split("/")[0],c:P.cy}].map((x,i)=><Cd key={i} style={{padding:16,textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:x.c,fontFamily:FN.m}}>{x.v}</div><div style={{fontSize:11,color:P.t3,marginTop:4}}>{x.l}</div></Cd>)}</div><Cd style={{padding:20}}><h4 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Composição</h4><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{[{l:"Peso",v:s.wt,i:"⚖️"},{l:"Gordura",v:s.bf,i:"📊"},{l:"Massa",v:s.lm,i:"💪"},{l:"Freq.",v:s.fq,i:"📅"}].map((m,i)=><div key={i} style={{background:P.hv,borderRadius:16,padding:14,border:`1px solid ${P.bd}`}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><span style={{fontSize:16}}>{m.i}</span><span style={{fontSize:12,color:P.t3}}>{m.l}</span></div><div style={{fontSize:18,fontWeight:800}}>{m.v}</div></div>)}</div></Cd>{s.sl?.length>0&&<Cd style={{padding:18}}><div style={{fontSize:16,fontWeight:700,marginBottom:12}}>📅 Horários</div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{s.sl.map(sl=>{const[d,h]=sl.split("-");return <span key={sl} style={{background:`${P.cy}12`,border:`1px solid ${P.cy}22`,borderRadius:12,padding:"6px 14px",fontSize:13,fontWeight:600,color:P.cy,fontFamily:FN.m}}>{d} {h}:00</span>})}</div></Cd>}<Cd style={{padding:22}}><h4 style={{fontSize:16,fontWeight:700,marginBottom:18}}>Desempenho</h4><Bars data={s.wp} color={c} h={75} unit="%" /></Cd>{s.wk.map((w,wi)=><Cd key={wi} style={{padding:0,overflow:"hidden"}}><div style={{padding:"18px 20px",background:`${c}08`,borderBottom:`1px solid ${P.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:16,fontWeight:700}}>{w.nm}</div><div style={{fontSize:13,color:P.t2,marginTop:3}}>{w.dy}</div></div></div>{w.ex.map((e,ei)=><div key={ei} style={{display:"flex",alignItems:"center",gap:16,padding:"14px 20px",borderBottom:ei<w.ex.length-1?`1px solid ${P.bd}`:"none"}}><div style={{width:34,height:34,borderRadius:12,background:`${c}14`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:c,fontFamily:FN.m}}>{ei+1}</div><div style={{flex:1}}><div style={{fontSize:15,fontWeight:600}}>{e.nm}</div><div style={{fontSize:13,color:P.t2,marginTop:3}}>{e.st} · {e.wt}</div></div></div>)}</Cd>)}</div>; };

  // ═══ ROUTER ═══
  const renderPage = () => {
    if (isTr) {
      if (pg === "detail" && sel) return <SDet />;
      switch (pg) { case "students": return <TStd />; case "schedule": return <TSch />; case "finance": return <TFin />; case "settings": return <TSet />; default: return <THome />; }
    }
    switch (pg) { case "workout": return <SWk />; case "evolucao": return <SEvol />; case "photos": return <SPhotos />; case "progress": return <SProg />; default: return <SHome />; }
  };

  // ═══ RENDER ═══
  return (
    <div style={{ fontFamily: FN.ui, background: P.bg, color: P.t1, minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{css}</style>
      <div style={{ position: "fixed", top: "-25%", right: "-15%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle,${P.a}08,transparent 55%)`, pointerEvents: "none", zIndex: 0, animation: "br 12s ease-in-out infinite" }} />
      <div style={{ position: "fixed", bottom: "-25%", left: "-15%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle,${P.pu}06,transparent 55%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", inset: 0, opacity: .025, backgroundImage: "radial-gradient(circle,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />

      <div className="fs" style={{ position: "relative", zIndex: 1, paddingBottom: 120, paddingTop: 22, paddingLeft: 20, paddingRight: 20, maxWidth: 520, margin: "0 auto", minHeight: "100vh" }}>
        {renderPage()}
      </div>

      {/* Navigation */}
      <div className="fn" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(11,11,18,.92)", backdropFilter: "blur(30px) saturate(200%)", borderTop: "1px solid rgba(255,255,255,.06)", padding: "10px 0 14px", zIndex: 50 }}>
        <div className="fni" style={{ display: "flex", justifyContent: "space-around", maxWidth: 520, margin: "0 auto" }}>
          {nav.map(n => {
            const ac = pg === n.id && !sel;
            return (
              <button key={n.id} onClick={() => { setPg(n.id); setSel(null); setDone([]); setSW(null); }}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, color: ac ? P.a : P.t4, transition: "all .3s", padding: "5px 12px", position: "relative" }}>
                <div style={{ padding: 8, borderRadius: 16, background: ac ? `${P.a}14` : "transparent", transition: "all .3s", transform: ac ? "scale(1.08)" : "scale(1)" }}>{n.ic}</div>
                <span style={{ fontSize: 11, fontWeight: ac ? 700 : 400 }}>{n.l}</span>
                {ac && <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", width: 20, height: 3, borderRadius: 3, background: P.a }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Up */}
      {sLU && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.92)", backdropFilter: "blur(28px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, animation: "fi .3s" }} onClick={() => setSLU(false)}>
          <div style={{ background: "#0D0D18", borderRadius: 32, padding: 48, textAlign: "center", maxWidth: 380, border: `1px solid ${P.a}30`, boxShadow: `0 0 120px ${P.a}1A`, animation: "su .7s cubic-bezier(.16,1,.3,1)" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 72, animation: "fl 3s ease-in-out infinite", lineHeight: 1, marginBottom: 28 }}>🏆</div>
            <h2 style={{ fontSize: 30, fontWeight: 800, background: `linear-gradient(135deg,${P.a},${P.pu})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TREINO COMPLETO!</h2>
            <p style={{ fontSize: 15, color: P.t2, margin: "14px 0 32px", lineHeight: 1.6 }}>Mais um passo na sua evolução</p>
            <div style={{ fontSize: 34, fontWeight: 800, color: P.a, fontFamily: FN.m, marginBottom: 28 }}>+{(cSt?.wk[0]?.ex.length || 5) * 25} XP</div>
            <Bt primary full onClick={() => setSLU(false)} style={{ padding: 16, fontSize: 16 }}>Continuar →</Bt>
          </div>
        </div>
      )}

      {/* Toast */}
      {/* Login Modal */}
      {modal && (modal === "login-trainer" || modal === "login-student") && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, animation: "fi .3s", padding: 20 }} onClick={() => setModal(null)}>
          <div style={{ background: "#0D0D18", borderRadius: 28, padding: 32, width: "100%", maxWidth: 400, border: `1px solid ${P.bd}`, animation: "su .6s cubic-bezier(.16,1,.3,1)" }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{modal === "login-trainer" ? "Área do Personal" : "Área do Aluno"}</h2>
            <p style={{ fontSize: 14, color: P.t2, marginBottom: 24 }}>{authMode === "login" ? "Entre na sua conta" : "Crie sua conta"}</p>
            
            {authMode === "register" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: P.t2, marginBottom: 8, display: "block" }}>Nome</label>
                <input type="text" value={authName} onChange={e => setAuthName(e.target.value)} placeholder="Seu nome"
                  style={{ width: "100%", padding: "14px 16px", background: P.ip, border: `1px solid ${P.bd}`, borderRadius: 18, color: P.t1, fontSize: 15, fontFamily: FN.ui, outline: "none", boxSizing: "border-box" }} />
              </div>
            )}
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: P.t2, marginBottom: 8, display: "block" }}>Email</label>
              <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="seu@email.com"
                style={{ width: "100%", padding: "14px 16px", background: P.ip, border: `1px solid ${P.bd}`, borderRadius: 18, color: P.t1, fontSize: 15, fontFamily: FN.ui, outline: "none", boxSizing: "border-box" }} />
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: P.t2, marginBottom: 8, display: "block" }}>Senha</label>
              <input type="password" value={authPass} onChange={e => setAuthPass(e.target.value)} placeholder="Sua senha"
                style={{ width: "100%", padding: "14px 16px", background: P.ip, border: `1px solid ${P.bd}`, borderRadius: 18, color: P.t1, fontSize: 15, fontFamily: FN.ui, outline: "none", boxSizing: "border-box" }} />
            </div>
            
            <button onClick={() => handleLogin(modal === "login-trainer" ? "trainer" : "student")} disabled={authLoading || !authEmail || !authPass}
              style={{ width: "100%", padding: "16px", borderRadius: 18, border: "none", background: authLoading ? P.t4 : `linear-gradient(135deg,${P.a},${P.pu})`, color: "#fff", fontSize: 16, fontWeight: 700, cursor: authLoading ? "wait" : "pointer", fontFamily: FN.ui, marginBottom: 16 }}>
              {authLoading ? "Carregando..." : authMode === "login" ? "Entrar" : "Criar Conta"}
            </button>
            
            <div style={{ textAlign: "center" }}>
              <button onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                style={{ background: "none", border: "none", color: P.a, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FN.ui }}>
                {authMode === "login" ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", top: 28, left: "50%", transform: "translateX(-50%)", background: "rgba(13,13,24,.95)", backdropFilter: "blur(28px)", border: `1px solid ${P.a}28`, borderRadius: 24, padding: "16px 32px", color: P.t1, fontWeight: 600, fontSize: 15, zIndex: 300, animation: "si .35s cubic-bezier(.16,1,.3,1)", boxShadow: `0 12px 48px rgba(0,0,0,.6)`, maxWidth: "90%", textAlign: "center", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: P.a, flexShrink: 0 }} />{toast}
        </div>
      )}
    </div>
  );
}
