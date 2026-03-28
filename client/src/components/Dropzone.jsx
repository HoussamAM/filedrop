import { useState, useRef } from 'react'

function Dropzone({ onFileSelect }) {
    const [isDragging, setIsDragging] = useState(false)
    const inputRef = useRef(null)

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true)
        } else {
            setIsDragging(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) onFileSelect(file)
    }

    const handleChange = (e) => {
        const file = e.target.files[0]
        if (file) onFileSelect(file)
    }

    return (
        <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
            className={`
        border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all
        ${isDragging
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-500 hover:bg-gray-900'
                }
      `}
        >
            <div className="text-5xl mb-4">📂</div>
            <p className="text-lg text-gray-300 font-medium">
                Drag and drop your file here
            </p>
            <p className="text-sm text-gray-500 mt-2">
                or click to browse
            </p>
            <p className="text-xs text-gray-600 mt-4">
                Max 100MB — link expires in 24 hours
            </p>
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
            />
        </div>
    )
}

export default Dropzone