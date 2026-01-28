// Error message renderer

import { Box, Text } from '@opentui/core';
import type { ThemeColors } from '../types.js';

/**
 * Render an error message
 */
export function renderError(
  message: string,
  theme: ThemeColors
) {
  return Box(
    {
      id: 'main-container',
      width: '100%',
      height: '100%',
      padding: 2,
      borderStyle: 'rounded',
      borderColor: theme.error,
      backgroundColor: '#1a1a1a',
      flexDirection: 'column',
    },
    Text({
      content: 'ERROR',
      fg: theme.error,
    }),
    Text({
      content: message,
      fg: theme.error,
    })
  );
}
