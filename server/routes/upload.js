import express from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import supabase from '../supabase.js'
import generateToken from '../utils/generateToken.js'
import { uploadLimiter } from '../middleware/rateLimit.js'

const router = express.Router()

// Store file in memory temporarily before sending to Supabase
const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for anonymous
})

router.post('/', uploadLimiter, upload.single('file'), async (req, res) => {
    try {
        const file = req.file

        if (!file) {
            return res.status(400).json({ error: 'No file provided' })
        }

        // Check if user is logged in via Authorization header
        let userId = null
        const authHeader = req.headers.authorization

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1]
            const { data: { user } } = await supabase.auth.getUser(token)
            if (user) userId = user.id
        }

        // Different limits for logged in vs anonymous
        const isLoggedIn = !!userId
        const maxDownloads = isLoggedIn ? null : 5
        const expiresAt = new Date()

        if (isLoggedIn) {
            expiresAt.setDate(expiresAt.getDate() + 30) // 30 days for logged in
        } else {
            expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours for anonymous
        }

        const storagePath = `uploads/${uuidv4()}-${file.originalname}`

        const { error: storageError } = await supabase.storage
            .from('files')
            .upload(storagePath, file.buffer, {
                contentType: file.mimetype
            })

        if (storageError) throw storageError

        const shareToken = generateToken()

        const { data, error: dbError } = await supabase
            .from('files')
            .insert({
                file_name: file.originalname,
                file_size: file.size,
                file_type: file.mimetype,
                storage_path: storagePath,
                share_token: shareToken,
                expires_at: expiresAt,
                max_downloads: maxDownloads,
                user_id: userId
            })
            .select()
            .single()

        if (dbError) throw dbError

        res.status(201).json({
            message: 'File uploaded successfully',
            shareToken,
            shareLink: `${process.env.CLIENT_URL}/f/${shareToken}`,
            expiresAt,
            fileName: file.originalname,
            fileSize: file.size,
            isLoggedIn
        })

    } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({ error: 'Upload failed' })
    }
})

export default router