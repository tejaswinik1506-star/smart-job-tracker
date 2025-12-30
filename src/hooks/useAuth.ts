import { useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { useAppStore } from '../store/useAppStore';
import { FIREBASE_ERRORS } from '../utils/constants';
import type { User } from '../types';

export const useAuth = () => {
  const { user, setUser, addToast } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser]);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      addToast({ message: 'Signed in successfully!', type: 'success' });
    } catch (error: any) {
      const message = FIREBASE_ERRORS[error.code] || 'Failed to sign in';
      addToast({ message, type: 'error' });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      addToast({ message: 'Account created successfully!', type: 'success' });
    } catch (error: any) {
      const message = FIREBASE_ERRORS[error.code] || 'Failed to create account';
      addToast({ message, type: 'error' });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      addToast({ message: 'Signed in with Google!', type: 'success' });
    } catch (error: any) {
      const message = FIREBASE_ERRORS[error.code] || 'Failed to sign in with Google';
      addToast({ message, type: 'error' });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      addToast({ message: 'Signed out successfully!', type: 'success' });
    } catch (error: any) {
      addToast({ message: 'Failed to sign out', type: 'error' });
      throw error;
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };
};
