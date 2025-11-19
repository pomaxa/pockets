# Deployment Scripts

This directory contains helper scripts for server deployment and maintenance.

## Scripts

### install-ssl.sh

Automated SSL certificate installation using Let's Encrypt.

**Purpose:**
- Install/check certbot
- Verify DNS configuration
- Obtain SSL certificate from Let's Encrypt
- Configure nginx for HTTPS
- Set up automatic certificate renewal

**Usage:**
```bash
sudo ./scripts/install-ssl.sh
```

**Requirements:**
- Must run after `setup.sh`
- Domain must point to the server
- Ports 80 and 443 must be open

**What it does:**
1. Checks if certbot is installed (installs if needed)
2. Extracts domain from nginx configuration
3. Verifies DNS points to current server
4. Creates temporary HTTP-only nginx config
5. Obtains SSL certificate via certbot
6. Restores full nginx config with SSL paths
7. Tests certificate renewal
8. Displays certificate information

**Interactive Prompts:**
- Email address for certificate notifications
- Confirmation to continue if DNS doesn't match

**Output:**
- SSL certificate at `/etc/letsencrypt/live/your-domain/`
- Updated nginx configuration with SSL
- Auto-renewal configured via systemd timer or cron

**Troubleshooting:**

*Certificate issuance fails:*
- Verify DNS: `nslookup your-domain.com`
- Check firewall: `sudo ufw status`
- Check nginx: `sudo nginx -t`
- Review certbot logs: `sudo journalctl -u certbot`

*Auto-renewal not working:*
- Check timer: `systemctl status certbot.timer`
- Test renewal: `sudo certbot renew --dry-run`

**Manual Certificate Renewal:**
```bash
sudo certbot renew
sudo systemctl reload nginx
```

**Check Certificate Status:**
```bash
sudo certbot certificates
```

## Future Scripts (Coming Soon)

### backup.sh
- Create full backup of application and configuration
- Store backups remotely (S3, Backblaze, etc.)
- Restore from backup

### monitor.sh
- Check site health
- Monitor SSL certificate expiration
- Alert if site is down
- Log resource usage

### optimize.sh
- Optimize nginx configuration
- Enable additional caching
- Set up CDN
- Configure HTTP/3

### update-deps.sh
- Update Node.js dependencies
- Check for security vulnerabilities
- Run tests after updates
- Deploy if tests pass

## Usage Notes

### All Scripts

- Run with `sudo` for proper permissions
- Check exit codes for automation:
  ```bash
  sudo ./scripts/install-ssl.sh
  if [ $? -eq 0 ]; then
      echo "Success!"
  else
      echo "Failed!"
  fi
  ```

### Script Locations

- Scripts are in `/opt/pockets-app/scripts/` (or wherever you cloned)
- Always run from project root directory
- Scripts use relative paths where possible

### Permissions

Scripts should be executable:
```bash
chmod +x scripts/*.sh
```

### Logging

Scripts output to console. To log to file:
```bash
sudo ./scripts/install-ssl.sh 2>&1 | tee ssl-install.log
```

## Contributing

When adding new scripts:

1. Use the same structure as existing scripts:
   - Colored output functions
   - Root check
   - Error handling (`set -e`)
   - Clear success/error messages

2. Make scripts idempotent (safe to run multiple times)

3. Add comprehensive error checking

4. Document in this README

5. Test on fresh server before committing

## Security Considerations

- Scripts require root access (use sudo)
- Review scripts before running on production
- Never store secrets in scripts
- Use environment variables for sensitive data

## Support

For issues with deployment scripts:
- Check `DEPLOYMENT_SERVER.md` for troubleshooting
- Review script output for error messages
- Check system logs: `sudo journalctl -xe`

---

Last Updated: 2024-11-18
