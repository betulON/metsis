# Decap CMS Setup Guide for Metsis Website

## ✅ What's Been Done

Your website now has a **Content Management System (CMS)** installed! This allows non-technical people to edit content without knowing GitHub or code.

## 📁 What Was Added

- `/admin/` - CMS admin interface folder
  - `index.html` - The admin login page
  - `config.yml` - Configuration for what content can be edited
- `/content/` - Folder storing all editable content as JSON files
  - Contact information
  - Hero section
  - Projects
  - Corporate information
  - Slider images

## 🔧 Setup Steps (Do This Once)

### Step 1: Enable GitHub Pages or Deploy to Netlify

**Option A: GitHub Pages (Free)**

1. Go to your repository: https://github.com/betulON/metsis
2. Click **Settings** → **Pages**
3. Under "Source", select **main** branch
4. Click **Save**
5. Your site will be available at: `https://betulon.github.io/metsis/`

**Option B: Netlify (Recommended - Free)**

1. Go to https://netlify.com and sign up/login with GitHub
2. Click "Add new site" → "Import an existing project"
3. Select GitHub and choose your `metsis` repository
4. Click "Deploy site"
5. Your site will get a URL like: `https://metsis.netlify.app`

### Step 2: Set Up Authentication

#### For GitHub Pages:

You'll need to set up a GitHub OAuth App:

1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in:
   - **Application name**: Metsis CMS
   - **Homepage URL**: `https://betulon.github.io/metsis/`
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
4. Click "Register application"
5. Copy the **Client ID**

Then deploy a simple auth server (you can use https://github.com/vencax/netlify-cms-github-oauth-provider)

#### For Netlify (Easier):

1. In Netlify dashboard, go to **Site settings** → **Identity**
2. Click "Enable Identity"
3. Under "Registration preferences", select "Invite only"
4. Under "Services" → "Git Gateway", click "Enable Git Gateway"
5. Done! ✅

### Step 3: Invite Team Members (Netlify Only)

1. Go to **Identity** tab in Netlify
2. Click "Invite users"
3. Enter their email addresses
4. They'll receive an invitation email
5. They click the link, set a password, and can now access `/admin`

## 🎨 How to Use the CMS

### For Editors (Non-Technical Users):

1. **Access the CMS**:

   - Go to: `yoursite.com/admin`
   - Example: `https://metsis.netlify.app/admin`

2. **Login**:

   - Click "Login with Netlify Identity" (or GitHub)
   - Enter your credentials

3. **Edit Content**:

   - You'll see sections like:
     - **Site Settings** (contact info, hero section)
     - **Projects** (add/edit/delete projects)
     - **References** (add/edit references)
     - **Corporate** (company info, quality, people)
     - **Homepage Slider** (manage slider images)

4. **Make Changes**:

   - Click on any item to edit
   - Use the visual editor (like Word)
   - Upload images by dragging and dropping
   - Click **Save** when done

5. **Publish**:
   - Click **Publish** → **Publish now**
   - Changes will appear on the website in ~1 minute

## 🔐 User Roles

- **Admin**: Can edit everything and invite users
- **Editor**: Can create and edit content
- **Viewer**: Can only view (if you need this)

## 📝 What Can Be Edited

✅ Contact information (address, phone, email)  
✅ Social media links  
✅ Homepage hero section (video, heading, description)  
✅ Projects (add, edit, delete with images)  
✅ References (company logos and descriptions)  
✅ Corporate pages (company, quality, people)  
✅ Homepage slider images

## 🚀 Next Steps

1. **Deploy your site** (GitHub Pages or Netlify)
2. **Set up authentication** (follow Step 2 above)
3. **Invite team members** (if using Netlify)
4. **Test the admin panel** at `/admin`

## 🆘 Troubleshooting

### Can't access /admin

- Make sure your site is deployed (not just local)
- Check that authentication is set up
- Try clearing browser cache

### Changes not appearing

- Wait 1-2 minutes after publishing
- Check that Git Gateway is enabled (Netlify)
- Refresh the page with Ctrl+F5 (hard refresh)

### "Config Error"

- Make sure `admin/config.yml` exists
- Check that the repository name in config matches your GitHub repo

## 📞 Need Help?

If you need help with setup:

1. Check the Netlify Identity documentation
2. Or use GitHub OAuth (more complex but free)

---

## Alternative: Simple GitHub Authentication

If you want editors to login with GitHub directly (no Netlify):

1. Update `admin/config.yml`:

```yaml
backend:
  name: github
  repo: betulON/metsis
  branch: main
```

2. Users will login with their GitHub accounts
3. They need to have **write access** to your repository
4. Go to repository Settings → Collaborators → Add people

This is simpler but requires editors to have GitHub accounts.
