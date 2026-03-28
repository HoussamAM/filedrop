# FileDrop

A full stack file sharing app built with React, Node.js, and Supabase.

## Features

- Upload any file and get a shareable link instantly
- No account needed — anonymous uploads work out of the box
- Drag and drop interface with real time upload progress
- QR code generation for every share link
- Auto expiring links (24 hours for anonymous, 30 days for logged in users)
- Download limits (5 for anonymous, unlimited for logged in)
- Dashboard for logged in users to manage, copy and delete their files
- Rate limiting to prevent abuse
- Automatic cleanup of expired files

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router  
**Backend:** Node.js, Express  
**Database:** PostgreSQL (Supabase)  
**Storage:** Supabase Storage  
**Auth:** Supabase Auth  
**Hosting:** Vercel (frontend), Render (backend)

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase account

### Installation

1. Clone the repo
   git clone https://github.com/yourusername/filedrop.git
   cd filedrop

2. Set up the backend
   cd server
   npm install
   cp .env.example .env
   # Add your Supabase credentials to .env

3. Set up the frontend
   cd ../client
   npm install
   cp .env.example .env
   # Add your Supabase credentials to .env

4. Run the backend
   cd server
   npm run dev

5. Run the frontend
   cd client
   npm run dev

6. Open http://localhost:5173

## Environment Variables

### Server
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
CLIENT_URL=http://localhost:5173

### Client
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---