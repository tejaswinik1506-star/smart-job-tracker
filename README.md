# 💼 Smart Job Tracker & Resume Analyzer# React + TypeScript + Vite



A modern, production-ready web application built with React, TypeScript, and Firebase that helps job seekers track applications, analyze resumes, and visualize their job search progress.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



![React](https://img.shields.io/badge/React-18.3-blue)Currently, two official plugins are available:

![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)

![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

![Firebase](https://img.shields.io/badge/Firebase-11.1-orange)- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

![License](https://img.shields.io/badge/license-MIT-green)

## React Compiler

## ✨ Features

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### 🔐 Authentication

- Email & password authentication## Expanding the ESLint configuration

- Google Sign-In integration

- Persistent login sessionsIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- Protected routes

```js

### 📊 Dashboardexport default defineConfig([

- Real-time application statistics  globalIgnores(['dist']),

- Interactive weekly activity charts  {

- Application status breakdown    files: ['**/*.{ts,tsx}'],

- Recent activity feed    extends: [

- Quick action buttons      // Other configs...



### 📝 Application Management      // Remove tseslint.configs.recommended and replace with this

- Add, edit, and delete job applications      tseslint.configs.recommendedTypeChecked,

- Track application status (Applied, Interview, Offer, Rejected)      // Alternatively, use this for stricter rules

- Search and filter functionality      tseslint.configs.strictTypeChecked,

- Sort by date or company name      // Optionally, add this for stylistic rules

- Detailed notes for each application      tseslint.configs.stylisticTypeChecked,



### 🔍 Resume Analyzer      // Other configs...

- Upload resume (text files)    ],

- Paste job descriptions    languageOptions: {

- Keyword extraction and matching      parserOptions: {

- Visual match percentage        project: ['./tsconfig.node.json', './tsconfig.app.json'],

- Identify missing keywords        tsconfigRootDir: import.meta.dirname,

- AI-powered suggestions for improvement      },

      // other options...

### 🎨 UI/UX    },

- Clean, modern interface  },

- Dark/Light mode toggle])

- Fully responsive design (mobile, tablet, desktop)```

- Smooth animations with Framer Motion

- Loading skeletonsYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

- Toast notifications

- Accessible and keyboard-friendly```js

// eslint.config.js

## 🚀 Tech Stackimport reactX from 'eslint-plugin-react-x'

import reactDom from 'eslint-plugin-react-dom'

### Frontend

- **React 18** - UI libraryexport default defineConfig([

- **TypeScript** - Type safety  globalIgnores(['dist']),

- **Vite** - Build tool  {

- **Tailwind CSS** - Styling    files: ['**/*.{ts,tsx}'],

- **React Router v6** - Routing    extends: [

- **Zustand** - State management      // Other configs...

- **Recharts** - Data visualization      // Enable lint rules for React

- **Framer Motion** - Animations      reactX.configs['recommended-typescript'],

      // Enable lint rules for React DOM

### Backend & Services      reactDom.configs.recommended,

- **Firebase Authentication** - User management    ],

- **Firestore Database** - Data storage    languageOptions: {

- **Firebase Storage** - File uploads      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

### Development Tools        tsconfigRootDir: import.meta.dirname,

- **ESLint** - Code linting      },

- **PostCSS** - CSS processing      // other options...

- **Git** - Version control    },

  },

## 📦 Installation])

```

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Setup Instructions

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd ReactProject
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore Database
   - Copy your Firebase configuration

4. **Configure environment variables**
   - Copy `.env.example` to `.env`
   ```bash
   copy .env.example .env
   ```
   - Fill in your Firebase credentials in `.env`:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
   - Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── assets/              # Static assets
├── components/
│   ├── layout/         # Layout components (Header, Footer)
│   ├── ui/             # Reusable UI components
│   └── ProtectedRoute.tsx
├── pages/
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Applications.tsx # Application management
│   ├── ResumeAnalyzer.tsx
│   ├── Login.tsx       # Authentication
│   └── NotFound.tsx    # 404 page
├── services/
│   ├── firebase.ts     # Firebase configuration
│   └── resumeAnalyzer.ts # Resume analysis logic
├── store/
│   └── useAppStore.ts  # Zustand global state
├── hooks/
│   └── useAuth.ts      # Authentication hook
├── types/
│   └── index.ts        # TypeScript types
├── utils/
│   └── constants.ts    # Constants and utilities
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from `.env`

4. **Redeploy**
```bash
vercel --prod
```

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 📸 Screenshots

*(Add screenshots of your application here)*

- Dashboard with statistics
- Applications management page
- Resume analyzer interface
- Dark mode theme

## 🔐 Security Notes

- Never commit `.env` file to Git
- Environment variables are properly secured
- Firebase security rules should be configured
- All API keys are client-safe (Firebase)

## 📈 Performance Optimizations

- ✅ Lazy loading of route components
- ✅ Code splitting
- ✅ Memoized expensive computations
- ✅ Optimized re-renders with Zustand
- ✅ Debounced search inputs

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Resume Description

```
Smart Job Tracker – React Application

Developed a full-featured job tracking platform with resume analysis, 
real-time analytics, and modern UI/UX. Implemented authentication, 
scalable architecture, and performance optimizations using modern React tools.

Tech Stack: React 18, TypeScript, Tailwind CSS, Firebase, Vite, Zustand, 
React Router, Recharts, Framer Motion.

Key Features:
- User authentication with Firebase (Email/Password & Google Sign-In)
- Real-time job application tracking with CRUD operations
- Resume analyzer with keyword matching and suggestions
- Interactive dashboard with data visualizations
- Responsive design with dark/light mode
- State management with Zustand
- Lazy loading and code splitting for performance
```

## 🎯 Future Enhancements

- [ ] AI-powered resume scoring with OpenAI API
- [ ] Email reminders for follow-ups
- [ ] Export applications to CSV/PDF
- [ ] Interview preparation resources
- [ ] Calendar integration
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics and insights

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- React team for an amazing framework
- Firebase for backend services
- Tailwind CSS for utility-first styling
- All open-source contributors

---

**⭐ If you found this project helpful, please give it a star!**

Built with ❤️ using React, TypeScript, and Firebase
