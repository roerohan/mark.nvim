// Type definitions for the markdown preview application

/**
 * Configuration options for the renderer
 */
export interface RendererConfig {
  targetFps?: number;
  backgroundColor?: string;
  exitOnCtrlC?: boolean;
  useAlternateScreen?: boolean;
}

/**
 * File watcher configuration
 */
export interface WatcherConfig {
  interval?: number;
  onUpdate?: (content: string) => void;
  onError?: (error: Error) => void;
}
