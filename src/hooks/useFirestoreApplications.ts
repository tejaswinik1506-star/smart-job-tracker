import { useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { FirestoreService } from '../services/firestore.service';
import type { JobApplication } from '../types';

/**
 * Custom hook for managing applications with Firestore
 * Handles real-time sync, CRUD operations, and data migration
 */
export const useFirestoreApplications = (userId: string | null) => {
  const {
    applications,
    setApplications,
    addApplication: addAppToStore,
    updateApplication: updateAppInStore,
    deleteApplication: deleteAppFromStore,
    setIsLoadingApplications,
    setError,
    addToast,
    hasMigratedToFirestore,
    setHasMigratedToFirestore,
  } = useAppStore();

  /**
   * Initialize Firestore sync and migrate localStorage data
   */
  useEffect(() => {
    if (!userId) return;

    let unsubscribe: (() => void) | undefined;

    const initializeFirestore = async () => {
      try {
        setIsLoadingApplications(true);
        setError(null);

        // Check if we need to migrate from localStorage
        if (!hasMigratedToFirestore && applications.length > 0) {
          console.log('Migrating existing data to Firestore...');
          await FirestoreService.migrateFromLocalStorage(userId, applications);
          setHasMigratedToFirestore(true);
          addToast({
            message: 'Data successfully synced to cloud',
            type: 'success',
          });
        }

        // Set up real-time listener
        unsubscribe = FirestoreService.subscribeToApplications(
          userId,
          (updatedApplications) => {
            setApplications(updatedApplications);
            setIsLoadingApplications(false);
          },
          (error) => {
            setError(error.message);
            setIsLoadingApplications(false);
            addToast({
              message: error.message,
              type: 'error',
            });
          }
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to sync data';
        setError(message);
        setIsLoadingApplications(false);
        addToast({
          message,
          type: 'error',
        });
      }
    };

    initializeFirestore();

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId, hasMigratedToFirestore]); // Only re-run if userId or migration status changes

  /**
   * Add new application to Firestore
   */
  const addApplication = useCallback(
    async (application: Omit<JobApplication, 'id'>) => {
      if (!userId) return;

      try {
        const newApp = await FirestoreService.addApplication({
          ...application,
          userId,
        });
        addAppToStore(newApp);
        addToast({
          message: 'Application added successfully',
          type: 'success',
        });
        return newApp;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to add application';
        addToast({
          message,
          type: 'error',
        });
        throw error;
      }
    },
    [userId, addAppToStore, addToast]
  );

  /**
   * Update existing application in Firestore
   */
  const updateApplication = useCallback(
    async (id: string, updates: Partial<Omit<JobApplication, 'id' | 'userId' | 'createdAt'>>) => {
      try {
        await FirestoreService.updateApplication(id, updates);
        updateAppInStore(id, updates);
        addToast({
          message: 'Application updated successfully',
          type: 'success',
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update application';
        addToast({
          message,
          type: 'error',
        });
        throw error;
      }
    },
    [updateAppInStore, addToast]
  );

  /**
   * Delete application from Firestore
   */
  const deleteApplication = useCallback(
    async (id: string) => {
      try {
        await FirestoreService.deleteApplication(id);
        deleteAppFromStore(id);
        addToast({
          message: 'Application deleted',
          type: 'info',
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete application';
        addToast({
          message,
          type: 'error',
        });
        throw error;
      }
    },
    [deleteAppFromStore, addToast]
  );

  /**
   * Export all user data
   */
  const exportData = useCallback(async () => {
    if (!userId) return;

    try {
      const jsonData = await FirestoreService.exportUserData(userId);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `job-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast({
        message: 'Data exported successfully',
        type: 'success',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to export data';
      addToast({
        message,
        type: 'error',
      });
    }
  }, [userId, addToast]);

  /**
   * Import data from JSON file
   */
  const importData = useCallback(
    async (file: File) => {
      if (!userId) return;

      try {
        const text = await file.text();
        await FirestoreService.importUserData(userId, text);
        addToast({
          message: 'Data imported successfully',
          type: 'success',
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to import data';
        addToast({
          message,
          type: 'error',
        });
      }
    },
    [userId, addToast]
  );

  return {
    applications,
    addApplication,
    updateApplication,
    deleteApplication,
    exportData,
    importData,
  };
};
