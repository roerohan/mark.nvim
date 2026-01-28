// Theme and syntax highlighting configuration

import { SyntaxStyle, RGBA } from '@opentui/core';
import type { ThemeColors } from './types.js';

/**
 * GitHub Dark theme colors
 */
export const GITHUB_DARK_THEME: ThemeColors = {
  background: '#0d1117',
  backgroundAlt: '#161b22',
  foreground: '#e6edf3',
  border: '#30363d',
  accent: '#58A6FF',
  error: '#f85149',
  headings: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#d2a8ff', '#f3a683', '#a8dadc'],
  codeLabel: '#ffa657',
  quote: '#8b949e',
  link: '#58A6FF',
  table: '#79c0ff',
};

/**
 * Language mapping for syntax highlighting
 */
export const LANGUAGE_MAP: Record<string, string> = {
  'js': 'javascript',
  'ts': 'typescript',
  'jsx': 'javascript',
  'tsx': 'typescript',
  'py': 'python',
  'rb': 'ruby',
  'sh': 'bash',
  'shell': 'bash',
  'yml': 'yaml',
  'md': 'markdown',
};

/**
 * Map language alias to canonical name
 */
export function mapLanguage(lang: string): string {
  return LANGUAGE_MAP[lang.toLowerCase()] || lang.toLowerCase();
}

/**
 * Create GitHub Dark syntax style for code blocks
 */
export function createSyntaxStyle(): SyntaxStyle {
  return SyntaxStyle.fromStyles({
    keyword: { fg: RGBA.fromHex('#ff7b72') },
    'keyword.import': { fg: RGBA.fromHex('#ff7b72') },
    'keyword.function': { fg: RGBA.fromHex('#ff7b72') },
    string: { fg: RGBA.fromHex('#a5d6ff') },
    'string.special': { fg: RGBA.fromHex('#a5d6ff') },
    comment: { fg: RGBA.fromHex('#8b949e') },
    number: { fg: RGBA.fromHex('#79c0ff') },
    boolean: { fg: RGBA.fromHex('#79c0ff') },
    constant: { fg: RGBA.fromHex('#79c0ff') },
    function: { fg: RGBA.fromHex('#d2a8ff') },
    'function.call': { fg: RGBA.fromHex('#d2a8ff') },
    'function.method': { fg: RGBA.fromHex('#d2a8ff') },
    type: { fg: RGBA.fromHex('#ffa657') },
    variable: { fg: RGBA.fromHex('#e6edf3') },
    'variable.parameter': { fg: RGBA.fromHex('#ffa657') },
    operator: { fg: RGBA.fromHex('#ff7b72') },
    punctuation: { fg: RGBA.fromHex('#c9d1d9') },
    default: { fg: RGBA.fromHex('#e6edf3') },
  });
}
