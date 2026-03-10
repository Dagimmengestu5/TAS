# Final cPanel Deployment Guide (Integrated App)

Follow this guide to host both the **Frontend** and **Backend** together at:
`https://tas.netwebup.com/public/`

---

## 1. Prepare Backend
1.  **Environment**: Update your `.env` on cPanel with:
    ```env
    APP_URL=https://tas.netwebup.com/public
    FRONTEND_URL=https://tas.netwebup.com/public
    ```

## 2. Build & Prepare Frontend
1.  **Build**: Open your local `frontend` folder and run:
    ```bash
    npm run build
    ```
2.  **Locate Files**: Go to `frontend/dist`. You will see `assets`, `index.html`, and `vite.svg`.

## 3. Deployment to cPanel
1.  **Laravel Core**: Zip and upload your Laravel project (minus `node_modules`, `frontend`, `.git`) to `/home/username/tas_core/`.
2.  **Public Folder**: Upload the contents of your Laravel `public` folder to `/home/username/public_html/`.
3.  **Frontend Integration**: Take the contents of **`frontend/dist`** (from step 2.2) and upload them directly into `/home/username/public_html/`.
    - *(Your `public_html` should now contain `assets`, `index.html`, `index.php`, `.htaccess`, etc.)*
4.  **Update index.php**: If you moved the core, update `/public_html/index.php` paths as explained before.

---

## 4. Final Routing (The most important step)

To make React routing work with Laravel, I have already updated your `routes/web.php`.
Your `.htaccess` file in `public_html` should look like this:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Handle API Routes first
    RewriteCond %{REQUEST_FILENAME} -d [OR]
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule ^(.*)$ $1 [L]

    # Send all other requests to index.php (then Laravel sends to React)
    RewriteCond %{REQUEST_URI} !^/public/index.php
    RewriteRule ^ index.php [L]
</IfModule>
```

---

## 5. Why this is better?
- **No CORS issues**: Both apps use the same link.
- **Easy Links**: `https://tas.netwebup.com/public/` will show the dashboard.
- **Single Login**: No more cross-site authentication problems.

**You are now ready to upload everything to `public_html`!**
