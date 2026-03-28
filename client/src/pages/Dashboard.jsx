import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import supabase from '../supabase'

function Dashboard() {
    const { user } = useAuth()
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFiles()
    }, [])

    const fetchFiles = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/files`,
                { headers: { Authorization: `Bearer ${session.access_token}` } }
            )
            setFiles(response.data)
        } catch (err) {
            console.error('Failed to fetch files:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (token) => {
        try {
            const { data: { session } } = await supabase.auth.getSession()

            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/files/${token}`,
                { headers: { Authorization: `Bearer ${session.access_token}` } }
            )
            setFiles(files.filter(f => f.share_token !== token))
        } catch (err) {
            console.error('Failed to delete file:', err)
        }
    }

    const formatSize = (bytes) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString()
    }

    const copyLink = (token) => {
        navigator.clipboard.writeText(`${window.location.origin}/f/${token}`)
    }

    if (loading) {
        return (
            <main className="max-w-4xl mx-auto px-6 py-16 text-center">
                <p className="text-gray-400">Loading your files...</p>
            </main>
        )
    }

    return (
        <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Your Files</h1>
                    <p className="text-gray-400 text-sm mt-1">{user.email}</p>
                </div>

                <a
                    href="/"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-xl transition"
                >
                    Upload New File
                </a>
            </div>

            {
                files.length === 0 ? (
                    <div className="text-center py-24 border border-gray-800 rounded-2xl">
                        <div className="text-4xl mb-4">📭</div>
                        <p className="text-gray-400">No files uploaded yet</p>
                        <a href="/" className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm">
                            Upload your first file
                        </a>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4"
                            >
                                <div className="text-2xl">📄</div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-white truncate">{file.file_name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {formatSize(file.file_size)} · Uploaded {formatDate(file.created_at)} · {file.download_count} downloads
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => copyLink(file.share_token)}
                                        className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition"
                                    >
                                        Copy Link
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file.share_token)}
                                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </main >
    )
}

export default Dashboard