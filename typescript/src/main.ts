// Main entry point for the markdown preview application

import { MarkdownPreviewApp } from './app.js';

/**
 * Parse command line arguments and start the application
 */
async function main(): Promise<void> {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Usage: bun main.ts <markdown-file>');
    console.error('');
    console.error('Examples:');
    console.error('  bun main.ts README.md');
    console.error('  bun main.ts path/to/document.md');
    console.error('');
    console.error('Features:');
    console.error('  • Full markdown rendering (tables, inline formatting, etc.)');
    console.error('  • Syntax highlighting for code blocks');
    console.error('  • 3 themes: GitHub Dark, Monokai, Nord');
    console.error('  • Conceal mode (hide formatting markers)');
    console.error('  • Streaming mode (simulate live content)');
    console.error('  • Auto file watching');
    console.error('');
    console.error('Press ? in the app for full keybindings list');
    process.exit(1);
  }

  const app = new MarkdownPreviewApp(filePath);

  try {
    await app.start();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Run the application
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
