// Main application class for markdown preview

import {
  createCliRenderer,
  BoxRenderable,
  SyntaxStyle,
  type CliRenderer
} from '@opentui/core';
import * as fs from 'fs';
import * as path from 'path';
import type { Token } from 'marked';
import { parseMarkdown } from './parser.js';
import { FileWatcher } from './fileWatcher.js';
import { GITHUB_DARK_THEME, createSyntaxStyle } from './theme.js';
import {
  renderHeading,
  renderParagraph,
  renderCode,
  renderList,
  renderBlockquote,
  renderHr,
  renderTable,
  renderHeader,
  renderError,
} from './renderers/index.js';
import type {
  AppState,
  RendererConfig,
  RenderContext,
  ThemeColors,
} from './types.js';

/**
 * Main markdown preview application
 */
export class MarkdownPreviewApp {
  private renderer: CliRenderer | null = null;
  private state: AppState;
  private syntaxStyle: SyntaxStyle;
  private theme: ThemeColors;
  private fileWatcher: FileWatcher | null = null;
  private currentContainer: BoxRenderable | null = null;
  private config: RendererConfig;

  constructor(filePath: string, config: RendererConfig = {}) {
    this.state = {
      content: '',
      filePath: filePath,
    };
    this.config = {
      targetFps: config.targetFps || 30,
      backgroundColor: config.backgroundColor || GITHUB_DARK_THEME.background,
      exitOnCtrlC: config.exitOnCtrlC ?? true,
      useAlternateScreen: config.useAlternateScreen ?? true,
    };
    this.syntaxStyle = createSyntaxStyle();
    this.theme = GITHUB_DARK_THEME;
  }

  /**
   * Initialize and start the application
   */
  async start(): Promise<void> {
    console.error('[mark.nvim] Starting OpenTUI app v3.0 - REFACTORED VERSION');

    this.renderer = await createCliRenderer({
      exitOnCtrlC: this.config.exitOnCtrlC,
      targetFps: this.config.targetFps,
      useAlternateScreen: this.config.useAlternateScreen,
      backgroundColor: this.config.backgroundColor,
    });

    await this.loadContent();
    this.startWatching();

    this.renderer.on('resize', () => {
      this.refreshContent();
    });
  }

  /**
   * Load content from the markdown file
   */
  private async loadContent(): Promise<void> {
    try {
      if (!fs.existsSync(this.state.filePath)) {
        this.showError(`File not found: ${this.state.filePath}`);
        return;
      }

      const content = fs.readFileSync(this.state.filePath, 'utf-8');
      this.state.content = content;

      this.refreshContent();
    } catch (error) {
      this.showError(`Error: ${error}`);
    }
  }

  /**
   * Refresh the rendered content
   */
  private refreshContent(): void {
    if (!this.renderer) return;

    this.clearScreen();

    const parsed = parseMarkdown(this.state.content);

    // Create main container
    this.currentContainer = new BoxRenderable(this.renderer, {
      id: 'main-container',
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      padding: 2,
      backgroundColor: this.theme.background,
      shouldFill: true,
    });

    const context: RenderContext = {
      renderer: this.renderer,
    };

    // Render header
    const fileName = path.basename(this.state.filePath);
    renderHeader(fileName, this.currentContainer, this.theme);

    // Render markdown tokens
    for (const token of parsed.tokens) {
      this.renderToken(token, this.currentContainer, context);
    }

    // Add to root and render
    this.renderer.root.add(this.currentContainer);
    this.renderer.requestRender();
  }

  /**
   * Clear the screen by removing all existing content
   */
  private clearScreen(): void {
    if (!this.renderer) return;

    // Remove current container
    if (this.currentContainer) {
      try {
        this.renderer.root.remove('main-container');
        (this.currentContainer as any).destroy?.();
      } catch (e) {
        // Ignore cleanup errors
      }
      this.currentContainer = null;
    }

    // Clear orphaned children
    const existingChildren = this.renderer.root.getChildren();
    for (const child of existingChildren) {
      try {
        if ((child as any).id) {
          this.renderer.root.remove((child as any).id);
        }
        (child as any).destroy?.();
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }

  /**
   * Render a single markdown token
   */
  private renderToken(token: Token, parent: BoxRenderable, context: RenderContext): void {
    if (!this.renderer) return;

    switch (token.type) {
      case 'heading':
        renderHeading(token as any, parent, this.theme);
        break;
      case 'paragraph':
        renderParagraph(token as any, parent, this.theme);
        break;
      case 'code':
        renderCode(token as any, parent, this.theme, this.syntaxStyle, context);
        break;
      case 'list':
        renderList(token as any, parent, this.theme);
        break;
      case 'blockquote':
        renderBlockquote(token as any, parent, this.theme);
        break;
      case 'hr':
        renderHr(parent, this.theme);
        break;
      case 'table':
        renderTable(token as any, parent, this.theme);
        break;
      // Add more token types as needed
    }
  }

  /**
   * Start watching the file for changes
   */
  private startWatching(): void {
    this.fileWatcher = new FileWatcher(this.state.filePath, {
      interval: 500,
      onUpdate: (content: string) => {
        this.state.content = content;
        this.refreshContent();
      },
    });

    this.fileWatcher.start();
  }

  /**
   * Display an error message
   */
  private showError(message: string): void {
    if (!this.renderer) return;

    this.clearScreen();

    const errorBox = renderError(message, this.theme);
    this.renderer.root.add(errorBox);
    this.renderer.requestRender();
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.fileWatcher) {
      this.fileWatcher.stop();
    }
    if (this.renderer) {
      this.renderer.destroy();
    }
  }
}
