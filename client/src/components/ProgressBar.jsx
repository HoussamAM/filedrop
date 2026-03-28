function ProgressBar({ progress, fileName }) {
    return (
        <div className="w-full">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span className="truncate max-w-xs">{fileName}</span>
                <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
                {progress < 100 ? 'Uploading...' : 'Upload complete!'}
            </p>
        </div>
    )
}

export default ProgressBar