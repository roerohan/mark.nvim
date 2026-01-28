// Theme and syntax highlighting configuration

import { SyntaxStyle, parseColor } from '@opentui/core';

/**
 * Theme configuration
 */
export interface Theme {
  name: string;
  bg: string;
  styles: Record<string, any>;
}

/**
 * GitHub Dark theme colors
 */
export const GITHUB_DARK_THEME: Theme = {
  name: 'GitHub Dark',
  bg: '#0D1117',
  styles: {
    keyword: { fg: parseColor('#FF7B72'), bold: true },
    string: { fg: parseColor('#A5D6FF') },
    comment: { fg: parseColor('#8B949E'), italic: true },
    number: { fg: parseColor('#79C0FF') },
    function: { fg: parseColor('#D2A8FF') },
    type: { fg: parseColor('#FFA657') },
    operator: { fg: parseColor('#FF7B72') },
    variable: { fg: parseColor('#E6EDF3') },
    property: { fg: parseColor('#79C0FF') },
    'punctuation.bracket': { fg: parseColor('#F0F6FC') },
    'punctuation.delimiter': { fg: parseColor('#C9D1D9') },
    'markup.heading': { fg: parseColor('#58A6FF'), bold: true },
    'markup.heading.1': { fg: parseColor('#00FF88'), bold: true, underline: true },
    'markup.heading.2': { fg: parseColor('#00D7FF'), bold: true },
    'markup.heading.3': { fg: parseColor('#FF69B4') },
    'markup.bold': { fg: parseColor('#F0F6FC'), bold: true },
    'markup.strong': { fg: parseColor('#F0F6FC'), bold: true },
    'markup.italic': { fg: parseColor('#F0F6FC'), italic: true },
    'markup.list': { fg: parseColor('#FF7B72') },
    'markup.quote': { fg: parseColor('#8B949E'), italic: true },
    'markup.raw': { fg: parseColor('#A5D6FF'), bg: parseColor('#161B22') },
    'markup.raw.block': { fg: parseColor('#A5D6FF'), bg: parseColor('#161B22') },
    'markup.raw.inline': { fg: parseColor('#A5D6FF'), bg: parseColor('#161B22') },
    'markup.link': { fg: parseColor('#58A6FF'), underline: true },
    'markup.link.label': { fg: parseColor('#A5D6FF'), underline: true },
    'markup.link.url': { fg: parseColor('#58A6FF'), underline: true },
    label: { fg: parseColor('#7EE787') },
    conceal: { fg: parseColor('#6E7681') },
    'punctuation.special': { fg: parseColor('#8B949E') },
    default: { fg: parseColor('#E6EDF3') },
  },
};

/**
 * Monokai theme colors
 */
export const MONOKAI_THEME: Theme = {
  name: 'Monokai',
  bg: '#272822',
  styles: {
    keyword: { fg: parseColor('#F92672'), bold: true },
    string: { fg: parseColor('#E6DB74') },
    comment: { fg: parseColor('#75715E'), italic: true },
    number: { fg: parseColor('#AE81FF') },
    function: { fg: parseColor('#A6E22E') },
    type: { fg: parseColor('#66D9EF'), italic: true },
    operator: { fg: parseColor('#F92672') },
    variable: { fg: parseColor('#F8F8F2') },
    property: { fg: parseColor('#A6E22E') },
    'punctuation.bracket': { fg: parseColor('#F8F8F2') },
    'punctuation.delimiter': { fg: parseColor('#F8F8F2') },
    'markup.heading': { fg: parseColor('#A6E22E'), bold: true },
    'markup.heading.1': { fg: parseColor('#F92672'), bold: true, underline: true },
    'markup.heading.2': { fg: parseColor('#66D9EF'), bold: true },
    'markup.heading.3': { fg: parseColor('#E6DB74') },
    'markup.bold': { fg: parseColor('#F8F8F2'), bold: true },
    'markup.strong': { fg: parseColor('#F8F8F2'), bold: true },
    'markup.italic': { fg: parseColor('#F8F8F2'), italic: true },
    'markup.list': { fg: parseColor('#F92672') },
    'markup.quote': { fg: parseColor('#75715E'), italic: true },
    'markup.raw': { fg: parseColor('#E6DB74'), bg: parseColor('#3E3D32') },
    'markup.raw.block': { fg: parseColor('#E6DB74'), bg: parseColor('#3E3D32') },
    'markup.raw.inline': { fg: parseColor('#E6DB74'), bg: parseColor('#3E3D32') },
    'markup.link': { fg: parseColor('#66D9EF'), underline: true },
    'markup.link.label': { fg: parseColor('#E6DB74'), underline: true },
    'markup.link.url': { fg: parseColor('#66D9EF'), underline: true },
    label: { fg: parseColor('#A6E22E') },
    conceal: { fg: parseColor('#75715E') },
    'punctuation.special': { fg: parseColor('#75715E') },
    default: { fg: parseColor('#F8F8F2') },
  },
};

/**
 * Nord theme colors
 */
export const NORD_THEME: Theme = {
  name: 'Nord',
  bg: '#2E3440',
  styles: {
    keyword: { fg: parseColor('#81A1C1'), bold: true },
    string: { fg: parseColor('#A3BE8C') },
    comment: { fg: parseColor('#616E88'), italic: true },
    number: { fg: parseColor('#B48EAD') },
    function: { fg: parseColor('#88C0D0') },
    type: { fg: parseColor('#8FBCBB') },
    operator: { fg: parseColor('#81A1C1') },
    variable: { fg: parseColor('#D8DEE9') },
    property: { fg: parseColor('#88C0D0') },
    'punctuation.bracket': { fg: parseColor('#ECEFF4') },
    'punctuation.delimiter': { fg: parseColor('#D8DEE9') },
    'markup.heading': { fg: parseColor('#88C0D0'), bold: true },
    'markup.heading.1': { fg: parseColor('#8FBCBB'), bold: true, underline: true },
    'markup.heading.2': { fg: parseColor('#81A1C1'), bold: true },
    'markup.heading.3': { fg: parseColor('#B48EAD') },
    'markup.bold': { fg: parseColor('#ECEFF4'), bold: true },
    'markup.strong': { fg: parseColor('#ECEFF4'), bold: true },
    'markup.italic': { fg: parseColor('#ECEFF4'), italic: true },
    'markup.list': { fg: parseColor('#81A1C1') },
    'markup.quote': { fg: parseColor('#616E88'), italic: true },
    'markup.raw': { fg: parseColor('#A3BE8C'), bg: parseColor('#3B4252') },
    'markup.raw.block': { fg: parseColor('#A3BE8C'), bg: parseColor('#3B4252') },
    'markup.raw.inline': { fg: parseColor('#A3BE8C'), bg: parseColor('#3B4252') },
    'markup.link': { fg: parseColor('#88C0D0'), underline: true },
    'markup.link.label': { fg: parseColor('#A3BE8C'), underline: true },
    'markup.link.url': { fg: parseColor('#88C0D0'), underline: true },
    label: { fg: parseColor('#A3BE8C') },
    conceal: { fg: parseColor('#4C566A') },
    'punctuation.special': { fg: parseColor('#616E88') },
    default: { fg: parseColor('#D8DEE9') },
  },
};

/**
 * Orng theme colors (inspired by lucent-orng from OpenCode)
 * A warm, orange-accented theme with excellent contrast
 */
export const ORNG_THEME: Theme = {
  name: 'Orng',
  bg: '#1a1a1a',
  styles: {
    keyword: { fg: parseColor('#EC5B2B'), bold: true },
    string: { fg: parseColor('#6ba1e6') },
    comment: { fg: parseColor('#808080'), italic: true },
    number: { fg: parseColor('#FFF7F1') },
    function: { fg: parseColor('#EE7948') },
    type: { fg: parseColor('#e5c07b') },
    operator: { fg: parseColor('#56b6c2') },
    variable: { fg: parseColor('#e06c75') },
    property: { fg: parseColor('#6ba1e6') },
    'punctuation.bracket': { fg: parseColor('#eeeeee') },
    'punctuation.delimiter': { fg: parseColor('#eeeeee') },
    'markup.heading': { fg: parseColor('#EC5B2B'), bold: true },
    'markup.heading.1': { fg: parseColor('#EC5B2B'), bold: true, underline: true },
    'markup.heading.2': { fg: parseColor('#EE7948'), bold: true },
    'markup.heading.3': { fg: parseColor('#e5c07b') },
    'markup.bold': { fg: parseColor('#EE7948'), bold: true },
    'markup.strong': { fg: parseColor('#EE7948'), bold: true },
    'markup.italic': { fg: parseColor('#e5c07b'), italic: true },
    'markup.list': { fg: parseColor('#EC5B2B') },
    'markup.quote': { fg: parseColor('#FFF7F1'), italic: true },
    'markup.raw': { fg: parseColor('#6ba1e6'), bg: parseColor('#3c3c3c') },
    'markup.raw.block': { fg: parseColor('#6ba1e6'), bg: parseColor('#3c3c3c') },
    'markup.raw.inline': { fg: parseColor('#6ba1e6'), bg: parseColor('#3c3c3c') },
    'markup.link': { fg: parseColor('#EC5B2B'), underline: true },
    'markup.link.label': { fg: parseColor('#56b6c2'), underline: true },
    'markup.link.url': { fg: parseColor('#EC5B2B'), underline: true },
    label: { fg: parseColor('#EE7948') },
    conceal: { fg: parseColor('#808080') },
    'punctuation.special': { fg: parseColor('#808080') },
    default: { fg: parseColor('#eeeeee') },
  },
};

/**
 * All available themes
 */
export const THEMES = [GITHUB_DARK_THEME, MONOKAI_THEME, NORD_THEME, ORNG_THEME];

/**
 * Create syntax style from theme
 */
export function createSyntaxStyle(theme: Theme = GITHUB_DARK_THEME): SyntaxStyle {
  return SyntaxStyle.fromStyles(theme.styles);
}

/**
 * Get theme by index
 */
export function getTheme(index: number): Theme {
  return THEMES[index % THEMES.length];
}

/**
 * Get theme by name
 */
export function getThemeByName(name: string): Theme | undefined {
  return THEMES.find(t => t.name.toLowerCase() === name.toLowerCase());
}
