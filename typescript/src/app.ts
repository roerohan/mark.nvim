// Main application class for markdown preview using MarkdownRenderable

import {
  createCliRenderer,
  BoxRenderable,
  TextRenderable,
  ScrollBoxRenderable,
  MarkdownRenderable,
  SyntaxStyle,
  type CliRenderer,
  type ParsedKey,
} from '@opentui/core';
import * as fs from 'fs';
import * as path from 'path';
import { THEMES, getTheme, createSyntaxStyle, type Theme } from './theme.js';
import { FileWatcher } from './fileWatcher.js';
import { StreamingManager } from './streaming.js';
import type { RendererConfig } from './types.js';

/**
 * Main markdown preview application using MarkdownRenderable
 */
export class MarkdownPreviewApp {
  private renderer: CliRenderer | null = null;
  private filePath: string;
  private content: string = '';
  private config: RendererConfig;
  
  // UI Components
  private parentContainer: BoxRenderable | null = null;
  private scrollBox: ScrollBoxRenderable | null = null;
  private markdownDisplay: MarkdownRenderable | null = null;
  private statusText: TextRenderable | null = null;
  private helpModal: BoxRenderable | null = null;
  
  // State
  private currentTheme: Theme;
  private currentThemeIndex: number = 0;
  private syntaxStyle: SyntaxStyle;
  private concealEnabled: boolean = true;
  private showingHelp: boolean = false;
  
  // Features
  private fileWatcher: FileWatcher | null = null;
  private streamingManager: StreamingManager | null = null;
  private keyboardHandler: ((key: ParsedKey) => void) | null = null;

  constructor(filePath: string, config: RendererConfig = {}) {
    this.filePath = filePath;
    
    // Set initial theme from config or default to first theme
    if (config.initialTheme) {
      const themeIndex = THEMES.findIndex(t => t.name.toLowerCase() === config.initialTheme?.toLowerCase());
      if (themeIndex !== -1) {
        this.currentThemeIndex = themeIndex;
        this.currentTheme = THEMES[themeIndex];
      } else {
        console.error(`[mark.nvim] Theme "${config.initialTheme}" not found, using default`);
        this.currentTheme = THEMES[0];
      }
    } else {
      this.currentTheme = THEMES[0];
    }
    
    this.config = {
      targetFps: config.targetFps || 60,
      backgroundColor: config.backgroundColor || this.currentTheme.bg,
      exitOnCtrlC: config.exitOnCtrlC ?? true,
      useAlternateScreen: config.useAlternateScreen ?? true,
    };
    this.syntaxStyle = createSyntaxStyle(this.currentTheme);
  }

  /**
   * Initialize and start the application
   */
  async start(): Promise<void> {
    console.error('[mark.nvim] Starting OpenTUI Markdown Preview');

    this.renderer = await createCliRenderer({
      exitOnCtrlC: this.config.exitOnCtrlC,
      targetFps: this.config.targetFps,
      useAlternateScreen: this.config.useAlternateScreen,
      backgroundColor: this.config.backgroundColor,
    });

    this.renderer.start();

    await this.loadContent();
    this.createUI();
    this.setupKeyboard();
    this.startWatching();
  }

  /**
   * Load markdown content from file
   */
  private async loadContent(): Promise<void> {
    try {
      if (!fs.existsSync(this.filePath)) {
        this.content = `# File Not Found\n\nThe file \`${this.filePath}\` does not exist.`;
        return;
      }

      this.content = fs.readFileSync(this.filePath, 'utf-8');
    } catch (error) {
      this.content = `# Error\n\nFailed to read file: ${error}`;
    }
  }

  /**
   * Create the UI components
   */
  private createUI(): void {
    if (!this.renderer) return;

    // Main container
    this.parentContainer = new BoxRenderable(this.renderer, {
      id: 'parent-container',
      zIndex: 10,
      padding: 1,
    });
    this.renderer.root.add(this.parentContainer);

    // Title box
    const fileName = path.basename(this.filePath);
    const titleBox = new BoxRenderable(this.renderer, {
      id: 'title-box',
      height: 3,
      borderStyle: 'double',
      borderColor: '#4ECDC4',
      backgroundColor: this.currentTheme.bg,
      title: `Markdown Preview - ${fileName}`,
      titleAlignment: 'center',
      border: true,
    });
    this.parentContainer.add(titleBox);

    const instructionsText = new TextRenderable(this.renderer, {
      id: 'instructions',
      content: 'ESC: Exit | ?: Help',
      fg: '#888888',
    });
    titleBox.add(instructionsText);

    // Create help modal (hidden by default)
    this.createHelpModal();

    // Scrollable markdown container
    this.scrollBox = new ScrollBoxRenderable(this.renderer, {
      id: 'markdown-scroll-box',
      borderStyle: 'single',
      borderColor: '#6BCF7F',
      backgroundColor: this.currentTheme.bg,
      title: `${this.currentTheme.name}`,
      titleAlignment: 'left',
      border: true,
      scrollY: true,
      scrollX: false,
      flexGrow: 1,
      flexShrink: 1,
      padding: 2,
    });
    this.scrollBox.focus();
    this.parentContainer.add(this.scrollBox);

    // Create markdown display using MarkdownRenderable
    this.markdownDisplay = new MarkdownRenderable(this.renderer, {
      id: 'markdown-display',
      content: this.content,
      syntaxStyle: this.syntaxStyle,
      conceal: this.concealEnabled,
      width: '100%',
    });

    this.scrollBox.add(this.markdownDisplay);

    // Status bar
    this.statusText = new TextRenderable(this.renderer, {
      id: 'status-display',
      content: '',
      fg: '#A5D6FF',
      wrapMode: 'word',
      flexShrink: 0,
    });
    this.parentContainer.add(this.statusText);

    // Initialize streaming manager
    this.streamingManager = new StreamingManager(
      this.markdownDisplay,
      this.scrollBox,
      this.content,
      (status) => this.updateStreamingStatus(status)
    );

    this.updateStatus();
  }

  /**
   * Create help modal
   */
  private createHelpModal(): void {
    if (!this.renderer) return;

    this.helpModal = new BoxRenderable(this.renderer, {
      id: 'help-modal',
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: 60,
      height: 22,
      marginLeft: -30,
      marginTop: -11,
      border: true,
      borderStyle: 'double',
      borderColor: '#4ECDC4',
      backgroundColor: this.currentTheme.bg,
      title: 'Keybindings',
      titleAlignment: 'center',
      padding: 2,
      zIndex: 100,
      visible: false,
    });

    const helpContent = new TextRenderable(this.renderer, {
      id: 'help-content',
      content: `Theme:
  T : Cycle through themes (GitHub/Monokai/Nord/Orng)

View Controls:
  C : Toggle concealment (hide **, \`, etc.)
  R : Reload file from disk

Streaming:
  S : Start/restart streaming simulation
  E : Toggle endless mode (repeats content forever)
  X : Stop streaming
  [ : Decrease speed (slower)
  ] : Increase speed (faster)

Other:
  ? : Toggle this help screen
  ESC : Exit application`,
      fg: '#E6EDF3',
    });

    this.helpModal.add(helpContent);
    this.renderer.root.add(this.helpModal);
  }

  /**
   * Update the status bar text
   */
  private updateStatus(): void {
    if (!this.statusText) return;

    const lines = this.content.split('\n').length;
    const concealStatus = this.concealEnabled ? 'ON' : 'OFF';
    const theme = this.currentTheme.name;
    
    this.statusText.content = `${theme} | Conceal: ${concealStatus} | Lines: ${lines} | Press ? for help`;
  }

  /**
   * Update status with streaming info
   */
  private updateStreamingStatus(status: string): void {
    if (!this.statusText) return;

    const concealStatus = this.concealEnabled ? 'ON' : 'OFF';
    const theme = this.currentTheme.name;
    
    this.statusText.content = `${theme} | Conceal: ${concealStatus} | ${status} | Press X to stop`;
  }

  /**
   * Setup keyboard event handlers
   */
  private setupKeyboard(): void {
    if (!this.renderer) return;

    this.keyboardHandler = (key: ParsedKey) => {
      // Toggle help modal
      if (key.raw === '?' && !key.ctrl && !key.meta) {
        this.toggleHelp();
        return;
      }

      // Don't process other keys when help is showing
      if (this.showingHelp) return;

      // Exit on ESC
      if (key.name === 'escape') {
        this.destroy();
        process.exit(0);
      }
      
      // Theme cycling with T
      else if (key.name === 't' && !key.ctrl && !key.meta) {
        this.cycleTheme();
      }
      
      // Toggle conceal mode with C
      else if (key.name === 'c' && !key.ctrl && !key.meta) {
        this.toggleConceal();
      }
      
      // Reload file with R
      else if (key.name === 'r' && !key.ctrl && !key.meta) {
        this.reloadContent();
      }
      
      // Streaming controls
      else if (key.name === 's' && !key.ctrl && !key.meta) {
        this.startStreaming();
      }
      else if (key.name === 'e' && !key.ctrl && !key.meta) {
        this.toggleEndless();
      }
      else if (key.name === 'x' && !key.ctrl && !key.meta) {
        this.stopStreaming();
      }
      else if (key.raw === '[' && !key.ctrl && !key.meta) {
        this.decreaseStreamSpeed();
      }
      else if (key.raw === ']' && !key.ctrl && !key.meta) {
        this.increaseStreamSpeed();
      }
    };

    this.renderer.keyInput.on('keypress', this.keyboardHandler);
  }

  /**
   * Toggle help modal
   */
  private toggleHelp(): void {
    this.showingHelp = !this.showingHelp;
    if (this.helpModal) {
      this.helpModal.visible = this.showingHelp;
    }
  }

  /**
   * Cycle through themes
   */
  private cycleTheme(): void {
    this.currentThemeIndex = (this.currentThemeIndex + 1) % THEMES.length;
    this.currentTheme = getTheme(this.currentThemeIndex);
    
    // Update renderer background
    if (this.renderer) {
      this.renderer.setBackgroundColor(this.currentTheme.bg);
    }
    
    // Update syntax style
    this.syntaxStyle = createSyntaxStyle(this.currentTheme);
    
    if (this.markdownDisplay) {
      this.markdownDisplay.syntaxStyle = this.syntaxStyle;
    }
    
    if (this.scrollBox) {
      this.scrollBox.title = this.currentTheme.name;
      this.scrollBox.backgroundColor = this.currentTheme.bg;
    }
    
    if (this.helpModal) {
      this.helpModal.backgroundColor = this.currentTheme.bg;
    }
    
    this.updateStatus();
  }

  /**
   * Toggle conceal mode
   */
  private toggleConceal(): void {
    // Stop streaming when toggling conceal
    this.stopStreaming();
    
    this.concealEnabled = !this.concealEnabled;
    
    if (this.markdownDisplay) {
      this.markdownDisplay.conceal = this.concealEnabled;
    }
    
    this.updateStatus();
  }

  /**
   * Reload content from file
   */
  private async reloadContent(): Promise<void> {
    await this.loadContent();
    
    if (this.markdownDisplay) {
      this.markdownDisplay.content = this.content;
    }
    
    if (this.streamingManager) {
      this.streamingManager.setContent(this.content);
    }
    
    this.updateStatus();
  }

  /**
   * Start streaming mode
   */
  private startStreaming(): void {
    if (this.streamingManager) {
      this.streamingManager.start();
    }
  }

  /**
   * Stop streaming mode
   */
  private stopStreaming(): void {
    if (this.streamingManager) {
      this.streamingManager.stop();
    }
    this.updateStatus();
  }

  /**
   * Toggle endless streaming mode
   */
  private toggleEndless(): void {
    if (this.streamingManager) {
      this.streamingManager.toggleEndless();
    }
    this.updateStatus();
  }

  /**
   * Decrease streaming speed
   */
  private decreaseStreamSpeed(): void {
    if (this.streamingManager) {
      this.streamingManager.decreaseSpeed();
    }
    this.updateStatus();
  }

  /**
   * Increase streaming speed
   */
  private increaseStreamSpeed(): void {
    if (this.streamingManager) {
      this.streamingManager.increaseSpeed();
    }
    this.updateStatus();
  }

  /**
   * Start watching the file for changes
   */
  private startWatching(): void {
    this.fileWatcher = new FileWatcher(this.filePath, {
      interval: 500,
      onUpdate: async (content: string) => {
        this.content = content;
        
        if (this.markdownDisplay && !this.streamingManager?.isActive()) {
          this.markdownDisplay.content = content;
        }
        
        if (this.streamingManager) {
          this.streamingManager.setContent(content);
        }
        
        this.updateStatus();
      },
    });

    this.fileWatcher.start();
  }

  /**
   * Clean up resources and destroy the application
   */
  destroy(): void {
    // Stop streaming
    if (this.streamingManager) {
      this.streamingManager.destroy();
      this.streamingManager = null;
    }

    // Stop file watcher
    if (this.fileWatcher) {
      this.fileWatcher.stop();
      this.fileWatcher = null;
    }

    // Remove keyboard handler
    if (this.keyboardHandler && this.renderer) {
      this.renderer.keyInput.off('keypress', this.keyboardHandler);
      this.keyboardHandler = null;
    }

    // Destroy UI components
    if (this.helpModal) {
      this.helpModal.destroy();
      this.helpModal = null;
    }

    if (this.parentContainer) {
      this.parentContainer.destroy();
      this.parentContainer = null;
    }

    this.scrollBox = null;
    this.markdownDisplay = null;
    this.statusText = null;

    // Destroy renderer
    if (this.renderer) {
      this.renderer.destroy();
      this.renderer = null;
    }
  }
}
