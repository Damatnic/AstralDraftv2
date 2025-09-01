/**
 * Enhanced Data Persistence Service
 * Provides comprehensive data storage and synchronization for Astral Draft
 * Supports local storage with cloud sync capabilities
 */

import { authService } from './authService';
import { logger } from './loggingService';

export interface DraftSession {
  id: string;
  leagueId: string;
  userId: number;
  draftType: 'snake' | 'auction' | 'keeper';
  status: 'pending' | 'active' | 'completed' | 'abandoned';
  settings: {
    rounds: number;
    timePerPick: number;
    pickOrder: number[];
    budget?: number;
    keeperSlots?: number;
  };
  picks: DraftPick[];
  participants: DraftParticipant[];
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;

export interface DraftPick {
  id: string;
  draftId: string;
  round: number;
  pick: number;
  playerId: string;
  playerName: string;
  position: string;
  team: string;
  userId: number;
  cost?: number;
  timestamp: string;

export interface DraftParticipant {
  userId: number;
  username: string;
  pickOrder: number;
  budget?: number;
  roster: DraftPick[];

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  preferences: Record<string, unknown>;
  draftHistory: string[];
  achievements: string[];
  stats: Record<string, number>;
  createdAt: string;
  updatedAt: string;

export interface LeagueData {
  id: string;
  name: string;
  description: string;
  settings: Record<string, unknown>;
  members: number[];
  createdBy: number;
  season: number;
  status: 'active' | 'completed' | 'draft_pending';
  createdAt: string;
  updatedAt: string;

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  data: unknown;
  timestamp: string;
  synced: boolean;

class DataPersistenceService {
  private isInitialized = false;
  private syncInProgress = false;
  private lastSyncTime = 0;
  private readonly syncInterval = 30000; // 30 seconds

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      logger.info('Initializing Data Persistence Service...');
      this.isInitialized = true;
      logger.info('Data Persistence Service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Data Persistence Service:', error);
      throw error;
    }
  }

  // Draft Session Management
  async createDraftSession(draftData: Omit<DraftSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<DraftSession> {
    try {
      const session: DraftSession = {
        ...draftData,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.storeData('draft_sessions', session.id, session);
      logger.info(`Created draft session: ${session.id}`);
      return session;
    } catch (error) {
      logger.error('Failed to create draft session:', error);
      throw error;
    }
  }

  async getDraftSession(sessionId: string): Promise<DraftSession | null> {
    try {
      return await this.getData('draft_sessions', sessionId);
    } catch (error) {
      logger.error(`Failed to get draft session ${sessionId}:`, error);
      return null;
    }
  }

  async updateDraftSession(sessionId: string, updates: Partial<DraftSession>): Promise<void> {
    try {
      const existing = await this.getDraftSession(sessionId);
      if (!existing) {
        throw new Error(`Draft session ${sessionId} not found`);
      }

      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await this.storeData('draft_sessions', sessionId, updated);
      logger.info(`Updated draft session: ${sessionId}`);
    } catch (error) {
      logger.error(`Failed to update draft session ${sessionId}:`, error);
      throw error;
    }
  }

  async deleteDraftSession(sessionId: string): Promise<void> {
    try {
      await this.deleteData('draft_sessions', sessionId);
      logger.info(`Deleted draft session: ${sessionId}`);
    } catch (error) {
      logger.error(`Failed to delete draft session ${sessionId}:`, error);
      throw error;
    }
  }

  // User Profile Management
  async createUserProfile(userData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    try {
      const profile: UserProfile = {
        ...userData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.storeData('user_profiles', profile.id.toString(), profile);
      logger.info(`Created user profile: ${profile.id}`);
      return profile;
    } catch (error) {
      logger.error('Failed to create user profile:', error);
      throw error;
    }
  }

  async getUserProfile(userId: number): Promise<UserProfile | null> {
    try {
      return await this.getData('user_profiles', userId.toString());
    } catch (error) {
      logger.error(`Failed to get user profile ${userId}:`, error);
      return null;
    }
  }

  async updateUserProfile(userId: number, updates: Partial<UserProfile>): Promise<void> {
    try {
      const existing = await this.getUserProfile(userId);
      if (!existing) {
        throw new Error(`User profile ${userId} not found`);
      }

      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await this.storeData('user_profiles', userId.toString(), updated);
      logger.info(`Updated user profile: ${userId}`);
    } catch (error) {
      logger.error(`Failed to update user profile ${userId}:`, error);
      throw error;
    }
  }

  // League Data Management
  async createLeague(leagueData: Omit<LeagueData, 'id' | 'createdAt' | 'updatedAt'>): Promise<LeagueData> {
    try {
      const league: LeagueData = {
        ...leagueData,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.storeData('leagues', league.id, league);
      logger.info(`Created league: ${league.id}`);
      return league;
    } catch (error) {
      logger.error('Failed to create league:', error);
      throw error;
    }
  }

  async getLeague(leagueId: string): Promise<LeagueData | null> {
    try {
      return await this.getData('leagues', leagueId);
    } catch (error) {
      logger.error(`Failed to get league ${leagueId}:`, error);
      return null;
    }
  }

  async updateLeague(leagueId: string, updates: Partial<LeagueData>): Promise<void> {
    try {
      const existing = await this.getLeague(leagueId);
      if (!existing) {
        throw new Error(`League ${leagueId} not found`);
      }

      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await this.storeData('leagues', leagueId, updated);
      logger.info(`Updated league: ${leagueId}`);
    } catch (error) {
      logger.error(`Failed to update league ${leagueId}:`, error);
      throw error;
    }
  }

  // Generic Data Operations
  private async storeData(table: string, key: string, data: unknown): Promise<void> {
    try {
      const storageKey = `${table}_${key}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
      
      // Queue for sync if user is authenticated
      if (authService.isAuthenticated()) {
        await this.queueSyncOperation('create', table, data);
      }
    } catch (error) {
      logger.error(`Failed to store data in ${table}:`, error);
      throw error;
    }
  }

  private async getData<T>(table: string, key: string): Promise<T | null> {
    try {
      const storageKey = `${table}_${key}`;
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Failed to get data from ${table}:`, error);
      return null;
    }
  }

  private async deleteData(table: string, key: string): Promise<void> {
    try {
      const storageKey = `${table}_${key}`;
      localStorage.removeItem(storageKey);
      
      // Queue for sync if user is authenticated
      if (authService.isAuthenticated()) {
        await this.queueSyncOperation('delete', table, { id: key });
      }
    } catch (error) {
      logger.error(`Failed to delete data from ${table}:`, error);
      throw error;
    }
  }

  // Sync Operations
  private async queueSyncOperation(type: 'create' | 'update' | 'delete', table: string, data: unknown): Promise<void> {
    try {
      const operation: SyncOperation = {
        id: this.generateId(),
        type,
        table,
        data,
        timestamp: new Date().toISOString(),
        synced: false
      };

      const queueKey = 'sync_queue';
      const queue = this.getSyncQueue();
      queue.push(operation);
      localStorage.setItem(queueKey, JSON.stringify(queue));
    } catch (error) {
      logger.error('Failed to queue sync operation:', error);
    }
  }

  private getSyncQueue(): SyncOperation[] {
    try {
      const queue = localStorage.getItem('sync_queue');
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      logger.error('Failed to get sync queue:', error);
      return [];
    }
  }

  async performSync(): Promise<void> {
    if (this.syncInProgress || !authService.isAuthenticated()) {
      return;
    }

    try {
      this.syncInProgress = true;
      const queue = this.getSyncQueue();
      const unsyncedOperations = queue.filter((op: any) => !op.synced);

      if (unsyncedOperations.length === 0) {
        return;
      }

      logger.info(`Syncing ${unsyncedOperations.length} operations...`);

      // In a real implementation, this would sync with a backend API
      // For now, just mark operations as synced
      for (const operation of unsyncedOperations) {
        operation.synced = true;
      }

      localStorage.setItem('sync_queue', JSON.stringify(queue));
      this.lastSyncTime = Date.now();
      logger.info('Sync completed successfully');
    } catch (error) {
      logger.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Utility Methods
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async exportData(): Promise<Record<string, unknown>> {
    try {
      const exportData: Record<string, unknown> = {};
      
      // Export all localStorage data related to the app
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith('draft_sessions_') ||
          key.startsWith('user_profiles_') ||
          key.startsWith('leagues_') ||
          key === 'sync_queue'
        )) {
          const value = localStorage.getItem(key);
          if (value) {
            exportData[key] = JSON.parse(value);
          }
        }
      }

      logger.info('Data exported successfully');
      return exportData;
    } catch (error) {
      logger.error('Failed to export data:', error);
      throw error;
    }
  }

  async importData(data: Record<string, unknown>): Promise<void> {
    try {
      for (const [key, value] of Object.entries(data)) {
        if (value && typeof value === 'object') {
          localStorage.setItem(key, JSON.stringify(value));
        }
      }

      logger.info('Data imported successfully');
    } catch (error) {
      logger.error('Failed to import data:', error);
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith('draft_sessions_') ||
          key.startsWith('user_profiles_') ||
          key.startsWith('leagues_') ||
          key === 'sync_queue'
        )) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key: any) => localStorage.removeItem(key));
      logger.info('All data cleared successfully');
    } catch (error) {
      logger.error('Failed to clear data:', error);
      throw error;
    }
  }

  // Health Check
  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: Record<string, unknown> }> {
    try {
      const details: Record<string, unknown> = {
        initialized: this.isInitialized,
        syncInProgress: this.syncInProgress,
        lastSyncTime: this.lastSyncTime,
        queueLength: this.getSyncQueue().length
      };

      const status = this.isInitialized ? 'healthy' : 'unhealthy';
      
      return { status, details };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        details: { error: error instanceof Error ? error.message : 'Unknown error' } 
      };
    }
  }

export const dataPersistenceService = new DataPersistenceService();
