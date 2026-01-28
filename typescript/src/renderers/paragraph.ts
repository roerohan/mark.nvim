// Paragraph renderer

import { Text, Renderable } from '@opentui/core';
import type { Tokens } from 'marked';
import type { ThemeColors } from '../types.js';
import { stripMarkdown } from '../utils.js';

/**
 * Render a markdown paragraph
 */
export function renderParagraph(
  token: Tokens.Paragraph,
  parent: Renderable,
  theme: ThemeColors
): void {
  const text = stripMarkdown(token.text);

  parent.add(Text({
    content: text,
    fg: theme.foreground,
  }));
}
