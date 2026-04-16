# File Sharing App - Server

Backend service for a full stack file sharing application. Handles file uploads, link generation, authentication, and cleanup using Supabase.

## Features

- REST API for file uploads and downloads
- Generates unique, shareable links
- Supports anonymous and authenticated users
- File expiration logic (24h anonymous, 30 days authenticated)
- Download limits enforcement
- Rate limiting for abuse prevention
- Automatic cleanup of expired files
- Integration with Supabase (database, storage, auth)

## Tech Stack

- Node.js
- Express
- PostgreSQL (Supabase)
- Supabase Storage
- Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/HoussamAM/filedrop.git
cd filedrop/server
npm install
