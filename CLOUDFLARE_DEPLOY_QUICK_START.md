# Cloudflare Pages Deployment - Quick Start

## 🚀 Deploy in 5 Minutes

Your **Meta-Judge** application is ready for immediate deployment to Cloudflare Pages.

---

## ✅ Pre-Deployment Checklist

- [x] Production build completed successfully
- [x] Build output: `dist/public/` (407.12 kB, gzipped: 127.09 kB)
- [x] All features tested and working
- [x] Multi-judge scoring system implemented
- [x] 10 template applications seeded
- [x] Navigation and routing configured

---

## 📤 Deployment Options

### Option 1: Direct Upload (Fastest - 2 Minutes)

1. **Go to Cloudflare Dashboard**
   ```
   https://dash.cloudflare.com/
   ```

2. **Navigate to Pages**
   - Click **Pages** in the left sidebar
   - Click **Create a project**

3. **Choose Direct Upload**
   - Select **Upload assets**
   - Name your project: `meta-judge` (or your preferred name)

4. **Upload Build Files**
   - Drag and drop the **entire contents** of `dist/public/` folder
   - **Important**: Upload the contents, not the folder itself
   - Files to upload:
     - `index.html`
     - `assets/` folder (with all CSS and JS files)

5. **Deploy**
   - Click **Deploy site**
   - Wait ~30 seconds
   - Your site is live! 🎉

### Option 2: Wrangler CLI (For Developers)

1. **Install Wrangler** (if not already installed)
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Deploy**
   ```bash
   npx wrangler pages deploy dist/public --project-name=meta-judge
   ```

4. **Access Your Site**
   - URL will be displayed in terminal
   - Format: `https://meta-judge.pages.dev`

---

## 🌐 Post-Deployment

### Custom Domain (Optional)

1. Go to your Pages project settings
2. Click **Custom domains**
3. Add your domain (e.g., `meta-judge.yourdomain.com`)
4. Update DNS records as instructed

### Environment Variables

This static build uses demo data and doesn't require environment variables.

For future API integration:
1. Pages > Your Project > Settings > Environment variables
2. Add:
   - `VITE_API_URL` - Your backend API endpoint
   - `VITE_DATABASE_URL` - Your Neon database connection string

---

## 📊 Testing Your Deployment

After deployment, test these critical paths:

### 1. Home Page
- URL: `https://your-site.pages.dev/`
- Check: Branding, navigation, all links work

### 2. Judge Portal
- URL: `https://your-site.pages.dev/judge?org=2`
- Check:
  - Judge selector dropdown appears
  - 10 applications are listed
  - Filter tabs work (All/Pending/Completed)
  - Search functionality

### 3. Application Scoring
- URL: `https://your-site.pages.dev/judge/score/5?org=2&judge=Sarah%20Johnson`
- Check:
  - Application loads on left side
  - Scoring panel on right side
  - Can submit evaluation

### 4. Comparison Dashboard
- URL: `https://your-site.pages.dev/comparison?org=2`
- Check: All tabs work (Overview, By Criterion, By Judge)

### 5. Reports
- URL: `https://your-site.pages.dev/reports?org=2`
- Check: Report data displays correctly

---

## 🔧 Troubleshooting

### Issue: 404 Not Found on Page Refresh

**Solution**: Configure Cloudflare Pages for SPA routing

1. Go to Pages > Your Project > Settings > Build & deployments
2. Under **Build configuration**, click **Edit**
3. Set **Build output directory**: `/dist/public`
4. Save

Then create a `_redirects` file:
```bash
echo "/* /index.html 200" > dist/public/_redirects
```

Re-deploy with this file included.

### Issue: Static Assets Not Loading

**Check**:
- Ensure you uploaded the `assets/` folder
- Verify all files in `dist/public/` were uploaded
- Check browser console for specific errors

### Issue: API Calls Failing

**Expected**: The static build uses demo/mock data only
- No backend API calls are made in this version
- All data is client-side for demonstration purposes

---

## 📝 Build Information

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **UI Library**: shadcn/ui + Tailwind CSS
- **Routing**: React Router v6 (client-side)
- **Total Size**: 407.12 kB (gzipped: 127.09 kB)
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)

---

## 🎯 What's Deployed

### Fully Functional Features:
✅ Judge Portal with multi-judge support (5 judge profiles)
✅ Application Scoring (10 template applications)
✅ Comparison Dashboard with analytics
✅ Reports with bias detection
✅ Navigation between all portals
✅ Responsive design (mobile, tablet, desktop)

### Demo Data Included:
- 5 Judge profiles (Sarah Johnson, Michael Chen, Emily Rodriguez, David Park, Amanda Williams)
- 10 Diverse business applications across multiple industries
- Sample evaluations for comparison analytics
- Bias detection examples

---

## 🚦 Next Steps After Deployment

1. **Share the URL** with your client or team
2. **Walk through the demo flow** (see README_DEPLOYMENT.md)
3. **Collect feedback** on UI/UX
4. **Plan backend integration** for production use:
   - Deploy Express API server
   - Connect Neon PostgreSQL database
   - Implement AI evaluation pipeline
   - Add authentication

---

## 📞 Support

For deployment issues:
- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Cloudflare Community: https://community.cloudflare.com/

For application issues:
- Check README_DEPLOYMENT.md for demo instructions
- Review browser console for errors
- Test locally with `npm run preview`

---

**Ready to deploy?** Follow Option 1 above and you'll be live in 2 minutes! 🚀
