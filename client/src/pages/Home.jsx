import supabase from '../supabase'
import { useState } from 'react'
import axios from 'axios'
import Dropzone from '../components/Dropzone'
import ProgressBar from '../components/Progressbar'
import ShareLink from '../components/Sharelink'

function Home() {
    const [file, setFile] = useState(null)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState('idle') // idle | uploading | done | error
    const [shareData, setShareData] = useState(null)
    const [error, setError] = useState(null)

    const handleFileSelect = (selectedFile) => {
        setFile(selectedFile)
        setStatus('idle')
        setShareData(null)
        setError(null)
    }

    const handleUpload = async () => {
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        setStatus('uploading')
        setProgress(0)
        setError(null)

        try {
            // Get session token if logged in
            const { data: { session } } = await supabase.auth.getSession()
            const headers = {}
            if (session) {
                headers.Authorization = `Bearer ${session.access_token}`
            }

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/upload`,
                formData,
                {
                    headers,
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        )
                        setProgress(percent)
                    }
                }
            )

            setShareData(response.data)
            setStatus('done')

        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed. Please try again.')
            setStatus('error')
        }
    }

    return (
        <main className="max-w-2xl mx-auto px-6 py-16 space-y-8">
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold text-white">
                    Share files, instantly
                </h1>
                <p className="text-gray-400">
                    Upload any file and get a shareable link in seconds. No account needed.
                </p>
            </div>

            {status === 'idle' && (
                <>
                    <Dropzone onFileSelect={handleFileSelect} />
                    {file && (
                        <div className="space-y-3">
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
                                <span className="text-2xl">📄</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setFile(null) }}
                                    className="text-gray-500 hover:text-red-400 transition"
                                >
                                    ✕
                                </button>
                            </div>
                            <button
                                onClick={handleUpload}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition"
                            >
                                Upload & Get Link
                            </button>
                        </div>
                    )}
                </>
            )}

            {status === 'uploading' && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                    <ProgressBar progress={progress} fileName={file.name} />
                </div>
            )}

            {status === 'done' && shareData && (
                <div className="space-y-4">
                    <ShareLink shareData={shareData} />
                    <button
                        onClick={() => { setFile(null); setStatus('idle'); setShareData(null) }}
                        className="w-full border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white py-3 rounded-xl transition text-sm"
                    >
                        Upload another file
                    </button>
                </div>
            )}

            {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm text-center">
                    {error}
                    <button
                        onClick={() => setStatus('idle')}
                        className="block mx-auto mt-2 underline hover:text-red-300"
                    >
                        Try again
                    </button>
                </div>
            )}
        </main>
    )
}

export default Home