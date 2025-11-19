# Deployment Guide

This guide explains how to deploy the Pockets application.

---

## Table of Contents

1. [Self-Hosted Deployment (Own Server)](#self-hosted-deployment)
2. [Cloud Platform Deployment (Vercel/Netlify)](#cloud-platform-deployment)

---

# Self-Hosted Deployment

Deploy to your own VPS or dedicated server with nginx.

## Prerequisites

- Linux server (Ubuntu 20.04+ recommended)
- Root or sudo access
- Domain name pointed to your server
- Node.js v18+ installed
- nginx installed

---

## Quick Deployment

### Recommended Workflow

```bash
# 1. SSH into your server
ssh user@your-server.com

# 2. Navigate to project directory
cd /path/to/pockets

# 3. Pull latest changes
git pull

# 4. Deploy (build and copy to web root)
sudo ./deploy.sh --no-pull
```

---

## Deployment Script Options

The `deploy.sh` script supports several options:

```bash
# Full deployment with git pull
sudo ./deploy.sh

# Skip git pull (recommended when you pull manually)
sudo ./deploy.sh --no-pull

# Show help
sudo ./deploy.sh --help
```

---

## What the Deployment Script Does

1. **Creates Backup**: Backs up current deployment to `/var/backups/pockets/`
2. **Pulls Code** (optional): Updates from git repository
3. **Installs Dependencies**: Runs `npm install`
4. **Builds Application**: Runs `npm run build` (TypeScript + Vite)
5. **Deploys Files**: Copies `dist/` to `/var/www/pockets/`
6. **Sets Permissions**: Sets proper ownership (`www-data:www-data`)
7. **Tests Nginx**: Validates nginx configuration
8. **Reloads Nginx**: Applies changes
9. **Cleanup**: Removes old backups (keeps last 5)

---

## First-Time Server Setup

If this is your first deployment:

```bash
# 1. Clone repository on server
cd /var/www
sudo git clone https://github.com/your-username/pockets.git pockets-repo
cd pockets-repo

# 2. Run setup script (configures nginx, SSL, etc.)
sudo chmod +x setup.sh
sudo ./setup.sh

# 3. Deploy
sudo chmod +x deploy.sh
sudo ./deploy.sh
```

The setup script will:
- Create nginx configuration
- Set up SSL with Let's Encrypt
- Configure firewall
- Install dependencies

---

## Configuration

### Web Root

Default: `/var/www/pockets`

To change, edit `deploy.sh`:
```bash
WEB_ROOT="/var/www/your-custom-path"
```

### Backup Directory

Default: `/var/backups/pockets`

To change, edit `deploy.sh`:
```bash
BACKUP_DIR="/your/backup/path"
```

---

## Rollback

If deployment fails, the script automatically rolls back to the previous backup.

### Manual Rollback

```bash
# List available backups
ls -lt /var/backups/pockets/

# Restore a specific backup
sudo cp -r /var/backups/pockets/backup_YYYYMMDD_HHMMSS/* /var/www/pockets/
sudo chown -R www-data:www-data /var/www/pockets
sudo systemctl reload nginx
```

---

## Troubleshooting

### Permission Denied

Run with `sudo`:
```bash
sudo ./deploy.sh --no-pull
```

### Build Fails

Check Node.js version:
```bash
node --version  # Should be v18+
npm --version
```

Install dependencies manually:
```bash
npm install
npm run build
```

### Nginx Issues

Test configuration:
```bash
sudo nginx -t
```

Check status:
```bash
sudo systemctl status nginx
```

View error logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

### Site Not Updating

Clear nginx cache:
```bash
sudo systemctl restart nginx
```

Clear browser cache or use hard refresh (Ctrl+Shift+R).

---

## Complete Workflow Example

```bash
# On local machine: commit and push
git add .
git commit -m "feat: add new feature"
git push origin main

# On server: pull and deploy
ssh user@server
cd /var/www/pockets-repo
git pull origin main
sudo ./deploy.sh --no-pull

# Verify
curl -I https://your-domain.com
```

---

## Monitoring

After deployment:

1. **Check website**: Visit your domain
2. **Check console**: Open browser DevTools
3. **Check nginx logs**: `sudo tail -f /var/log/nginx/access.log`
4. **Check SSL**: `sudo certbot certificates`

---

## Security

- Script requires `sudo` to write to `/var/www/` and reload nginx
- Only run on trusted code
- Review changes before deploying
- Backups kept automatically (last 5)

---

# Cloud Platform Deployment

For simpler deployment without managing a server.

## Option 1: Vercel (Recommended)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pockets.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Vite:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click "Deploy"

### Step 3: Custom Domain (Optional)

1. In project settings → "Domains"
2. Add your custom domain
3. Follow DNS instructions
4. Wait for DNS propagation

---

## Option 2: Netlify

### Step 1: Push to GitHub

Same as Vercel.

### Step 2: Import to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect to GitHub
4. Configure:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
5. Click "Deploy"

The `netlify.toml` file configures SPA routing automatically.

---

## Post-Deployment Checklist

- [ ] Visit URL and test all pages
- [ ] Test Calculator with sample data
- [ ] Create goal and verify it saves
- [ ] Add expenses and verify display
- [ ] Check data persists after refresh
- [ ] Test on mobile (responsive)
- [ ] Verify all links work
- [ ] Check browser console for errors

---

## Environment Variables

Currently none needed. All settings are client-side.

For future versions:
- `VITE_API_URL` - Backend API
- `VITE_ANALYTICS_ID` - Analytics

---

## Monitoring

### Self-Hosted

- nginx access logs: `/var/log/nginx/access.log`
- nginx error logs: `/var/log/nginx/error.log`
- Application errors: Browser console

### Vercel/Netlify

- Built-in analytics
- Deployment logs in dashboard
- Error tracking available

---

## Performance

Both cloud platforms and nginx include:
- gzip compression
- CDN
- HTTP/2
- Automatic caching
- SSL/TLS

---

## Cost Estimate

### Self-Hosted
- VPS: €5-20/month (DigitalOcean, Hetzner, etc.)
- Domain: €15-30/year
- Total: ~€75-270/year

### Cloud (Free Tier)
- Vercel/Netlify: Free for personal
- Domain: €15-30/year
- Total: ~€15-30/year

### Scaling
- Self-hosted: Upgrade VPS
- Cloud: Upgrade to Pro (~$20/month)

---

## SSL/HTTPS

### Self-Hosted
- Let's Encrypt (free, auto-renewal)
- Configured by `setup.sh`

### Cloud
- Automatic SSL (Vercel/Netlify)
- Free, auto-renewed
- No configuration needed

---

## Backup Strategy

Since data is in localStorage:

1. **User responsibility**: Users manage their data
2. **Future**: Add export/import
3. **Cloud sync**: Consider in v2

For self-hosted deployments, the script keeps last 5 backups.

---

## Automated Deployments

### GitHub Actions (Self-Hosted)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/pockets-repo
            git pull origin main
            sudo ./deploy.sh --no-pull
```

### GitHub Actions (Vercel/Netlify)

Automatic - no setup needed. Pushes to main auto-deploy.

---

## Domain Configuration

### For .lv domains:

Purchase from nic.lv, then add DNS records:

**Self-Hosted:**
```
Type: A
Name: @
Value: YOUR_SERVER_IP

Type: A
Name: www
Value: YOUR_SERVER_IP
```

**Vercel:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21
```

**Netlify:**
```
Type: CNAME
Name: www
Value: YOUR-SITE.netlify.app

Type: A
Name: @
Value: 75.2.60.5
```

---

## Need Help?

### Self-Hosted
- Check logs: `/var/log/nginx/error.log`
- Test nginx: `sudo nginx -t`
- Check backups: `ls -lt /var/backups/pockets/`

### Cloud
- Vercel: https://vercel.com/support
- Netlify: https://netlify.com/support

### Application
- GitHub issues
- Check browser console

---

**Last Updated**: 2024-11-19
