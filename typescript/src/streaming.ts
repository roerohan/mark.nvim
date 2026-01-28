// Streaming mode for markdown preview

import type { MarkdownRenderable, ScrollBoxRenderable } from '@opentui/core';

/**
 * Speed preset configuration
 */
export interface SpeedPreset {
  name: string;
  min: number;
  max: number;
}

/**
 * Streaming speed presets
 */
export const STREAM_SPEEDS: SpeedPreset[] = [
  { name: 'Slowest', min: 200, max: 500 },
  { name: 'Slower', min: 150, max: 350 },
  { name: 'Slow', min: 100, max: 250 },
  { name: 'Medium', min: 70, max: 150 },
  { name: 'Fast', min: 40, max: 100 },
  { name: 'Faster', min: 20, max: 60 },
  { name: 'Fastest', min: 10, max: 50 },
];

/**
 * Streaming manager for markdown content
 */
export class StreamingManager {
  private content: string = '';
  private position: number = 0;
  private timer: Timer | null = null;
  private speedIndex: number = 0;
  private endless: boolean = false;
  private active: boolean = false;
  
  private markdownDisplay: MarkdownRenderable | null = null;
  private scrollBox: ScrollBoxRenderable | null = null;
  private onStatusChange?: (status: string) => void;

  constructor(
    markdownDisplay: MarkdownRenderable,
    scrollBox: ScrollBoxRenderable,
    content: string,
    onStatusChange?: (status: string) => void
  ) {
    this.markdownDisplay = markdownDisplay;
    this.scrollBox = scrollBox;
    this.content = content;
    this.onStatusChange = onStatusChange;
  }

  /**
   * Start streaming
   */
  start(): void {
    this.stop();
    this.active = true;
    this.position = 0;

    if (!this.markdownDisplay || !this.scrollBox) return;

    // Enable streaming mode
    this.markdownDisplay.streaming = true;
    this.markdownDisplay.content = '';

    // Enable sticky scroll to bottom
    this.scrollBox.stickyScroll = true;
    this.scrollBox.stickyStart = 'bottom';

    this.updateStatus('IN PROGRESS');
    this.streamNextChunk();
  }

  /**
   * Stop streaming
   */
  stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.active = false;
    this.position = 0;
    
    if (this.markdownDisplay) {
      this.markdownDisplay.streaming = false;
    }
    
    if (this.scrollBox) {
      this.scrollBox.stickyScroll = false;
    }
  }

  /**
   * Toggle endless mode
   */
  toggleEndless(): void {
    this.endless = !this.endless;
    this.updateStatus(this.active ? 'IN PROGRESS' : 'STOPPED');
  }

  /**
   * Increase speed
   */
  increaseSpeed(): void {
    if (this.speedIndex < STREAM_SPEEDS.length - 1) {
      this.speedIndex++;
      this.updateStatus(this.active ? 'IN PROGRESS' : 'STOPPED');
    }
  }

  /**
   * Decrease speed
   */
  decreaseSpeed(): void {
    if (this.speedIndex > 0) {
      this.speedIndex--;
      this.updateStatus(this.active ? 'IN PROGRESS' : 'STOPPED');
    }
  }

  /**
   * Get current speed preset
   */
  getCurrentSpeed(): SpeedPreset {
    return STREAM_SPEEDS[this.speedIndex];
  }

  /**
   * Check if streaming is active
   */
  isActive(): boolean {
    return this.active;
  }

  /**
   * Check if endless mode is enabled
   */
  isEndless(): boolean {
    return this.endless;
  }

  /**
   * Stream next chunk of content
   */
  private streamNextChunk(): void {
    if (!this.active || !this.markdownDisplay) return;

    // Random chunk size between 1 and 50 characters
    const chunkSize = Math.floor(Math.random() * 50) + 1;

    // Calculate position within current iteration
    const positionInIteration = this.position % this.content.length;
    const nextPosition = Math.min(positionInIteration + chunkSize, this.content.length);

    // Build full content
    const fullIterations = Math.floor(this.position / this.content.length);
    const currentIteration = this.content.slice(0, nextPosition);
    const fullContent = this.content.repeat(fullIterations) + currentIteration;

    this.markdownDisplay.content = fullContent;
    this.position += chunkSize;

    // Continue streaming?
    const shouldContinue = this.endless || this.position < this.content.length;

    if (shouldContinue) {
      // Random delay based on speed
      const speed = this.getCurrentSpeed();
      const delayRange = speed.max - speed.min;
      const delay = Math.floor(Math.random() * delayRange) + speed.min;
      this.timer = setTimeout(() => this.streamNextChunk(), delay);
    } else {
      // Normal mode - complete
      this.active = false;
      this.updateStatus('COMPLETE');
    }
  }

  /**
   * Update status message
   */
  private updateStatus(status: string): void {
    if (this.onStatusChange) {
      const speed = this.getCurrentSpeed();
      const mode = this.endless ? 'ENDLESS' : 'NORMAL';
      this.onStatusChange(`Streaming: ${status} (${speed.name}, ${mode})`);
    }
  }

  /**
   * Update content
   */
  setContent(content: string): void {
    this.content = content;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.stop();
    this.markdownDisplay = null;
    this.scrollBox = null;
    this.onStatusChange = undefined;
  }
}
