import { authenticate } from '../middleware/auth.js'
import express from 'express'
import supabase from '../supabase.js'
import { downloadLimiter } from '../middleware/rateLimit.js'

const router = express.Router()

// Get file metadata by token
router.get('/:token', async (req, res) => {
    try {
        const { token } = req.params

        const { data: file, error } = await supabase
            .from('files')
            .select('*')
            .eq('share_token', token)
            .single()

        if (error || !file) {
            return res.status(404).json({ error: 'File not found' })
        }

        // Check if expired
        if (file.expires_at && new Date() > new Date(file.expires_at)) {
            return res.status(410).json({ error: 'This link has expired' })
        }

        // Check download limit
        if (file.max_downloads && file.download_count >= file.max_downloads) {
            return res.status(410).json({ error: 'Download limit reached' })
        }

        res.json({
            fileName: file.file_name,
            fileSize: file.file_size,
            fileType: file.file_type,
            expiresAt: file.expires_at,
            downloadCount: file.download_count,
            maxDownloads: file.max_downloads
        })

    } catch (error) {
        console.error('File fetch error:', error)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

// Download file by token
router.get('/:token/download', downloadLimiter, async (req, res) => {
    try {
        const { token } = req.params

        const { data: file, error } = await supabase
            .from('files')
            .select('*')
            .eq('share_token', token)
            .single()

        if (error || !file) {
            return res.status(404).json({ error: 'File not found' })
        }

        // Check expiry and download limit
        if (file.expires_at && new Date() > new Date(file.expires_at)) {
            return res.status(410).json({ error: 'This link has expired' })
        }

        if (file.max_downloads && file.download_count >= file.max_downloads) {
            return res.status(410).json({ error: 'Download limit reached' })
        }

        // Debug logs
        console.log('Storage path:', file.storage_path)
        console.log('Supabase URL:', process.env.SUPABASE_URL)

        // Generate signed URL (valid for 60 seconds)
        const { data: signedData, error: signedError } = await supabase.storage
            .from('files')
            .createSignedUrl(file.storage_path, 60)

        console.log('Signed data:', signedData)
        console.log('Signed error:', signedError)

        if (signedError) throw signedError

        // Increment download count
        await supabase
            .from('files')
            .update({ download_count: file.download_count + 1 })
            .eq('id', file.id)

        // Redirect to signed URL
        res.redirect(signedData.signedUrl)

    } catch (error) {
        console.error('Download error:', error)
        res.status(500).json({ error: 'Download failed' })
    }
})
// Get all files for logged in user
router.get('/', authenticate, async (req, res) => {
    try {
        const { data: files, error } = await supabase
            .from('files')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false })

        if (error) throw error

        res.json(files)
    } catch (error) {
        console.error('Fetch files error:', error)
        res.status(500).json({ error: 'Failed to fetch files' })
    }
})

// Delete a file
router.delete('/:token', authenticate, async (req, res) => {
    try {
        const { token } = req.params

        const { data: file, error: fetchError } = await supabase
            .from('files')
            .select('*')
            .eq('share_token', token)
            .eq('user_id', req.user.id)
            .single()

        if (fetchError || !file) {
            return res.status(404).json({ error: 'File not found' })
        }

        // Delete from storage
        await supabase.storage
            .from('files')
            .remove([file.storage_path])

        // Delete from database
        await supabase
            .from('files')
            .delete()
            .eq('id', file.id)

        res.json({ message: 'File deleted successfully' })
    } catch (error) {
        console.error('Delete error:', error)
        res.status(500).json({ error: 'Failed to delete file' })
    }
})

export default router