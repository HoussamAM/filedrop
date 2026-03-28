import rateLimit from 'express-rate-limit'

export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 10,                   // max 10 uploads per IP per hour
    message: { error: 'Too many uploads, please try again later' }
})

export const downloadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute window
    max: 50,                   // max 50 downloads per IP per 15 mins
    message: { error: 'Too many requests, please try again later' }
})