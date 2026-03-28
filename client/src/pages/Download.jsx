import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function Download() {
    const { token } = useParams()
    const [fileData, setFileData] = useState(null)
    const [status, setStatus] = useState('loading') // loading | ready | expired | error

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/files/${token}`
                )
                setFileData(response.data)
                setStatus('ready')
            } catch (err) {
                const msg = err.response?.data?.error
                if (msg === 'This link has expired' || msg === 'Download limit reached') {
                    setStatus('expired')
                } else {
                    setStatus('error')
                }
            }
        }

        fetchFile()
    }, [token])

    const handleDownload = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/files/${token}/download`
    }

    const formatSize = (bytes) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString()
    }

    if (status === 'loading') {
        return (
            <main className="max-w-lg mx-auto px-6 py-24 text-center">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-gray-400">Loading file info...</p>
            </main>
        )
    }

    if (status === 'expired') {
        return (
            <main className="max-w-lg mx-auto px-6 py-24 text-center">
                <div className="text-4xl mb-4">⏰</div>
                <h2 className="text-xl font-semibold text-white mb-2">Link Expired</h2>
                <p className="text-gray-400 text-sm">This file has expired or reached its download limit.</p>
                <a href="/" className="inline-block mt-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm transition">
                    Upload a new file
                </a>
            </main>
        )
    }

    if (status === 'error') {
        return (
            <main className="max-w-lg mx-auto px-6 py-24 text-center">
                <div className="text-4xl mb-4">❌</div>
                <h2 className="text-xl font-semibold text-white mb-2">File Not Found</h2>
                <p className="text-gray-400 text-sm">This link doesn't exist or has been deleted.</p>
                <a href="/" className="inline-block mt-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm transition">
                    Upload a file
                </a>
            </main>
        )
    }

    return (
        <main className="max-w-lg mx-auto px-6 py-24 space-y-6">
            <div className="text-center space-y-2">
                <div className="text-5xl mb-4">📦</div>
                <h1 className="text-2xl font-bold text-white">Your file is ready</h1>
                <p className="text-gray-400 text-sm">Someone shared a file with you via FileDrop</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-800 rounded-xl p-3 text-2xl">📄</div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{fileData.fileName}</p>
                        <p className="text-sm text-gray-400">{formatSize(fileData.fileSize)}</p>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="text-gray-500">Expires</p>
                        <p className="text-gray-300">{formatDate(fileData.expiresAt)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Downloads left</p>
                        <p className="text-gray-300">{fileData.maxDownloads - fileData.downloadCount} of {fileData.maxDownloads}</p>
                    </div>
                </div>

                <button
                    onClick={handleDownload}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                    <span>⬇️</span>
                    Download File
                </button>
            </div>

            <p className="text-center text-xs text-gray-600">
                Want to share your own files?{' '}
                <a href="/" className="text-blue-400 hover:text-blue-300">
                    Upload on FileDrop
                </a>
            </p>
        </main>
    )
}

export default Download