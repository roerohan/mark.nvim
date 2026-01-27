// Markdown parser using marked

import { marked } from 'marked';
import type { Token, Tokens } from 'marked';

export interface ParsedMarkdown {
  tokens: Token[];
}

export function parseMarkdown(content: string): ParsedMarkdown {
  const tokens = marked.lexer(content);
  return { tokens };
}

export function isHeading(token: Token): token is Tokens.Heading {
  return token.type === 'heading';
}

export function isParagraph(token: Token): token is Tokens.Paragraph {
  return token.type === 'paragraph';
}

export function isCode(token: Token): token is Tokens.Code {
  return token.type === 'code';
}

export function isList(token: Token): token is Tokens.List {
  return token.type === 'list';
}

export function isBlockquote(token: Token): token is Tokens.Blockquote {
  return token.type === 'blockquote';
}

export function isHr(token: Token): token is Tokens.Hr {
  return token.type === 'hr';
}

export function isTable(token: Token): token is Tokens.Table {
  return token.type === 'table';
}

export function isSpace(token: Token): token is Tokens.Space {
  return token.type === 'space';
}
