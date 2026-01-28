// Header renderer for the preview window

import { Text, Box, Renderable } from '@opentui/core';
import type { ThemeColors } from '../types.js';

/**
 * Render the application header with file name
 */
export function renderHeader(
  fileName: string,
  parent: Renderable,
  theme: ThemeColors
): void {
  parent.add(Box(
    {
      width: '100%',
      height: 3,
      borderStyle: "rounded",
    },
    Text({
      content: `${fileName} - Markdown Preview`,
      fg: theme.accent,
    }),
  ));
}
