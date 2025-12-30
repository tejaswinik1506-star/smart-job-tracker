# Firebase Backend Setup Guide

Complete guide to set up Firebase backend for production deployment.

## 🚀 Quick Setup

### Step 1: Firebase Project Setup

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your existing project** or create a new one
3. **Enable Firestore Database**:
   - Go to "Build" → "Firestore Database"
   - Click "Create database"
   - Start in **production mode** (we'll upload our custom rules)
   - Choose your region (closest to your users)

### Step 2: Deploy Firestore Rules

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Select your project from the list
# Accept defaults for firestore.rules and firestore.indexes.json

# Deploy security rules and indexes
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### Step 3: Verify Security Rules

Go to Firebase Console → Firestore Database → Rules

You should see:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /applications/{applicationId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### Step 4: Test the Setup

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Test user flow**:
   - Sign in with Google or Email
   - Add a test application
   - Check Firebase Console → Firestore Database
   - You should see your application in the `applications` collection

3. **Test security**:
   - Open browser dev tools → Console
   - Try to access another user's data (should fail)
   - Verify only your data is visible

## 📊 Firestore Structure

### Collections

#### `applications`
```typescript
{
  id: string (auto-generated)
  company: string
  role: string
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected'
  appliedDate: string (ISO format)
  notes: string
  userId: string (Firebase Auth UID)
  createdAt: string (ISO timestamp)
  updatedAt: string (ISO timestamp)
}
```

#### `users` (optional for future features)
```typescript
{
  id: string (Firebase Auth UID)
  email: string
  displayName: string
  photoURL: string
  createdAt: string
  lastLogin: string
  preferences: object
}
```

## 🔒 Security Rules Explained

### Applications Collection

**Read Rule**:
```javascript
allow read: if request.auth != null && resource.data.userId == request.auth.uid;
```
- Users must be authenticated
- Can only read their own applications (userId matches auth.uid)

**Create Rule**:
```javascript
allow create: if request.auth != null 
  && request.resource.data.userId == request.auth.uid
  && isValidApplication();
```
- Must be authenticated
- Can only create applications with their own userId
- Data must pass validation (company, role, status, etc.)

**Update Rule**:
```javascript
allow update: if request.auth != null 
  && resource.data.userId == request.auth.uid
  && request.resource.data.userId == request.auth.uid;
```
- Must be authenticated
- Can only update their own applications
- Cannot change the userId field

**Delete Rule**:
```javascript
allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
```
- Must be authenticated
- Can only delete their own applications

## 📈 Firestore Indexes

Indexes are automatically created for common queries:

1. **By User + Created Date (desc)**:
   ```
   Collection: applications
   Fields: userId (ASC), createdAt (DESC)
   ```

2. **By User + Status + Created Date (desc)**:
   ```
   Collection: applications
   Fields: userId (ASC), status (ASC), createdAt (DESC)
   ```

3. **By User + Applied Date (desc)**:
   ```
   Collection: applications
   Fields: userId (ASC), appliedDate (DESC)
   ```

These indexes optimize queries for:
- Fetching all user applications sorted by date
- Filtering by status
- Sorting by applied date

## 🔄 Data Migration

### Automatic Migration

The app automatically migrates existing localStorage data to Firestore on first login after backend setup.

### Manual Migration

If automatic migration fails:

1. **Export from localStorage**:
   ```javascript
   // In browser console
   const data = localStorage.getItem('job-tracker-storage');
   console.log(JSON.parse(data));
   ```

2. **Use import feature in app**:
   - Go to Applications page
   - Click "Import Data" button (if available)
   - Upload the JSON file

## 💾 Backup & Export

### Automatic Backups

Firebase automatically backs up your Firestore data, but you should also:

1. **Enable Daily Backups** (Blaze plan):
   - Go to Firestore Database → Backups
   - Set up automated daily backups

2. **Export Data Regularly**:
   - Use the app's built-in export feature
   - Downloads JSON file of all user data

### Manual Export via Firebase CLI

```bash
# Export all Firestore data
gcloud firestore export gs://your-bucket-name/exports/$(date +%Y%m%d)

# Import from backup
gcloud firestore import gs://your-bucket-name/exports/20231215
```

## 🌐 Production Deployment

### Environment Variables

Ensure all Firebase config variables are set in production:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Netlify Deployment

```bash
# Build the app
npm run build

# Deploy to Netlify
netlify deploy --prod

# Set environment variables in Netlify dashboard
# Site Settings → Build & Deploy → Environment
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
# Project Settings → Environment Variables
```

## 📊 Monitoring & Analytics

### Enable Firestore Monitoring

1. Go to Firebase Console → Firestore Database → Usage
2. Monitor:
   - Read/Write operations
   - Storage size
   - Active connections

### Set Up Alerts

1. Go to Firebase Console → Project Settings → Integrations
2. Enable:
   - Cloud Monitoring
   - Performance Monitoring
   - Analytics

## 🚨 Troubleshooting

### Common Issues

**Error: "Missing or insufficient permissions"**
- Check Firestore rules are deployed correctly
- Verify user is authenticated
- Ensure userId matches authenticated user

**Error: "Index not found"**
- Deploy Firestore indexes: `firebase deploy --only firestore:indexes`
- Wait 5-10 minutes for indexes to build
- Check Firebase Console → Firestore → Indexes

**Data not syncing**
- Check internet connection
- Verify Firestore rules allow access
- Check browser console for errors
- Try signing out and back in

**Migration failed**
- Check localStorage has data
- Verify Firebase config is correct
- Manually export and import data

## 🎯 Performance Optimization

### Best Practices

1. **Limit Query Results**:
   ```typescript
   query(collection, where(...), limit(50))
   ```

2. **Use Firestore Offline Persistence**:
   ```typescript
   enableIndexedDbPersistence(db);
   ```

3. **Batch Operations**:
   ```typescript
   const batch = writeBatch(db);
   // Add multiple operations
   await batch.commit();
   ```

4. **Optimize Real-time Listeners**:
   - Only subscribe to data you need
   - Unsubscribe when component unmounts
   - Use pagination for large datasets

## ✅ Production Checklist

- [ ] Firestore Database created in production mode
- [ ] Security rules deployed and tested
- [ ] Indexes deployed successfully
- [ ] Firebase environment variables set in hosting platform
- [ ] Data migration tested with test account
- [ ] Multi-user functionality tested
- [ ] Security rules tested (cannot access other user's data)
- [ ] Backup strategy configured
- [ ] Monitoring and alerts enabled
- [ ] Performance tested with realistic data volume
- [ ] Offline mode tested
- [ ] Error handling verified

## 🎉 You're Ready!

Your Firebase backend is now production-ready with:
- ✅ Secure multi-user data storage
- ✅ Real-time synchronization across devices
- ✅ Automatic data migration from localStorage
- ✅ Role-based access control
- ✅ Backup and export capabilities
- ✅ Production-grade security rules

Your users can now:
- Access their data from any device
- Have their data automatically synced
- Rest assured their data is secure and private
- Export their data anytime

## 📚 Additional Resources

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Firebase Pricing](https://firebase.google.com/pricing)
