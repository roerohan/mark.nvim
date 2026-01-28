// List renderer

import { Box, Text, Renderable } from '@opentui/core';
import type { Tokens } from 'marked';
import type { ThemeColors } from '../types.js';
import { extractListItemText, getListBullet } from '../utils.js';

/**
 * Render a markdown list (ordered or unordered)
 */
export function renderList(
  token: Tokens.List,
  parent: Renderable,
  theme: ThemeColors
): void {
  parent.add(Box(
    {
      width: '100%',
      flexDirection: 'column',
    },
    ...token.items.map((item, i) => {
      const bullet = getListBullet(token.ordered, i);
      const text = extractListItemText(item);
      
      return Text({
        content: `  ${bullet}${text}`,
        fg: theme.foreground,
      });
    })
  ));
}
