import { createContext, useContext, useEffect, useState } from 'react'
import supabase from '../supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get current session on load
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes (login, logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password })
        return { data, error }
    }

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        return { data, error }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}