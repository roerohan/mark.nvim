// Blockquote renderer

import { Box, Text, Renderable } from '@opentui/core';
import type { Tokens } from 'marked';
import type { ThemeColors } from '../types.js';
import { extractBlockquoteText } from '../utils.js';

/**
 * Render a markdown blockquote
 */
export function renderBlockquote(
  token: Tokens.Blockquote,
  parent: Renderable,
  theme: ThemeColors
): void {
  const text = extractBlockquoteText(token.tokens);
  const lines = text.split('\n');

  parent.add(Box(
    {
      width: '100%',
      borderStyle: 'single',
      borderColor: theme.border,
      padding: 1,
      backgroundColor: theme.backgroundAlt,
      flexDirection: 'column',
    },
    ...lines.map((line: string) => 
      Text({
        content: `│ ${line}`,
        fg: theme.quote,
      })
    )
  ));
}
