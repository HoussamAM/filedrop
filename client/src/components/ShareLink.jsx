import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

function ShareLink({ shareData }) {
    const [copied, setCopied] = useState(false)
    const [showQR, setShowQR] = useState(false)

    const shareLink = `${window.location.origin}/f/${shareData.shareToken}`

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const formatSize = (bytes) => {
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString()
    }

    return (
        <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
                <span className="text-3xl">✅</span>
                <div>
                    <p className="font-semibold text-white">{shareData.fileName}</p>
                    <p className="text-sm text-gray-400">{formatSize(shareData.fileSize)}</p>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-3 flex items-center justify-between gap-3">
                <span className="text-sm text-gray-300 truncate">{shareLink}</span>
                <button
                    onClick={handleCopy}
                    className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-1.5 rounded-lg transition"
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>

            <button
                onClick={() => setShowQR(!showQR)}
                className="w-full border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white py-2 rounded-xl transition text-sm"
            >
                {showQR ? 'Hide QR Code' : 'Show QR Code'}
            </button>

            {showQR && (
                <div className="flex justify-center bg-white rounded-xl p-4">
                    <QRCodeSVG value={shareLink} size={180} />
                </div>
            )}

            <p className="text-xs text-gray-500">
                ⏰ Expires: {formatDate(shareData.expiresAt)}
                {shareData.maxDownloads && ` · Max ${shareData.maxDownloads} downloads`}
            </p>
        </div>
    )
}

export default ShareLink