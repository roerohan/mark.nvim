// Type definitions for the markdown preview application

import type { Token } from 'marked';
import type { CliRenderer } from '@opentui/core';

/**
 * Application state interface
 */
export interface AppState {
  content: string;
  filePath: string;
}

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
 * Theme color palette
 */
export interface ThemeColors {
  background: string;
  backgroundAlt: string;
  foreground: string;
  border: string;
  accent: string;
  error: string;
  headings: string[];
  codeLabel: string;
  quote: string;
  link: string;
  table: string;
}

/**
 * Parsed markdown structure
 */
export interface ParsedMarkdown {
  tokens: Token[];
}

/**
 * Renderer context passed to element renderers
 */
export interface RenderContext {
  renderer: CliRenderer;
}

/**
 * File watcher configuration
 */
export interface WatcherConfig {
  interval?: number;
  onUpdate?: (content: string) => void;
  onError?: (error: Error) => void;
}
