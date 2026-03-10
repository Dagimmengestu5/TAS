---
description: How to deploy Droga Group Hub (Frontend & Backend)
---

# Deployment Workflow

Follow these steps to deploy the Droga Group Hub to a production environment.

## Phase 1: Backend Deployment (Laravel)

1. **Server Requirements**:
   - PHP 8.2+
   - MySQL 8.0+
   - Composer
   - Nginx or Apache

2. **Clone and Install**:
   ```bash
   # Clone the repository to your server
   composer install --optimize-autoloader --no-dev
   ```

3. **Environment Setup**:
   - Copy `.env.example` to `.env`.
   - Update `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
   - Set `APP_ENV=production` and `APP_DEBUG=false`.
   - Set `APP_URL` to your production domain.
   - Set `FRONTEND_URL` to your React app domain.
   - Run `php artisan key:generate`.

4. **Production Optimization**:
   ```bash
   php artisan migrate --force
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan storage:link
   ```

## Phase 2: Frontend Deployment (React/Vite)

1. **Build Static Assets**:
   ```bash
   cd frontend
   npm install
   # Create a .env file in the frontend folder
   # Add: VITE_API_URL=https://your-api-domain.com/api
   npm run build
   ```

2. **Host Static Files**:
   - Upload the contents of `frontend/dist` to your static hosting provider (Vercel, Netlify, or your Nginx `/var/www/html` folder).

## Phase 3: Final Integration

1. **CORS Configuration**:
   - Ensure `config/cors.php` in the backend allows the production domain of your frontend.

2. **File Permissions**:
   - Ensure `storage` and `bootstrap/cache` folders are writable by the web server.

3. **SSL/HTTPS**:
   - Always serve both frontend and backend over HTTPS.
