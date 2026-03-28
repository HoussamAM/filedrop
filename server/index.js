import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import uploadRouter from './routes/upload.js'
import filesRouter from './routes/files.js'
import { cleanupExpiredFiles } from './utils/cleanup.js'
import helmet from 'helmet'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://filedrop-gules.vercel.app',
        /https:\/\/filedrop-.*-houssamams-projects\.vercel\.app/
    ]
}))
app.use(express.json())

// Routes
app.use('/api/upload', uploadRouter)
app.use('/api/files', filesRouter)

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'FileDrop API is running' })
})

// Run cleanup every 24 hours
cleanupExpiredFiles() // run once on startup
setInterval(cleanupExpiredFiles, 24 * 60 * 60 * 1000)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.use(helmet())