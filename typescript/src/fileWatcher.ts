// File system watcher for markdown files

import * as fs from 'fs';
import type { WatcherConfig } from './types.js';

/**
 * File watcher that monitors changes to a markdown file
 */
export class FileWatcher {
  private filePath: string;
  private interval: NodeJS.Timeout | null = null;
  private lastModified: number = 0;
  private config: WatcherConfig;

  constructor(filePath: string, config: WatcherConfig = {}) {
    this.filePath = filePath;
    this.config = {
      interval: config.interval || 500,
      onUpdate: config.onUpdate,
      onError: config.onError,
    };
  }

  /**
   * Start watching the file for changes
   */
  start(): void {
    // Get initial modification time
    try {
      const stats = fs.statSync(this.filePath);
      this.lastModified = stats.mtimeMs;
    } catch (error) {
      if (this.config.onError) {
        this.config.onError(error as Error);
      }
    }

    // Start polling for changes
    this.interval = setInterval(() => {
      this.checkForChanges();
    }, this.config.interval);
  }

  /**
   * Stop watching the file
   */
  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Check if the file has been modified
   */
  private checkForChanges(): void {
    try {
      const stats = fs.statSync(this.filePath);
      
      if (stats.mtimeMs > this.lastModified) {
        this.lastModified = stats.mtimeMs;
        const content = fs.readFileSync(this.filePath, 'utf-8');
        
        if (this.config.onUpdate) {
          this.config.onUpdate(content);
        }
      }
    } catch (error) {
      // File temporarily unavailable - ignore
      // Only report errors if callback is provided
      if (this.config.onError && error instanceof Error) {
        this.config.onError(error);
      }
    }
  }

  /**
   * Get the current file path
   */
  getFilePath(): string {
    return this.filePath;
  }

  /**
   * Update the file path being watched
   */
  setFilePath(filePath: string): void {
    this.filePath = filePath;
    this.lastModified = 0;
  }
}
