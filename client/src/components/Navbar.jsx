import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    return (
        <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
                <span className="text-2xl">📦</span>
                <span className="text-xl font-bold text-white">FileDrop</span>
            </a>
            <div className="flex gap-4 text-sm items-center">
                {user ? (
                    <>
                        <a
                            href="/dashboard"
                            className="text-gray-400 hover:text-white transition"
                        >
                            Dashboard
                        </a>
                        <button
                            onClick={handleSignOut}
                            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-1.5 rounded-lg transition"
                        >
                            Sign out
                        </button>
                    </>
                ) : (
                    <>
                        <a href="/login" className="text-gray-400 hover:text-white transition">
                            Login
                        </a>
                        <a
                            href="/register"
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg transition"
                        >
                            Sign up
                        </a>
                    </>
                )}
            </div >
        </nav >
    )
}

export default Navbar