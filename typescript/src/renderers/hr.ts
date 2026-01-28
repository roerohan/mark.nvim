// Horizontal rule renderer

import { Text, Renderable } from '@opentui/core';
import type { ThemeColors } from '../types.js';

/**
 * Render a markdown horizontal rule
 */
export function renderHr(
  parent: Renderable,
  theme: ThemeColors
): void {
  parent.add(Text({
    content: '─'.repeat(80),
    fg: theme.border,
  }));
}
