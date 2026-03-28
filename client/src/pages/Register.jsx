import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Register() {
    const { signUp } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (password !== confirm) {
            return setError('Passwords do not match')
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters')
        }

        setLoading(true)

        const { error } = await signUp(email, password)

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            navigate('/dashboard')
        }
    }

    return (
        <main className="max-w-md mx-auto px-6 py-24">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white">Create account</h1>
                <p className="text-gray-400 mt-2">Start sharing files with FileDrop</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-5">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Confirm Password</label>
                    <input
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                    />
                </div>

                {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
                >
                    {loading ? 'Creating account...' : 'Create account'}
                </button>

                <p className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-400 hover:text-blue-300">
                        Sign in
                    </a>
                </p>
            </div>
        </main>
    )
}

export default Register