# Customer Management System - Setup Guide

## Prerequisites
- Node.js (v16+)
- Supabase account

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Customer-Management-System
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Supabase Database**

Run these SQL migrations in your Supabase SQL Editor in order:

- `db/migrations/001_add_customer_record_status.sql`
- `db/migrations/002_create_user_table.sql`
- `db/migrations/003_trigger_provision_user.sql`

Also run the Hope Inc. database schema (provided separately).

4. **Configure Environment Variables**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from:
- Supabase Dashboard → Settings → API → Project URL
- Supabase Dashboard → Settings → API → Project API keys → anon public

5. **Run the development server**
```bash
npm run dev
```

6. **Access the application**

Open `http://localhost:5173` in your browser.

## First Time Login

1. Register a new account at `/register`
2. Go to Supabase Dashboard → Table Editor → `user` table
3. Find your user and change `record_status` from `INACTIVE` to `ACTIVE`
4. Now you can login at `/login`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:run` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Tech Stack

- React 18
- Vite
- React Router v6
- Supabase (Auth + Database)
- Tailwind CSS
- Zod (validation)
