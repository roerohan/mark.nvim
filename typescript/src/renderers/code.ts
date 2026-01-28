// Code block renderer

import { Box, Text, Renderable, SyntaxStyle, CodeRenderable } from '@opentui/core';
import type { Tokens } from 'marked';
import type { ThemeColors, RenderContext } from '../types.js';
import { mapLanguage } from '../theme.js';

/**
 * Render a markdown code block
 */
export function renderCode(
  token: Tokens.Code,
  parent: Renderable,
  theme: ThemeColors,
  syntaxStyle: SyntaxStyle,
  context: RenderContext
): void {
  const lang = mapLanguage(token.lang || 'text');

  const children: any[] = [];
  
  if (token.lang) {
    children.push(Box(
      {
        width: '100%',
        backgroundColor: theme.backgroundAlt,
      },
      Text({
        content: token.lang.toUpperCase(),
        fg: theme.codeLabel,
      })
    ));
  }
  
  children.push(new CodeRenderable(context.renderer, {
    content: token.text,
    filetype: lang,
    syntaxStyle: syntaxStyle,
  }));

  parent.add(Box(
    {
      width: '100%',
      borderStyle: 'rounded',
      borderColor: theme.border,
      padding: 1,
    },
    ...children
  ));
}
