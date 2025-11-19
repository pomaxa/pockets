# Nginx Configuration

This directory contains the nginx configuration template for the Pockets application.

## File: pockets.conf

This is the nginx configuration template that gets deployed to `/etc/nginx/sites-available/pockets` during setup.

### Features

- **HTTPS Enforcement:** All HTTP traffic redirects to HTTPS
- **SSL/TLS Configuration:** Modern SSL configuration following Mozilla guidelines
- **SPA Routing Support:** All routes properly handled for React Router
- **Static Asset Caching:** Long-term caching for CSS, JS, fonts, images
- **Gzip Compression:** Enabled for text-based files
- **Security Headers:** X-Frame-Options, CSP, XSS Protection, etc.
- **Health Check Endpoint:** `/health` for monitoring

### Template Variables

- `{{DOMAIN}}` - Replaced with your domain name during setup

### File Structure

```
server (HTTP - port 80)
  └─ Redirect to HTTPS

server (HTTPS - port 443)
  ├─ SSL Configuration
  ├─ Security Headers
  ├─ Gzip Compression
  ├─ Root: /var/www/pockets
  ├─ SPA Routing (try_files)
  ├─ Static Asset Caching
  └─ Health Check Endpoint
```

### Deployment

This configuration is automatically deployed by:
- `setup.sh` - Initial setup
- `scripts/install-ssl.sh` - SSL certificate installation

### Manual Deployment

If you need to manually deploy this config:

```bash
# Replace domain placeholder
sed 's/{{DOMAIN}}/your-domain.com/g' nginx/pockets.conf > /etc/nginx/sites-available/pockets

# Test configuration
sudo nginx -t

# Enable site
sudo ln -s /etc/nginx/sites-available/pockets /etc/nginx/sites-enabled/pockets

# Reload nginx
sudo systemctl reload nginx
```

### Customization

You can customize this template for your needs:

#### Change Web Root

```nginx
root /var/www/pockets;  # Change this path
```

#### Adjust Caching

```nginx
expires 1y;  # Change cache duration
```

#### Modify Security Headers

Edit the `add_header` directives in the configuration.

#### Add Custom Routes

Add custom location blocks as needed:

```nginx
location /api {
    proxy_pass http://localhost:3000;
}
```

### Testing Configuration

Always test after making changes:

```bash
sudo nginx -t
```

### Logs

Nginx logs are configured to:
- **Access log:** `/var/log/nginx/pockets_access.log`
- **Error log:** `/var/log/nginx/pockets_error.log`

View logs:

```bash
sudo tail -f /var/log/nginx/pockets_error.log
sudo tail -f /var/log/nginx/pockets_access.log
```

### SSL Certificates

SSL certificate paths (configured after running `install-ssl.sh`):

- **Certificate:** `/etc/letsencrypt/live/{{DOMAIN}}/fullchain.pem`
- **Private Key:** `/etc/letsencrypt/live/{{DOMAIN}}/privkey.pem`

### Troubleshooting

#### 502 Bad Gateway
- Backend service not running (not applicable for static site)
- Check nginx error logs

#### 404 Not Found
- Files not in `/var/www/pockets`
- Check file permissions

#### SSL Certificate Errors
- Run `sudo certbot certificates` to check status
- Run `sudo certbot renew` to renew manually

#### SPA Routes Not Working
- Verify `try_files $uri $uri/ /index.html;` is present
- Check nginx syntax: `sudo nginx -t`

### Security

This configuration includes:

- TLS 1.2 and 1.3 only
- Strong cipher suites
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options (MIME sniffing protection)
- XSS Protection
- Referrer Policy
- Content Security Policy (CSP)

### Performance

Optimizations included:

- Gzip compression (6 levels)
- Static asset caching (1 year)
- No caching for index.html
- HTTP/2 support
- SSL session caching

### Monitoring

Built-in health check endpoint:

```bash
curl https://your-domain.com/health
# Returns: OK
```

Use this for uptime monitoring services.

---

For more information, see:
- [DEPLOYMENT_SERVER.md](../DEPLOYMENT_SERVER.md) - Full deployment guide
- [nginx.org](https://nginx.org/en/docs/) - Official nginx documentation
