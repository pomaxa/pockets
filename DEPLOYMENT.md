# Deployment Guide

This guide will help you deploy the Pockets application to production.

## Prerequisites

1. GitHub account
2. Vercel or Netlify account (free tier is fine)
3. Domain name (optional, can use provided subdomain)

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Pockets MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pockets-app.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click "Deploy"

### Step 3: Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain (e.g., pockets.lv)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

## Option 2: Deploy to Netlify

### Step 1: Push to GitHub

Same as Vercel Step 1 above.

### Step 2: Import to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect to your GitHub repository
4. Configure build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
5. Click "Deploy site"

The `netlify.toml` file will automatically configure redirects for SPA routing.

### Step 3: Custom Domain (Optional)

1. In Netlify site settings, go to "Domain management"
2. Add your custom domain
3. Follow DNS configuration instructions

## Environment Variables

This MVP doesn't use any environment variables. All settings are hardcoded.

For future versions, you might want to add:
- `VITE_API_URL` - Backend API URL
- `VITE_ANALYTICS_ID` - Analytics tracking ID
- etc.

## Post-Deployment Checklist

- [ ] Visit deployed URL and test all pages
- [ ] Test Calculator with sample data (e.g., €2000 salary, €400 rent, €100 utilities)
- [ ] Create a goal and verify it saves
- [ ] Add expenses and verify they display correctly
- [ ] Check that data persists after page refresh
- [ ] Test on mobile device (responsive design)
- [ ] Verify all internal links work
- [ ] Test contact forms/emails (if applicable)

## Monitoring

### Vercel

- Vercel provides built-in analytics
- Check deployment logs in Vercel dashboard
- Monitor function invocations (if using serverless functions)

### Netlify

- Netlify provides built-in analytics
- Check build logs in Netlify dashboard
- Monitor bandwidth usage

## Troubleshooting

### Build Fails

1. Check TypeScript errors: `npm run build` locally
2. Verify all dependencies are in package.json
3. Check build logs for specific errors

### Routing Issues (404 on refresh)

- Ensure `vercel.json` or `netlify.toml` is properly configured
- These files handle SPA routing redirects

### Data Not Persisting

- Check browser localStorage is enabled
- Verify no browser extensions are blocking localStorage
- Test in incognito mode

## Updating the Deployment

### Automatic Deployment

Both Vercel and Netlify support automatic deployments:

1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Update feature X"
   git push
   ```

2. The platform will automatically:
   - Detect the push
   - Run the build
   - Deploy if successful

### Manual Deployment

If needed, you can trigger manual deployments:

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## Performance Optimization

After deployment, consider:

1. **Enable gzip compression** (usually automatic)
2. **Add a CDN** (Vercel and Netlify include this)
3. **Optimize images** (compress, use WebP format)
4. **Code splitting** (Vite does this automatically)
5. **Enable caching** (configure in platform settings)

## Domain Configuration

### For pockets.lv:

1. Purchase domain from registrar (e.g., nic.lv for .lv domains)
2. In domain registrar DNS settings, add:

**For Vercel:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21
```

**For Netlify:**
```
Type: CNAME
Name: www
Value: YOUR-SITE.netlify.app

Type: A
Name: @
Value: 75.2.60.5
```

3. Wait for DNS propagation (check with [whatsmydns.net](https://www.whatsmydns.net))

## SSL/HTTPS

Both Vercel and Netlify provide free SSL certificates automatically:
- Certificates are auto-renewed
- HTTPS is enforced by default
- No additional configuration needed

## Analytics (Optional)

To add analytics after deployment:

1. **Google Analytics:**
   - Add GA script to index.html
   - Or use react-ga package

2. **Plausible (Privacy-friendly):**
   - Add Plausible script to index.html
   - No cookies, GDPR-compliant

## Backup Strategy

Since data is stored in localStorage:

1. **User Responsibility:** Users manage their own data
2. **Future Enhancement:** Add export/import functionality
3. **Cloud Sync:** Consider implementing in v2

## Cost Estimate

**MVP Deployment (Free Tier):**
- Vercel: Free for personal projects
- Netlify: Free for personal projects
- Domain: ~€15-30/year for .lv domain

**Expected Traffic:**
- Free tier supports ~100K requests/month
- Plenty for MVP phase

**Scaling:**
- If traffic grows, upgrade to Pro plans (~$20/month)

## Next Steps After Deployment

1. Share with beta users
2. Collect feedback
3. Monitor error logs
4. Iterate based on user feedback
5. Plan v2 features

## Support

For deployment issues:
- Vercel: https://vercel.com/support
- Netlify: https://www.netlify.com/support/

For application issues:
- Create issue on GitHub
- Email: hello@pockets.lv

---

Good luck with your deployment! 🚀
