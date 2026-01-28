// Utility functions for text processing

import type { Token, Tokens } from 'marked';

/**
 * Strip markdown formatting from text
 * Removes bold, italic, code, and link formatting
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')  // Bold
    .replace(/\*(.+?)\*/g, '$1')      // Italic
    .replace(/__(.+?)__/g, '$1')      // Bold (alt)
    .replace(/_(.+?)_/g, '$1')        // Italic (alt)
    .replace(/`(.+?)`/g, '$1')        // Inline code
    .replace(/\[(.+?)\]\(.+?\)/g, '$1'); // Links
}

/**
 * Extract plain text from a list item's tokens
 */
export function extractListItemText(item: Tokens.ListItem): string {
  let text = '';
  
  if (item.tokens && item.tokens.length > 0) {
    for (const token of item.tokens) {
      if (token.type === 'paragraph') {
        text += (token as Tokens.Paragraph).text;
      } else if (token.type === 'heading') {
        text += (token as Tokens.Heading).text;
      } else if ((token as any).text) {
        text += (token as any).text;
      }
    }
  } else {
    text = item.text;
  }
  
  return stripMarkdown(text.trim());
}

/**
 * Extract text content from blockquote tokens
 */
export function extractBlockquoteText(tokens: Token[]): string {
  let text = '';
  
  for (const token of tokens) {
    if (token.type === 'paragraph') {
      text += (token as Tokens.Paragraph).text + ' ';
    }
  }
  
  return stripMarkdown(text.trim());
}

/**
 * Get color for heading based on depth
 */
export function getHeadingColor(depth: number, colors: string[]): string {
  return colors[depth - 1] || '#ffffff';
}

/**
 * Generate heading prefix (# symbols)
 */
export function getHeadingPrefix(depth: number): string {
  return '#'.repeat(depth);
}

/**
 * Generate underline character for heading
 */
export function getHeadingUnderline(depth: number, length: number, maxLength: number = 80): string {
  const char = depth === 1 ? '━' : '─';
  return char.repeat(Math.min(length, maxLength));
}

/**
 * Generate list item bullet/number
 */
export function getListBullet(ordered: boolean, index: number): string {
  return ordered ? `${index + 1}. ` : '• ';
}
