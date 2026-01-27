// OpenTUI application for markdown preview - using Renderables directly
import { 
  createCliRenderer,
  BoxRenderable,
  TextRenderable,
  CodeRenderable,
  SyntaxStyle, 
  RGBA,
  TextAttributes,
  type CliRenderer
} from '@opentui/core';
import { parseMarkdown } from './parser.js';
import type { Token, Tokens } from 'marked';
import * as fs from 'fs';
import * as path from 'path';

interface AppState {
  content: string;
  filePath: string;
}

export class MarkdownPreviewApp {
  private renderer: CliRenderer | null = null;
  private state: AppState;
  private syntaxStyle: SyntaxStyle;
  private watchInterval: NodeJS.Timeout | null = null;
  private lastModified: number = 0;
  private currentContainer: BoxRenderable | null = null;

  constructor(filePath: string) {
    this.state = {
      content: '',
      filePath: filePath,
    };
    this.syntaxStyle = this.createSyntaxStyle();
  }

  async start(): Promise<void> {
    // Version marker to verify code is loaded
    console.error('[mark.nvim] Starting OpenTUI app v2.0 - FIXED VERSION');
    
    this.renderer = await createCliRenderer({
      exitOnCtrlC: true,
      targetFps: 30,
      useAlternateScreen: true,
      backgroundColor: '#0d1117',
    });

    await this.loadContent();
    this.startWatching();

    this.renderer.on('resize', () => {
      this.refreshContent();
    });
  }

  private async loadContent(): Promise<void> {
    try {
      if (!fs.existsSync(this.state.filePath)) {
        this.showError(`File not found: ${this.state.filePath}`);
        return;
      }

      const content = fs.readFileSync(this.state.filePath, 'utf-8');
      this.state.content = content;
      this.lastModified = fs.statSync(this.state.filePath).mtimeMs;

      this.refreshContent();
    } catch (error) {
      this.showError(`Error: ${error}`);
    }
  }

  private refreshContent(): void {
    if (!this.renderer) return;
    
    // Remove old container completely
    if (this.currentContainer) {
      try {
        this.renderer.root.remove('main-container');
      } catch (e) {
        // Already removed
      }
      try {
        this.currentContainer.destroy();
      } catch (e) {
        // Already destroyed
      }
      this.currentContainer = null;
    }

    const parsed = parseMarkdown(this.state.content);

    // Create main container with background to clear old content
    this.currentContainer = new BoxRenderable(this.renderer, {
      id: 'main-container',
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      padding: 2,
      backgroundColor: '#0d1117',
      shouldFill: true,
    });

    // Header
    const headerBox = new BoxRenderable(this.renderer, {
      width: '100%',
      borderStyle: 'rounded',
      padding: 1,
      marginBottom: 1,
      backgroundColor: '#1a1a1a',
    });
    
    const headerText = new TextRenderable(this.renderer, {
      content: `${path.basename(this.state.filePath)} — Markdown Preview`,
      fg: '#58A6FF',
      attributes: TextAttributes.BOLD,
    });
    
    headerBox.add(headerText);
    this.currentContainer.add(headerBox);

    // Render markdown tokens
    for (const token of parsed.tokens) {
      this.renderToken(token, this.currentContainer);
    }

    this.renderer.root.add(this.currentContainer);
    this.renderer.requestRender();
  }

  private renderToken(token: Token, parent: BoxRenderable): void {
    if (!this.renderer) return;
    
    if (this.isHeading(token)) {
      this.renderHeading(token, parent);
    } else if (this.isParagraph(token)) {
      this.renderParagraph(token, parent);
    } else if (this.isCode(token)) {
      this.renderCode(token, parent);
    } else if (this.isList(token)) {
      this.renderList(token, parent);
    } else if (this.isBlockquote(token)) {
      this.renderBlockquote(token, parent);
    } else if (this.isHr(token)) {
      this.renderHr(parent);
    } else if (this.isTable(token)) {
      this.renderTable(token, parent);
    }
  }

  private renderHeading(token: Tokens.Heading, parent: BoxRenderable): void {
    if (!this.renderer) return;
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#d2a8ff', '#f3a683', '#a8dadc'];
    const color = colors[token.depth - 1] || '#ffffff';
    const prefix = '#'.repeat(token.depth);
    
    // H1 and H2 get underlines
    if (token.depth === 1 || token.depth === 2) {
      const container = new BoxRenderable(this.renderer, {
        width: '100%',
        flexDirection: 'column',
        marginTop: 1,
        marginBottom: 1,
      });
      
      const heading = new TextRenderable(this.renderer, {
        content: `${prefix} ${token.text}`,
        fg: color,
        attributes: TextAttributes.BOLD,
      });
      
      const underlineChar = token.depth === 1 ? '━' : '─';
      const underline = new TextRenderable(this.renderer, {
        content: underlineChar.repeat(Math.min(token.text.length + prefix.length + 1, 80)),
        fg: color,
      });
      
      container.add(heading);
      container.add(underline);
      parent.add(container);
    } else {
      const heading = new TextRenderable(this.renderer, {
        content: `${prefix} ${token.text}`,
        fg: color,
        attributes: TextAttributes.BOLD,
        marginTop: 1,
        marginBottom: 1,
      });
      parent.add(heading);
    }
  }

  private renderParagraph(token: Tokens.Paragraph, parent: BoxRenderable): void {
    if (!this.renderer) return;
    
    // Strip markdown formatting for now
    let text = token.text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1');
    
    const para = new TextRenderable(this.renderer, {
      content: text,
      fg: '#e6edf3',
      marginBottom: 1,
      width: '100%',
    });
    
    parent.add(para);
  }

  private renderCode(token: Tokens.Code, parent: BoxRenderable): void {
    if (!this.renderer) return;
    
    const lang = this.mapLanguage(token.lang || 'text');
    
    const codeBox = new BoxRenderable(this.renderer, {
      width: '100%',
      borderStyle: 'rounded',
      marginBottom: 1,
      marginTop: 1,
      flexDirection: 'column',
      borderColor: '#30363d',
    });
    
    // Language label if specified
    if (token.lang) {
      const labelBox = new BoxRenderable(this.renderer, {
        width: '100%',
        paddingLeft: 1,
        backgroundColor: '#161b22',
      });
      
      const label = new TextRenderable(this.renderer, {
        content: token.lang.toUpperCase(),
        fg: '#ffa657',
        attributes: TextAttributes.BOLD,
      });
      
      labelBox.add(label);
      codeBox.add(labelBox);
    }
    
    // Code block with syntax highlighting
    const code = new CodeRenderable(this.renderer, {
      content: token.text,
      filetype: lang,
      syntaxStyle: this.syntaxStyle,
      padding: 1,
    });
    
    codeBox.add(code);
    parent.add(codeBox);
  }

  private renderList(token: Tokens.List, parent: BoxRenderable): void {
    if (!this.renderer) return;
    
    const listBox = new BoxRenderable(this.renderer, {
      width: '100%',
      flexDirection: 'column',
      marginBottom: 1,
    });
    
    token.items.forEach((item, i) => {
      const bullet = token.ordered ? `${i + 1}. ` : '• ';
      
      // Extract raw text from list item, handling nested tokens
      let text = '';
      if (item.tokens && item.tokens.length > 0) {
        // Process nested tokens to get plain text
        for (const subToken of item.tokens) {
          if (this.isParagraph(subToken)) {
            text += subToken.text;
          } else if (this.isHeading(subToken)) {
            text += subToken.text;
          } else if ((subToken as any).text) {
            text += (subToken as any).text;
          }
        }
      } else {
        text = item.text;
      }
      
      // Strip markdown formatting
      text = text
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/__(.+?)__/g, '$1')
        .replace(/_(.+?)_/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .trim();
      
      const listItem = new TextRenderable(this.renderer!, {
        content: `  ${bullet}${text}`,
        fg: '#e6edf3',
      });
      
      listBox.add(listItem);
    });
    
    parent.add(listBox);
  }

  private renderBlockquote(token: Tokens.Blockquote, parent: BoxRenderable): void {
    if (!this.renderer) return;
    
    let text = '';
    for (const subToken of token.tokens) {
      if (this.isParagraph(subToken)) {
        text += subToken.text + ' ';
      }
    }

    const stripped = text.trim()
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1');
    
    const quoteBox = new BoxRenderable(this.renderer, {
      width: '100%',
      borderStyle: 'single',
      borderColor: '#30363d',
      padding: 1,
      marginBottom: 1,
      backgroundColor: '#161b22',
      flexDirection: 'column',
    });
    
    const lines = stripped.split('\n');
    lines.forEach((line: string) => {
      const quoteLine = new TextRenderable(this.renderer!, {
        content: `│ ${line}`,
        fg: '#8b949e',
        attributes: TextAttributes.ITALIC,
      });
      quoteBox.add(quoteLine);
    });
    
    parent.add(quoteBox);
  }

  private renderHr(parent: BoxRenderable): void {
    if (!this.renderer) return;
    
    const hr = new TextRenderable(this.renderer, {
      content: '─'.repeat(80),
      fg: '#30363d',
      marginTop: 1,
      marginBottom: 1,
      width: '100%',
    });
    
    parent.add(hr);
  }

  private renderTable(token: Tokens.Table, parent: BoxRenderable): void {
    if (!this.renderer) return;
    
    const tableBox = new BoxRenderable(this.renderer, {
      width: '100%',
      borderStyle: 'rounded',
      padding: 1,
      marginBottom: 1,
      backgroundColor: '#161b22',
      borderColor: '#30363d',
    });
    
    const tableText = new TextRenderable(this.renderer, {
      content: `TABLE: ${token.header.length} columns × ${token.rows.length} rows`,
      fg: '#79c0ff',
      attributes: TextAttributes.BOLD,
    });
    
    tableBox.add(tableText);
    parent.add(tableBox);
  }



  private startWatching(): void {
    this.watchInterval = setInterval(() => {
      try {
        const stats = fs.statSync(this.state.filePath);
        if (stats.mtimeMs > this.lastModified) {
          this.loadContent();
        }
      } catch (error) {
        // File temporarily unavailable
      }
    }, 500);
  }

  private showError(message: string): void {
    if (!this.renderer) return;
    
    if (this.currentContainer) {
      this.renderer.root.remove('main-container');
      this.currentContainer.destroy();
      this.currentContainer = null;
    }

    this.currentContainer = new BoxRenderable(this.renderer, {
      id: 'main-container',
      width: '100%',
      height: '100%',
      padding: 2,
      borderStyle: 'rounded',
      borderColor: '#f85149',
      backgroundColor: '#1a1a1a',
      flexDirection: 'column',
    });
    
    const errorTitle = new TextRenderable(this.renderer, {
      content: 'ERROR',
      fg: '#f85149',
      attributes: TextAttributes.BOLD,
      marginBottom: 1,
    });
    
    const errorMessage = new TextRenderable(this.renderer, {
      content: message,
      fg: '#f85149',
    });
    
    this.currentContainer.add(errorTitle);
    this.currentContainer.add(errorMessage);
    this.renderer.root.add(this.currentContainer);
  }

  private mapLanguage(lang: string): string {
    const langMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'py': 'python',
      'rb': 'ruby',
      'sh': 'bash',
      'shell': 'bash',
      'yml': 'yaml',
      'md': 'markdown',
    };
    return langMap[lang.toLowerCase()] || lang.toLowerCase();
  }

  private createSyntaxStyle(): SyntaxStyle {
    return SyntaxStyle.fromStyles({
      keyword: { fg: RGBA.fromHex('#ff7b72') },
      'keyword.import': { fg: RGBA.fromHex('#ff7b72') },
      'keyword.function': { fg: RGBA.fromHex('#ff7b72') },
      string: { fg: RGBA.fromHex('#a5d6ff') },
      'string.special': { fg: RGBA.fromHex('#a5d6ff') },
      comment: { fg: RGBA.fromHex('#8b949e') },
      number: { fg: RGBA.fromHex('#79c0ff') },
      boolean: { fg: RGBA.fromHex('#79c0ff') },
      constant: { fg: RGBA.fromHex('#79c0ff') },
      function: { fg: RGBA.fromHex('#d2a8ff') },
      'function.call': { fg: RGBA.fromHex('#d2a8ff') },
      'function.method': { fg: RGBA.fromHex('#d2a8ff') },
      type: { fg: RGBA.fromHex('#ffa657') },
      variable: { fg: RGBA.fromHex('#e6edf3') },
      'variable.parameter': { fg: RGBA.fromHex('#ffa657') },
      operator: { fg: RGBA.fromHex('#ff7b72') },
      punctuation: { fg: RGBA.fromHex('#c9d1d9') },
      default: { fg: RGBA.fromHex('#e6edf3') },
    });
  }

  // Type guards
  private isHeading(token: Token): token is Tokens.Heading {
    return token.type === 'heading';
  }

  private isParagraph(token: Token): token is Tokens.Paragraph {
    return token.type === 'paragraph';
  }

  private isCode(token: Token): token is Tokens.Code {
    return token.type === 'code';
  }

  private isList(token: Token): token is Tokens.List {
    return token.type === 'list';
  }

  private isBlockquote(token: Token): token is Tokens.Blockquote {
    return token.type === 'blockquote';
  }

  private isHr(token: Token): token is Tokens.Hr {
    return token.type === 'hr';
  }

  private isTable(token: Token): token is Tokens.Table {
    return token.type === 'table';
  }

  destroy(): void {
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
    }
    if (this.renderer) {
      this.renderer.destroy();
    }
  }
}

// Entry point
const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: bun opentui-app.ts <markdown-file>');
  process.exit(1);
}

const app = new MarkdownPreviewApp(filePath);
await app.start();
