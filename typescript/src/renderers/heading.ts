// Heading renderer

import { BoxRenderable, Box, Text } from '@opentui/core';
import type { Tokens } from 'marked';
import type { ThemeColors } from '../types.js';
import { getHeadingColor, getHeadingPrefix } from '../utils.js';

/**
 * Render a markdown heading
 */
export function renderHeading(
  token: Tokens.Heading,
  parent: BoxRenderable,
  theme: ThemeColors
): void {
  const color = getHeadingColor(token.depth, theme.headings);
  const prefix = getHeadingPrefix(token.depth);

  // H1 and H2 get underlines
  if (token.depth === 1 || token.depth === 2) {
    parent.add(Box(
      {
        width: '100%',
        height: 3,
        borderStyle: "rounded",
      },
      Text({
        content: `${prefix} ${token.text}`,
        fg: color,
      }),
    ),)
  } else {
    parent.add(Text({
      content: `${prefix} ${token.text}`,
      fg: color,
    }));
  }
}
