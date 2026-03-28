import supabase from '../supabase.js'

export const cleanupExpiredFiles = async () => {
    try {
        console.log('Running cleanup job...')

        // Find all expired files
        const { data: expiredFiles, error: fetchError } = await supabase
            .from('files')
            .select('*')
            .lt('expires_at', new Date().toISOString())
            .not('expires_at', 'is', null)

        if (fetchError) throw fetchError

        if (expiredFiles.length === 0) {
            console.log('No expired files to clean up')
            return
        }

        console.log(`Found ${expiredFiles.length} expired files`)

        // Delete from storage
        const storagePaths = expiredFiles.map(f => f.storage_path)
        const { error: storageError } = await supabase.storage
            .from('files')
            .remove(storagePaths)

        if (storageError) throw storageError

        // Delete from database
        const ids = expiredFiles.map(f => f.id)
        const { error: dbError } = await supabase
            .from('files')
            .delete()
            .in('id', ids)

        if (dbError) throw dbError

        console.log(`Cleaned up ${expiredFiles.length} expired files`)

    } catch (error) {
        console.error('Cleanup error:', error)
    }
}