// Table renderer

import { Box, Text, Renderable } from '@opentui/core';
import type { Tokens } from 'marked';
import type { ThemeColors } from '../types.js';

/**
 * Render a markdown table
 * TODO: Implement full table rendering with rows and columns
 */
export function renderTable(
  token: Tokens.Table,
  parent: Renderable,
  theme: ThemeColors
): void {
  parent.add(Box(
    {
      width: '100%',
      borderStyle: 'rounded',
      padding: 1,
      backgroundColor: theme.backgroundAlt,
      borderColor: theme.border,
    },
    Text({
      content: `TABLE: ${token.header.length} columns × ${token.rows.length} rows`,
      fg: theme.table,
    })
  ));
}
