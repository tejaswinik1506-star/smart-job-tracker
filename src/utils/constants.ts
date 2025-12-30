import type { ApplicationStatus } from '../types';

export const APP_NAME = 'Smart Job Tracker';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Interview',
  'Offer',
  'Rejected',
];

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Interview: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Offer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  APPLICATIONS: '/applications',
  RESUME_ANALYZER: '/resume-analyzer',
};

export const FIREBASE_ERRORS: Record<string, string> = {
  'auth/user-not-found': 'No user found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/email-already-in-use': 'Email already in use',
  'auth/weak-password': 'Password should be at least 6 characters',
  'auth/invalid-email': 'Invalid email address',
  'auth/popup-closed-by-user': 'Sign-in popup was closed',
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return formatDate(dateString);
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
