// Main entry point for the markdown preview application

import { MarkdownPreviewApp } from './app.js';

/**
 * Parse command line arguments and start the application
 */
async function main(): Promise<void> {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Usage: bun main.ts <markdown-file>');
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
