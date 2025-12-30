import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, JobApplication } from '../types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Theme state
  isDarkMode: boolean;
  toggleTheme: () => void;
  
  // Applications state (now synced with Firestore)
  applications: JobApplication[];
  setApplications: (applications: JobApplication[]) => void;
  addApplication: (application: JobApplication) => void;
  updateApplication: (id: string, application: Partial<JobApplication>) => void;
  deleteApplication: (id: string) => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isLoadingApplications: boolean;
  setIsLoadingApplications: (isLoading: boolean) => void;
  
  // Error state
  error: string | null;
  setError: (error: string | null) => void;
  
  // Toast state
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Data migration flag
  hasMigratedToFirestore: boolean;
  setHasMigratedToFirestore: (migrated: boolean) => void;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Theme state - Default to dark mode for this app
      isDarkMode: true,
      toggleTheme: () => set((state) => {
        const newMode = !state.isDarkMode;
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: newMode };
      }),
      
      // Applications state
      applications: [],
      setApplications: (applications) => set({ applications }),
      addApplication: (application) =>
        set((state) => ({
          applications: [...state.applications, application],
        })),
      updateApplication: (id, updatedData) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, ...updatedData, updatedAt: new Date().toISOString() } : app
          ),
        })),
      deleteApplication: (id) =>
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
        })),
      
      // UI state
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
      isLoadingApplications: false,
      setIsLoadingApplications: (isLoading) => set({ isLoadingApplications: isLoading }),
      
      // Error state
      error: null,
      setError: (error) => set({ error }),
      
      // Toast state
      toasts: [],
      addToast: (toast) => {
        const id = Date.now().toString();
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }));
        
        // Auto remove after 5 seconds
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, 5000);
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
      
      // Data migration
      hasMigratedToFirestore: false,
      setHasMigratedToFirestore: (migrated) => set({ hasMigratedToFirestore: migrated }),
    }),
    {
      name: 'job-tracker-storage',
      partialize: (state) => ({
        user: state.user,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);
