# 🚀 Quick Deployment Steps

## Your Deployed URLs
- **Frontend**: https://personal-budget-tracker-xi.vercel.app/
- **Backend**: https://personal-budget-tracker-xr3r.onrender.com

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Set Environment Variable on Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your project: **personal-budget-tracker**
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://personal-budget-tracker-xr3r.onrender.com`
   - **Environment**: Check ✅ **Production**
6. Click **Save**

### Step 2: Push Code Changes

```bash
# From your project root
git add .
git commit -m "Configure for production deployment"
git push origin main
```

### Step 3: Redeploy on Vercel

**Option A - Automatic** (if auto-deploy is enabled):
- Vercel will automatically deploy when you push to main

**Option B - Manual**:
1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Click **Redeploy** on the latest deployment

---

## ✅ Verify It's Working

1. **Visit your frontend**: https://personal-budget-tracker-xi.vercel.app/
2. **Open browser DevTools** (Press F12)
3. **Go to Network tab**
4. **Try to login**
5. **Check that API calls go to**: `https://personal-budget-tracker-xr3r.onrender.com/api/...`

---

## 🎯 What Changed in Your Code

### Backend (`backend/budget_backend/settings.py`)
- ✅ Added Vercel URL to `CORS_ALLOWED_ORIGINS`
- ✅ Added `CSRF_TRUSTED_ORIGINS`
- ✅ Configured JWT settings
- ✅ Added CORS headers

### Frontend (`frontend/src/api/index.js`)
- ✅ Now uses `VITE_API_BASE_URL` environment variable
- ✅ Points to Render backend in production
- ✅ Still works with localhost in development

### New Files Created
- ✅ `frontend/.env.production` - Production environment config
- ✅ `frontend/vercel.json` - Vercel configuration
- ✅ `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- ✅ `QUICK_DEPLOYMENT_STEPS.md` - This file

---

## 🐛 If Something Goes Wrong

### CORS Error?
```
Error: "blocked by CORS policy"
```
**Fix**: Make sure you pushed the backend changes and Render redeployed

### API calls going to localhost?
```
Error: "Failed to fetch" or "ERR_CONNECTION_REFUSED"
```
**Fix**: 
1. Check Vercel environment variable is set
2. Redeploy on Vercel after setting the variable

### 404 on page refresh?
```
Error: "404 Page Not Found" when refreshing on /dashboard
```
**Fix**: The `vercel.json` file handles this - make sure it's committed

---

## 📱 Test Checklist

After deployment, test these features:

- [ ] Login works
- [ ] Dashboard loads with data
- [ ] Can create transactions
- [ ] Can edit transactions
- [ ] Can delete transactions
- [ ] Can create budgets
- [ ] Can edit budgets
- [ ] Can delete budgets
- [ ] Charts display correctly
- [ ] Filters work
- [ ] Pagination works
- [ ] Toast notifications appear
- [ ] Logout works

---

## 🔄 For Future Updates

Whenever you make changes:

```bash
# 1. Make your changes
# 2. Commit and push
git add .
git commit -m "Your change description"
git push origin main

# 3. Both Render and Vercel will auto-deploy!
```

---

## 📞 Need Help?

Check the full guide: `DEPLOYMENT_GUIDE.md`

Common issues and solutions are documented there.

---

**That's it! Your app should now be live and working! 🎉**

