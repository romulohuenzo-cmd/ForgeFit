import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { supabase } from './supabase'
import AuthScreen from './AuthScreen.jsx'
import App from './App.jsx'

function Root() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      if (s?.user) loadProfile(s.user)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, s) => {
      setSession(s)
      if (s?.user) loadProfile(s.user)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (user) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) {
      setProfile(data)
    } else {
      // Profile doesn't exist yet — create from user metadata
      const meta = user.user_metadata || {}
      const newProfile = {
        id: user.id,
        name: meta.name || user.email.split('@')[0],
        email: user.email,
        role: meta.role || 'student',
      }
      await supabase.from('profiles').insert(newProfile)
      setProfile(newProfile)
    }
    setLoading(false)
  }

  const handleLogin = async (email, password) => {
    setAuthError(null)
    setAuthLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setAuthError(error.message === 'Invalid login credentials' ? 'Email ou senha incorretos' : error.message)
    setAuthLoading(false)
  }

  const handleSignUp = async (email, password, name, role) => {
    setAuthError(null)
    setAuthLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name, role } }
    })
    if (error) setAuthError(error.message)
    else setAuthError(null)
    setAuthLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }

  // Loading
  if (loading) return (
    <div style={{ fontFamily: "'Outfit',sans-serif", background: "#0B0B12", color: "#F1F1F4", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.07em" }}>FORGE<span style={{ color: "#FF7A45" }}>FIT</span></div>
      <div style={{ fontSize: 14, color: "#7A7A92" }}>Carregando...</div>
    </div>
  )

  // Not logged in
  if (!session || !profile) return (
    <AuthScreen onLogin={handleLogin} onSignUp={handleSignUp} error={authError} loading={authLoading} />
  )

  // Logged in — pass user data to App
  return <App supabaseUser={profile} onSignOut={handleSignOut} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
