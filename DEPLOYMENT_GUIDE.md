# Deployment Guide - Personal Budget Tracker

## 🌐 Deployed URLs

- **Frontend (Vercel)**: https://personal-budget-tracker-xi.vercel.app/
- **Backend (Render)**: https://personal-budget-tracker-xr3r.onrender.com

---

## 🚀 Backend Deployment (Render)

### Current Configuration

Your backend is already deployed on Render at: `https://personal-budget-tracker-xr3r.onrender.com`

### Settings Updated

1. **ALLOWED_HOSTS** - Added Render domain
2. **CORS_ALLOWED_ORIGINS** - Added Vercel frontend URLs
3. **CSRF_TRUSTED_ORIGINS** - Added Vercel domains
4. **DEBUG** - Set to `False` for production
5. **Static files** - Configured with WhiteNoise

### Environment Variables on Render

Make sure these are set in your Render dashboard:

```bash
# Required
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=personal-budget-tracker-xr3r.onrender.com

# Optional (if using PostgreSQL)
DATABASE_URL=postgresql://...
```

### Database Migration

After deploying, run migrations on Render:

```bash
python manage.py migrate
python manage.py createsuperuser
```

### Testing Backend

Test your backend API:
```bash
curl https://personal-budget-tracker-xr3r.onrender.com/api/
```

---

## 🎨 Frontend Deployment (Vercel)

### Current Configuration

Your frontend is deployed on Vercel at: `https://personal-budget-tracker-xi.vercel.app/`

### Environment Variables on Vercel

**IMPORTANT**: Add this environment variable in your Vercel project settings:

1. Go to: https://vercel.com/dashboard
2. Select your project: `personal-budget-tracker`
3. Go to **Settings** → **Environment Variables**
4. Add the following:

```
Name: VITE_API_BASE_URL
Value: https://personal-budget-tracker-xr3r.onrender.com
Environment: Production
```

### Build Settings on Vercel

Make sure these are configured:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Root Directory**: `frontend`

### Redeploy Frontend

After adding the environment variable, trigger a new deployment:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy**

Or push a new commit to trigger automatic deployment.

---

## 🔧 Configuration Files Changed

### Backend Files

1. **`backend/budget_backend/settings.py`**
   - Added Render domain to `ALLOWED_HOSTS`
   - Added Vercel URLs to `CORS_ALLOWED_ORIGINS`
   - Added `CSRF_TRUSTED_ORIGINS`
   - Configured JWT settings
   - Added CORS headers

### Frontend Files

1. **`frontend/src/api/index.js`**
   - Updated to use `VITE_API_BASE_URL` environment variable
   - Falls back to `/api` for local development

2. **`frontend/.env.production`** (NEW)
   - Production environment variables
   - Points to Render backend

3. **`frontend/.env.example`**
   - Updated with production URL example

---

## 📝 Step-by-Step Deployment Instructions

### Step 1: Update Backend on Render

1. **Commit and push backend changes**:
   ```bash
   git add backend/budget_backend/settings.py
   git commit -m "Configure backend for production deployment"
   git push origin main
   ```

2. **Render will auto-deploy** (if auto-deploy is enabled)
   - Or manually deploy from Render dashboard

3. **Run migrations** (in Render shell):
   ```bash
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```

### Step 2: Configure Vercel Environment Variables

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://personal-budget-tracker-xr3r.onrender.com`
   - **Environment**: Production (check the box)
5. Click **Save**

### Step 3: Deploy Frontend to Vercel

1. **Commit and push frontend changes**:
   ```bash
   git add frontend/
   git commit -m "Configure frontend for production deployment"
   git push origin main
   ```

2. **Vercel will auto-deploy**
   - Or manually redeploy from Vercel dashboard

3. **Verify deployment**:
   - Visit: https://personal-budget-tracker-xi.vercel.app/
   - Check browser console for any errors
   - Test login functionality

---

## 🧪 Testing the Connection

### 1. Test Backend API

```bash
# Test health endpoint
curl https://personal-budget-tracker-xr3r.onrender.com/api/

# Test login endpoint
curl -X POST https://personal-budget-tracker-xr3r.onrender.com/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

### 2. Test Frontend

1. Open: https://personal-budget-tracker-xi.vercel.app/
2. Open browser DevTools (F12) → Network tab
3. Try to login
4. Check that API requests go to: `https://personal-budget-tracker-xr3r.onrender.com/api/...`

### 3. Check CORS

If you see CORS errors in browser console:
- Verify `CORS_ALLOWED_ORIGINS` includes your Vercel URL
- Check that Vercel URL matches exactly (with/without trailing slash)
- Redeploy backend after CORS changes

---

## 🐛 Troubleshooting

### Issue: CORS Error

**Error**: `Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy`

**Solution**:
1. Check `backend/budget_backend/settings.py` → `CORS_ALLOWED_ORIGINS`
2. Make sure your Vercel URL is listed exactly
3. Redeploy backend
4. Clear browser cache

### Issue: 404 Not Found on API calls

**Error**: API calls return 404

**Solution**:
1. Check that `VITE_API_BASE_URL` is set in Vercel environment variables
2. Verify the URL doesn't have trailing slash issues
3. Check browser Network tab to see actual URL being called

### Issue: 500 Internal Server Error

**Error**: Backend returns 500 error

**Solution**:
1. Check Render logs: Dashboard → Logs
2. Verify database migrations are run
3. Check `ALLOWED_HOSTS` includes Render domain
4. Verify `SECRET_KEY` is set in Render environment variables

### Issue: Static files not loading

**Error**: CSS/JS files return 404

**Solution**:
1. Run on Render: `python manage.py collectstatic --noinput`
2. Verify WhiteNoise is in `MIDDLEWARE`
3. Check `STATIC_ROOT` and `STATIC_URL` settings

### Issue: Environment variables not working

**Error**: Frontend still uses localhost

**Solution**:
1. Verify environment variable is set in Vercel
2. Variable name must start with `VITE_`
3. Redeploy after adding environment variables
4. Check build logs for environment variable values

---

## 📊 Monitoring

### Backend (Render)

- **Logs**: Render Dashboard → Your Service → Logs
- **Metrics**: Render Dashboard → Your Service → Metrics
- **Shell Access**: Render Dashboard → Your Service → Shell

### Frontend (Vercel)

- **Deployment Logs**: Vercel Dashboard → Deployments → Click deployment
- **Runtime Logs**: Vercel Dashboard → Your Project → Logs
- **Analytics**: Vercel Dashboard → Your Project → Analytics

---

## 🔒 Security Checklist

- [x] `DEBUG = False` in production
- [x] `SECRET_KEY` stored in environment variable (not in code)
- [x] CORS configured with specific origins (not `ALLOW_ALL`)
- [x] HTTPS enabled (both Render and Vercel provide this)
- [x] CSRF protection enabled
- [ ] Database backups configured (if using PostgreSQL)
- [ ] Rate limiting configured (optional)
- [ ] Monitoring/alerting set up (optional)

---

## 🔄 Updating the Application

### Backend Updates

```bash
# Make changes to backend code
git add backend/
git commit -m "Update backend feature"
git push origin main

# Render will auto-deploy
# Run migrations if needed (in Render shell):
python manage.py migrate
```

### Frontend Updates

```bash
# Make changes to frontend code
git add frontend/
git commit -m "Update frontend feature"
git push origin main

# Vercel will auto-deploy
```

---

## 📞 Support

If you encounter issues:

1. **Check logs** (Render and Vercel dashboards)
2. **Verify environment variables** are set correctly
3. **Test API endpoints** directly with curl/Postman
4. **Check browser console** for frontend errors
5. **Review CORS settings** if seeing cross-origin errors

---

## ✅ Deployment Checklist

Before going live:

- [ ] Backend deployed on Render
- [ ] Database migrations run
- [ ] Superuser created
- [ ] Environment variables set on Render
- [ ] Frontend deployed on Vercel
- [ ] `VITE_API_BASE_URL` set on Vercel
- [ ] CORS configured correctly
- [ ] Login functionality tested
- [ ] All features tested in production
- [ ] Error handling verified
- [ ] Performance tested

---

**Your application is now connected and ready to use! 🎉**

Visit: https://personal-budget-tracker-xi.vercel.app/

