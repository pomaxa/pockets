# Server Deployment Guide

Complete guide for deploying Pockets to a production server with nginx.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Preparation](#server-preparation)
3. [Initial Setup](#initial-setup)
4. [SSL Configuration](#ssl-configuration)
5. [Deploying Updates](#deploying-updates)
6. [Troubleshooting](#troubleshooting)
7. [Maintenance](#maintenance)

---

## Prerequisites

### Server Requirements

- **Operating System:** Ubuntu 20.04+ or Debian 10+ (recommended)
- **RAM:** 1GB minimum, 2GB recommended
- **Disk Space:** 10GB minimum
- **Network:** Public IP address and domain name (optional but recommended)

### Required Software

- Node.js 18+ and npm
- nginx
- git (optional, for easier updates)
- certbot (for SSL certificates)

### Domain Setup

If using a custom domain:
1. Purchase a domain from a registrar
2. Point your domain's A record to your server's IP address
3. Wait for DNS propagation (can take up to 48 hours, usually ~15 minutes)

---

## Server Preparation

### 1. Initial Server Setup

Connect to your server via SSH:

```bash
ssh root@your-server-ip
```

### 2. Update System

```bash
apt-get update
apt-get upgrade -y
```

### 3. Install Node.js

Using NodeSource repository (recommended):

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Install Node.js
apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 4. Install nginx

```bash
apt-get install -y nginx

# Start nginx
systemctl start nginx
systemctl enable nginx

# Verify installation
nginx -v
```

### 5. Configure Firewall

```bash
# Allow SSH (important - don't lock yourself out!)
ufw allow OpenSSH

# Allow HTTP and HTTPS
ufw allow 'Nginx Full'

# Enable firewall
ufw enable

# Check status
ufw status
```

### 6. Transfer Application Files

**Option A: Using git (recommended)**

```bash
cd /opt
git clone https://github.com/YOUR_USERNAME/pockets-app.git
cd pockets-app
```

**Option B: Using SCP**

From your local machine:

```bash
scp -r /path/to/pockets-app root@your-server-ip:/opt/
```

Then on the server:

```bash
cd /opt/pockets-app
```

---

## Initial Setup

### 1. Run Setup Script

The setup script will build the app and configure nginx:

```bash
cd /opt/pockets-app
chmod +x setup.sh
sudo ./setup.sh
```

The script will:
- Check prerequisites
- Ask for your domain name
- Build the production app
- Copy files to `/var/www/pockets`
- Create nginx configuration
- Test and enable the site

### 2. Verify HTTP Access

After setup, your site should be accessible via HTTP:

```
http://your-domain.com
```

Or using the IP address:

```
http://your-server-ip
```

---

## SSL Configuration

### 1. Verify DNS

Before obtaining SSL certificates, ensure your domain points to your server:

```bash
# Check DNS resolution
nslookup your-domain.com

# Should show your server's IP address
```

### 2. Install SSL Certificate

Run the SSL installation script:

```bash
sudo ./scripts/install-ssl.sh
```

The script will:
- Check/install certbot
- Verify DNS configuration
- Obtain Let's Encrypt certificate
- Update nginx configuration for HTTPS
- Set up automatic certificate renewal

You'll need to provide:
- Your domain name (auto-detected from nginx config)
- Email address for certificate notifications

### 3. Verify HTTPS Access

After SSL installation, your site should be accessible via HTTPS:

```
https://your-domain.com
```

HTTP requests will automatically redirect to HTTPS.

### 4. Test Certificate Renewal

Certbot sets up automatic renewal, but you can test it:

```bash
sudo certbot renew --dry-run
```

Certificates will auto-renew ~30 days before expiration.

---

## Deploying Updates

### Quick Update

Use the deployment script for easy updates:

```bash
cd /opt/pockets-app
sudo ./deploy.sh
```

The script will:
- Create a backup of current deployment
- Pull latest code (if using git)
- Install/update dependencies
- Build the application
- Deploy to web root
- Reload nginx
- Clean up old backups (keeps last 5)

### Manual Update

If you prefer manual deployment:

```bash
# Navigate to project
cd /opt/pockets-app

# Pull latest code (if using git)
git pull origin main

# Install dependencies
npm install

# Build production version
npm run build

# Copy to web root
sudo rm -rf /var/www/pockets/*
sudo cp -r dist/* /var/www/pockets/

# Set permissions
sudo chown -R www-data:www-data /var/www/pockets
sudo chmod -R 755 /var/www/pockets

# Reload nginx
sudo systemctl reload nginx
```

### Rollback

If deployment fails, the deploy script automatically rolls back to the last backup.

To manually rollback:

```bash
# List available backups
ls -lh /var/backups/pockets/

# Restore a specific backup
sudo cp -r /var/backups/pockets/backup_TIMESTAMP/* /var/www/pockets/

# Reload nginx
sudo systemctl reload nginx
```

---

## Troubleshooting

### Site Not Loading

1. **Check nginx status:**
   ```bash
   sudo systemctl status nginx
   ```

2. **Check nginx configuration:**
   ```bash
   sudo nginx -t
   ```

3. **Check nginx logs:**
   ```bash
   sudo tail -f /var/log/nginx/pockets_error.log
   sudo tail -f /var/log/nginx/pockets_access.log
   ```

4. **Verify files exist:**
   ```bash
   ls -lh /var/www/pockets/
   ```

### SSL Certificate Issues

1. **Check certificate status:**
   ```bash
   sudo certbot certificates
   ```

2. **Manually renew certificate:**
   ```bash
   sudo certbot renew
   ```

3. **Check SSL configuration:**
   ```bash
   sudo nginx -t
   openssl s_client -connect your-domain.com:443
   ```

### Permission Issues

1. **Fix web root permissions:**
   ```bash
   sudo chown -R www-data:www-data /var/www/pockets
   sudo chmod -R 755 /var/www/pockets
   ```

2. **Check SELinux (if applicable):**
   ```bash
   sestatus
   # If enabled, may need to configure SELinux policies
   ```

### 404 Errors on Routes

If you get 404 errors when refreshing pages:

1. **Check nginx SPA configuration:**
   The nginx config should have `try_files $uri $uri/ /index.html;`

2. **Reload nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

### Build Fails

1. **Check Node.js version:**
   ```bash
   node --version  # Should be 18+
   ```

2. **Clear cache and rebuild:**
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

3. **Check disk space:**
   ```bash
   df -h
   ```

---

## Maintenance

### Regular Tasks

#### Daily
- Monitor error logs
- Check site accessibility

#### Weekly
- Review access logs
- Check disk usage
- Monitor certificate expiration

#### Monthly
- Update system packages
- Review and clean old backups
- Update Node.js dependencies

### Monitoring

#### Check Logs

```bash
# Nginx error log
sudo tail -f /var/log/nginx/pockets_error.log

# Nginx access log
sudo tail -f /var/log/nginx/pockets_access.log

# System log
sudo journalctl -u nginx -f
```

#### Disk Usage

```bash
# Check overall disk usage
df -h

# Check directory sizes
du -sh /var/www/pockets
du -sh /var/backups/pockets
du -sh /var/log/nginx
```

#### SSL Certificate Expiry

```bash
# Check certificate expiration
sudo certbot certificates

# Or using openssl
echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates
```

### Backup Strategy

The deploy script automatically creates backups in `/var/backups/pockets/` and keeps the last 5.

For full server backups:

```bash
# Backup entire web root
tar -czf pockets-backup-$(date +%Y%m%d).tar.gz /var/www/pockets

# Backup nginx config
tar -czf nginx-config-backup-$(date +%Y%m%d).tar.gz /etc/nginx/sites-available/pockets

# Backup SSL certificates
tar -czf ssl-backup-$(date +%Y%m%d).tar.gz /etc/letsencrypt/live/your-domain.com
```

### Updates

#### Update Node.js

```bash
# Using NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs

# Verify
node --version
```

#### Update nginx

```bash
sudo apt-get update
sudo apt-get upgrade nginx

# Test configuration
sudo nginx -t

# Reload if OK
sudo systemctl reload nginx
```

#### Update Application Dependencies

```bash
cd /opt/pockets-app
npm update
npm audit fix
npm run build
sudo ./deploy.sh
```

### Security Best Practices

1. **Keep system updated:**
   ```bash
   sudo apt-get update
   sudo apt-get upgrade
   ```

2. **Use SSH keys instead of passwords**

3. **Enable automatic security updates:**
   ```bash
   sudo apt-get install unattended-upgrades
   sudo dpkg-reconfigure --priority=low unattended-upgrades
   ```

4. **Monitor access logs for suspicious activity**

5. **Keep SSL certificates valid** (certbot handles this automatically)

6. **Regular backups**

---

## Performance Optimization

### Enable nginx Caching

Already configured in the nginx template, but you can verify:

```bash
sudo nano /etc/nginx/sites-available/pockets
# Check for cache-related directives
```

### Gzip Compression

Already enabled in the nginx config. Verify:

```bash
curl -H "Accept-Encoding: gzip" -I https://your-domain.com
# Should see "Content-Encoding: gzip"
```

### Monitor Performance

```bash
# Check nginx performance
sudo nginx -t
sudo systemctl status nginx

# Monitor server resources
htop
# Or
top
```

---

## Additional Resources

### nginx Documentation
- Official docs: https://nginx.org/en/docs/
- Beginner's guide: https://nginx.org/en/docs/beginners_guide.html

### Let's Encrypt
- Documentation: https://letsencrypt.org/docs/
- Certbot: https://certbot.eff.org/

### Security
- Mozilla SSL Configuration Generator: https://ssl-config.mozilla.org/
- Security Headers: https://securityheaders.com/

### Monitoring Tools
- Uptime monitoring: UptimeRobot, Pingdom
- Error tracking: Sentry
- Analytics: Plausible, Google Analytics

---

## Support

For issues with:
- **Application:** Create issue on GitHub
- **Server setup:** Check logs and troubleshooting section above
- **SSL/DNS:** Contact your domain registrar or hosting provider

---

## Quick Command Reference

```bash
# Initial setup
sudo ./setup.sh

# Install SSL
sudo ./scripts/install-ssl.sh

# Deploy updates
sudo ./deploy.sh

# Check nginx status
sudo systemctl status nginx

# Reload nginx
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# Test nginx config
sudo nginx -t

# View logs
sudo tail -f /var/log/nginx/pockets_error.log

# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check disk usage
df -h
du -sh /var/www/pockets

# Check firewall
sudo ufw status
```

---

**Last Updated:** 2024-11-18

Good luck with your deployment! 🚀
