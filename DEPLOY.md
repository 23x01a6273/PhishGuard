# Deployment Guide

## 1. Frontend (Netlify)
This project is configured for Netlify deployment.

1. **Push to GitHub**: Make sure your code is in a GitHub repository.
2. **New Site from Git**: In Netlify, choose "Import from Git".
3. **Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. **Environment Variables**:
   - Go to **Site Settings > Environment Variables**.
   - Add `VITE_API_URL` with the URL of your deployed backend (e.g., `https://your-backend.onrender.com`).

## 2. Backend (Render / Railway)
Netlify handles static sites well, but for the Python/Flask backend, services like **Render** or **Railway** are recommended.

### Deploy to Render.com (Free Tier)
1. **New Web Service**: Connect your GitHub repo.
2. **Settings**:
   - **Root Directory**: `.` (or leave empty if it's the root)
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn backend.app:app`
   - **Environment Variables**:
     - `PYTHON_VERSION`: `3.9.0` (or similar)

### Important: CORS
The backend is currently configured to allow all origins (`CORS(app)`). In production, you might want to restrict this to your Netlify URL.

## 3. Tailwind CSS Issue
If you see an "Unknown at rule @theme" warning in your editor, **ignore it**. 
This project uses **Tailwind CSS v4**, and the `@theme` syntax is correct. The warning is just the editor not recognizing the newest syntax yet. The build will work perfectly.
