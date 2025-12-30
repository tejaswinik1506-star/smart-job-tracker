import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import type { JobApplication } from '../types';

const COLLECTIONS = {
  APPLICATIONS: 'applications',
  USERS: 'users',
} as const;

/**
 * Firestore Service for Job Applications
 * Handles all database operations with proper error handling
 */
export class FirestoreService {
  /**
   * Fetch all applications for a specific user
   */
  static async getApplicationsByUser(userId: string): Promise<JobApplication[]> {
    try {
      const applicationsRef = collection(db, COLLECTIONS.APPLICATIONS);
      const q = query(
        applicationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const applications: JobApplication[] = [];

      querySnapshot.forEach((doc) => {
        applications.push({
          id: doc.id,
          ...doc.data(),
        } as JobApplication);
      });

      return applications;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw new Error('Failed to fetch applications. Please try again.');
    }
  }

  /**
   * Subscribe to real-time updates for user applications
   */
  static subscribeToApplications(
    userId: string,
    onUpdate: (applications: JobApplication[]) => void,
    onError?: (error: Error) => void
  ) {
    try {
      const applicationsRef = collection(db, COLLECTIONS.APPLICATIONS);
      const q = query(
        applicationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const applications: JobApplication[] = [];
          querySnapshot.forEach((doc) => {
            applications.push({
              id: doc.id,
              ...doc.data(),
            } as JobApplication);
          });
          onUpdate(applications);
        },
        (error) => {
          console.error('Error in real-time listener:', error);
          if (onError) {
            onError(new Error('Real-time sync failed. Please refresh the page.'));
          }
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up real-time listener:', error);
      throw new Error('Failed to set up real-time sync.');
    }
  }

  /**
   * Get a single application by ID
   */
  static async getApplicationById(applicationId: string): Promise<JobApplication | null> {
    try {
      const applicationRef = doc(db, COLLECTIONS.APPLICATIONS, applicationId);
      const applicationDoc = await getDoc(applicationRef);

      if (applicationDoc.exists()) {
        return {
          id: applicationDoc.id,
          ...applicationDoc.data(),
        } as JobApplication;
      }

      return null;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw new Error('Failed to fetch application details.');
    }
  }

  /**
   * Add a new application to Firestore
   */
  static async addApplication(
    application: Omit<JobApplication, 'id'>
  ): Promise<JobApplication> {
    try {
      const applicationsRef = collection(db, COLLECTIONS.APPLICATIONS);
      const docRef = await addDoc(applicationsRef, {
        ...application,
        createdAt: Timestamp.now().toMillis().toString(),
        updatedAt: Timestamp.now().toMillis().toString(),
      });

      return {
        id: docRef.id,
        ...application,
      } as JobApplication;
    } catch (error) {
      console.error('Error adding application:', error);
      throw new Error('Failed to add application. Please try again.');
    }
  }

  /**
   * Update an existing application
   */
  static async updateApplication(
    applicationId: string,
    updates: Partial<Omit<JobApplication, 'id' | 'userId' | 'createdAt'>>
  ): Promise<void> {
    try {
      const applicationRef = doc(db, COLLECTIONS.APPLICATIONS, applicationId);
      await updateDoc(applicationRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating application:', error);
      throw new Error('Failed to update application. Please try again.');
    }
  }

  /**
   * Delete an application
   */
  static async deleteApplication(applicationId: string): Promise<void> {
    try {
      const applicationRef = doc(db, COLLECTIONS.APPLICATIONS, applicationId);
      await deleteDoc(applicationRef);
    } catch (error) {
      console.error('Error deleting application:', error);
      throw new Error('Failed to delete application. Please try again.');
    }
  }

  /**
   * Batch delete multiple applications
   */
  static async batchDeleteApplications(applicationIds: string[]): Promise<void> {
    try {
      const batch = writeBatch(db);

      applicationIds.forEach((id) => {
        const applicationRef = doc(db, COLLECTIONS.APPLICATIONS, id);
        batch.delete(applicationRef);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error batch deleting applications:', error);
      throw new Error('Failed to delete applications. Please try again.');
    }
  }

  /**
   * Migrate data from localStorage to Firestore (one-time operation)
   */
  static async migrateFromLocalStorage(
    userId: string,
    applications: JobApplication[]
  ): Promise<void> {
    try {
      const batch = writeBatch(db);

      applications.forEach((app) => {
        const appRef = doc(collection(db, COLLECTIONS.APPLICATIONS));
        batch.set(appRef, {
          ...app,
          userId,
          createdAt: app.createdAt || new Date().toISOString(),
          updatedAt: app.updatedAt || new Date().toISOString(),
        });
      });

      await batch.commit();
      console.log('Successfully migrated data to Firestore');
    } catch (error) {
      console.error('Error migrating data:', error);
      throw new Error('Failed to migrate data. Please try again.');
    }
  }

  /**
   * Export all user data as JSON
   */
  static async exportUserData(userId: string): Promise<string> {
    try {
      const applications = await this.getApplicationsByUser(userId);
      const exportData = {
        exportDate: new Date().toISOString(),
        userId,
        applications,
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data.');
    }
  }

  /**
   * Import data from JSON backup
   */
  static async importUserData(userId: string, jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      const applications = data.applications || [];

      await this.migrateFromLocalStorage(userId, applications);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data. Please check the file format.');
    }
  }
}
