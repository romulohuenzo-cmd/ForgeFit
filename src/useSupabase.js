import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

// Auth hook
export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (uid) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single()
    setProfile(data)
    setLoading(false)
  }

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async (email, password, name, role) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, password,
      options: { data: { name, role } }
    })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return { user, profile, loading, signIn, signUp, signOut }
}

// Students hook (for trainers)
export function useStudents(trainerId) {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!supabase || !trainerId) return
    const { data } = await supabase
      .from('students')
      .select('*, profiles(*), workouts(*)')
      .eq('trainer_id', trainerId)
      .order('created_at', { ascending: false })
    setStudents(data || [])
    setLoading(false)
  }, [trainerId])

  useEffect(() => { load() }, [load])

  const addStudent = async (email, name, planId) => {
    // First create user or find existing
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()
    
    if (existingProfiles) {
      // Link existing user as student
      const { error } = await supabase.from('students').insert({
        profile_id: existingProfiles.id,
        trainer_id: trainerId,
        plan_id: planId,
      })
      if (!error) await load()
      return { error }
    }
    return { error: { message: 'Aluno precisa criar conta primeiro' } }
  }

  return { students, loading, reload: load, addStudent }
}

// Workouts hook
export function useWorkouts(studentId) {
  const [workouts, setWorkouts] = useState([])

  useEffect(() => {
    if (!supabase || !studentId) return
    supabase
      .from('workouts')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setWorkouts(data || []))
  }, [studentId])

  const logWorkout = async (workoutId, exercises, xpEarned) => {
    if (!supabase) return
    await supabase.from('workout_logs').insert({
      student_id: studentId,
      workout_id: workoutId,
      exercises_completed: exercises,
      xp_earned: xpEarned,
      completed_at: new Date().toISOString(),
    })
  }

  return { workouts, logWorkout }
}

// Photos hook  
export function usePhotos(studentId) {
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    if (!supabase || !studentId) return
    supabase
      .from('progress_photos')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setPhotos(data || []))
  }, [studentId])

  const uploadPhoto = async (file, label) => {
    if (!supabase) return
    const fileName = `${studentId}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, file)
    
    if (uploadError) return { error: uploadError }

    const { data: { publicUrl } } = supabase.storage
      .from('photos')
      .getPublicUrl(fileName)

    const { error } = await supabase.from('progress_photos').insert({
      student_id: studentId,
      photo_url: publicUrl,
      label: label,
    })

    if (!error) {
      setPhotos(prev => [{ photo_url: publicUrl, label, created_at: new Date().toISOString() }, ...prev])
    }
    return { error }
  }

  const deletePhoto = async (photoId, photoUrl) => {
    if (!supabase) return
    const path = photoUrl.split('/photos/')[1]
    if (path) await supabase.storage.from('photos').remove([path])
    await supabase.from('progress_photos').delete().eq('id', photoId)
    setPhotos(prev => prev.filter(p => p.id !== photoId))
  }

  return { photos, uploadPhoto, deletePhoto }
}

// Profile update
export async function updateProfile(userId, updates) {
  if (!supabase) return
  return await supabase.from('profiles').update(updates).eq('id', userId)
}

// Profile photo upload
export async function uploadProfilePhoto(userId, file) {
  if (!supabase) return { error: 'No supabase' }
  const fileName = `avatars/${userId}-${Date.now()}`
  const { error: upErr } = await supabase.storage.from('photos').upload(fileName, file)
  if (upErr) return { error: upErr }
  const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(fileName)
  await supabase.from('profiles').update({ photo_url: publicUrl }).eq('id', userId)
  return { url: publicUrl }
}
