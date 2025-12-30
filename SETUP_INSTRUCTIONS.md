# 🚀 Smart Job Tracker - Setup Instructions

## Quick Start Guide

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project"
   - Enter project name: "smart-job-tracker"
   - Disable Google Analytics (optional)
   - Click "Create Project"

2. **Enable Authentication**
   - In Firebase Console, go to "Authentication"
   - Click "Get Started"
   - Enable "Email/Password" sign-in method
   - Enable "Google" sign-in method
   - Add your email as authorized domain

3. **Create Firestore Database**
   - In Firebase Console, go to "Firestore Database"
   - Click "Create Database"
   - Select "Start in test mode" (for development)
   - Choose your location
   - Click "Enable"

4. **Get Firebase Config**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click web icon (</>) to add a web app
   - Register app name: "smart-job-tracker-web"
   - Copy the firebaseConfig object

5. **Configure Environment Variables**
   ```bash
   # Copy example env file
   copy .env.example .env
   
   # Edit .env and add your Firebase credentials
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

### Step 3: Run Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 4: Test the Application

1. **Create an account**
   - Click "Sign Up"
   - Enter email and password (min 6 characters)
   - Or use "Sign in with Google"

2. **Add a job application**
   - Click "Add Application"
   - Fill in company, role, status, date, and notes
   - Click "Add Application"

3. **Test Resume Analyzer**
   - Go to "Resume Analyzer"
   - Paste your resume text
   - Paste a job description
   - Click "Analyze Match"

## Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login and Deploy**
   ```bash
   vercel login
   vercel
   ```

3. **Set Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Settings → Environment Variables
   - Add all VITE_* variables from .env

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Hosting**
   ```bash
   firebase login
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to: `dist`
   - Configure as single-page app: `Yes`
   - Don't overwrite index.html

3. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## Troubleshooting

### Issue: "Module not found" errors
**Solution:** Delete node_modules and reinstall
```bash
rmdir /s node_modules
npm install
```

### Issue: Firebase authentication not working
**Solution:** Check these:
- Ensure .env file exists with correct values
- Verify authentication methods are enabled in Firebase Console
- Check if your domain is authorized in Firebase Console

### Issue: Tailwind styles not applying
**Solution:** Ensure postcss.config.js is correct and restart dev server
```bash
npm run dev
```

### Issue: Build fails
**Solution:** Clear cache and rebuild
```bash
rmdir /s dist
npm run build
```

## Project Structure Explained

```
src/
├── components/
│   ├── layout/          # Layout wrapper (header, footer, nav)
│   ├── ui/              # Reusable UI components
│   └── ProtectedRoute.tsx # Auth guard for routes
├── pages/               # Route pages
├── services/            # Firebase & external services
├── store/               # Zustand state management
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── utils/               # Helper functions & constants
```

## Development Tips

1. **State Management**
   - Use Zustand store for global state
   - Local state with useState for component-specific data

2. **Styling**
   - Use Tailwind utility classes
   - Check tailwind.config.js for custom theme values
   - Dark mode classes: `dark:bg-gray-800`

3. **Icons**
   - Using emoji for simplicity (can replace with icon library)

4. **Type Safety**
   - All components are typed with TypeScript
   - Check types/index.ts for data models

## Testing Accounts

For development, you can use any email/password combination:
- Email: test@example.com
- Password: test123

Or sign in with your Google account.

## Support

If you encounter any issues:
1. Check this setup guide
2. Review the main README.md
3. Check Firebase Console for errors
4. Open an issue on GitHub

---

Happy Coding! 🚀
