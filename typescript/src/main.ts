// Main entry point for the markdown preview application

import { MarkdownPreviewApp } from './app.js';

/**
 * Parse command line arguments and start the application
 */
async function main(): Promise<void> {
  const filePath = process.argv[2];
  const initialTheme = process.argv[3]; // Optional theme name

  if (!filePath) {
    console.error('Usage: bun main.ts <markdown-file> [theme]');
    console.error('');
    console.error('Examples:');
    console.error('  bun main.ts README.md');
    console.error('  bun main.ts path/to/document.md monokai');
    console.error('  bun main.ts README.md "GitHub Dark"');
    console.error('');
    console.error('Available themes:');
    console.error('  • GitHub Dark (default)');
    console.error('  • Monokai');
    console.error('  • Nord');
    console.error('  • Orng');
    console.error('');
    console.error('Features:');
    console.error('  • Full markdown rendering (tables, inline formatting, etc.)');
    console.error('  • Syntax highlighting for code blocks');
    console.error('  • 4 beautiful themes');
    console.error('  • Conceal mode (hide formatting markers)');
    console.error('  • Streaming mode (simulate live content)');
    console.error('  • Auto file watching');
    console.error('');
    console.error('Press ? in the app for full keybindings list');
    process.exit(1);
  }

  const app = new MarkdownPreviewApp(filePath, {
    initialTheme: initialTheme,
  });

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
