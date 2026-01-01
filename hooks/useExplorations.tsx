import { Exploration, generateId, getDayOfYear } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = '@explorations';
const BACKUP_FILENAME = 'explorations_backup.json';
const SYNC_SERVER_URL = 'http://localhost:3456';

const sampleExplorations: Exploration[] = [
  {
    id: 'sample_1',
    title: 'Welcome to 2026!',
    description: 'Your first exploration of the year. Start building amazing UIs!',
    date: new Date().toISOString().split('T')[0],
    dayNumber: getDayOfYear(new Date()),
    category: 'mobile',
    status: 'idea',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface ExplorationsContextType {
  explorations: Exploration[];
  isLoading: boolean;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  addExploration: (data: Omit<Exploration, 'id' | 'dayNumber' | 'createdAt' | 'updatedAt'>) => Promise<Exploration>;
  updateExploration: (id: string, data: Partial<Exploration>) => Promise<void>;
  deleteExploration: (id: string) => Promise<void>;
  getStreak: () => number;
  getByDate: (date: string) => Exploration[];
  reload: () => Promise<void>;
}

const ExplorationsContext = createContext<ExplorationsContextType | null>(null);

export function ExplorationsProvider({ children }: { children: ReactNode }): React.ReactNode {
  const [explorations, setExplorations] = useState<Exploration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  const getBackupFile = useCallback(() => {
    return new File(Paths.document, BACKUP_FILENAME);
  }, []);

  const syncToRepo = useCallback(async (data: Exploration[]) => {
    try {
      setSyncStatus('syncing');
      const response = await fetch(`${SYNC_SERVER_URL}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ explorations: data }),
      });
      if (response.ok) {
        setSyncStatus('synced');
      } else {
        throw new Error('Sync failed');
      }
    } catch {
      setSyncStatus('error');
    }
  }, []);

  const loadFromRepo = useCallback(async (): Promise<Exploration[] | null> => {
    try {
      const response = await fetch(`${SYNC_SERVER_URL}/data`);
      if (response.ok) {
        const data = await response.json();
        return data.explorations || null;
      }
    } catch {
      // Server not running
    }
    return null;
  }, []);

  const backupToFile = useCallback(async (data: Exploration[]) => {
    try {
      const backupFile = getBackupFile();
      const backupData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        explorations: data,
      };
      await backupFile.write(JSON.stringify(backupData, null, 2));
    } catch (error) {
      console.error('Failed to backup:', error);
    }
  }, [getBackupFile]);

  const restoreFromBackup = useCallback(async (): Promise<Exploration[] | null> => {
    try {
      const backupFile = getBackupFile();
      if (backupFile.exists) {
        const content = await backupFile.text();
        const backupData = JSON.parse(content);
        return backupData.explorations;
      }
    } catch (error) {
      console.error('Failed to restore:', error);
    }
    return null;
  }, [getBackupFile]);

  const loadExplorations = useCallback(async () => {
    try {
      const repoData = await loadFromRepo();
      if (repoData && repoData.length > 0) {
        setExplorations(repoData);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(repoData));
        await backupToFile(repoData);
        setIsLoading(false);
        return;
      }

      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setExplorations(data);
        await backupToFile(data);
        await syncToRepo(data);
        setIsLoading(false);
        return;
      }

      const backupData = await restoreFromBackup();
      if (backupData && backupData.length > 0) {
        setExplorations(backupData);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(backupData));
        await syncToRepo(backupData);
        setIsLoading(false);
        return;
      }

      setExplorations(sampleExplorations);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleExplorations));
      await backupToFile(sampleExplorations);
      await syncToRepo(sampleExplorations);
    } catch (error) {
      console.error('Failed to load:', error);
      setExplorations(sampleExplorations);
    } finally {
      setIsLoading(false);
    }
  }, [loadFromRepo, backupToFile, restoreFromBackup, syncToRepo]);

  const saveExplorations = useCallback(async (newExplorations: Exploration[]) => {
    try {
      setExplorations(newExplorations); // Update state immediately
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newExplorations));
      await backupToFile(newExplorations);
      await syncToRepo(newExplorations);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  }, [backupToFile, syncToRepo]);

  const addExploration = useCallback(async (
    data: Omit<Exploration, 'id' | 'dayNumber' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date();
    const newExploration: Exploration = {
      ...data,
      id: generateId(),
      dayNumber: getDayOfYear(new Date(data.date)),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    const updated = [newExploration, ...explorations];
    await saveExplorations(updated);
    return newExploration;
  }, [explorations, saveExplorations]);

  const updateExploration = useCallback(async (id: string, data: Partial<Exploration>) => {
    const updated = explorations.map(exp =>
      exp.id === id
        ? { ...exp, ...data, updatedAt: new Date().toISOString() }
        : exp
    );
    await saveExplorations(updated);
  }, [explorations, saveExplorations]);

  const deleteExploration = useCallback(async (id: string) => {
    const updated = explorations.filter(exp => exp.id !== id);
    await saveExplorations(updated);
  }, [explorations, saveExplorations]);

  const getStreak = useCallback(() => {
    const today = getDayOfYear(new Date());
    let streak = 0;
    const completedDays = new Set(
      explorations.filter(e => e.status === 'completed').map(e => e.dayNumber)
    );
    for (let day = today; day >= 1; day--) {
      if (completedDays.has(day)) {
        streak++;
      } else if (day < today) {
        break;
      }
    }
    return streak;
  }, [explorations]);

  const getByDate = useCallback((date: string) => {
    return explorations.filter(exp => exp.date === date);
  }, [explorations]);

  useEffect(() => {
    loadExplorations();
  }, [loadExplorations]);

  return (
    <ExplorationsContext.Provider value={{
      explorations,
      isLoading,
      syncStatus,
      addExploration,
      updateExploration,
      deleteExploration,
      getStreak,
      getByDate,
      reload: loadExplorations,
    }}>
      {children}
    </ExplorationsContext.Provider>
  );
}

export function useExplorations() {
  const context = useContext(ExplorationsContext);
  if (!context) {
    throw new Error('useExplorations must be used within ExplorationsProvider');
  }
  return context;
}
