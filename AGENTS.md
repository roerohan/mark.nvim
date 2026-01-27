# AGENTS.md - Coding Agent Guidelines for mark.nvim

## Project Overview

**mark.nvim** is a terminal-based WYSIWYG markdown preview Neovim plugin using OpenTUI (TypeScript) for rich text rendering and Lua for editor integration.

**Tech Stack:**
- **Frontend:** OpenTUI (TypeScript/Zig) for terminal rendering
- **Backend:** Neovim plugin (Lua 5.1+)
- **Parser:** marked/markdown-it for markdown parsing
- **Communication:** JSON-RPC over stdio
- **Requirements:** Neovim ≥0.9.0, Node.js ≥18.0

## Project Structure

```
mark.nvim/
├── lua/mark/           # Lua plugin code
│   ├── init.lua        # Main entry point
│   ├── config.lua      # Configuration management
│   ├── commands.lua    # User commands
│   ├── rpc.lua        # RPC client for TypeScript communication
│   └── utils.lua      # Helper utilities
├── typescript/         # TypeScript renderer
│   ├── src/
│   │   ├── main.ts         # Entry point
│   │   ├── renderer.ts     # OpenTUI renderer
│   │   ├── parser.ts       # Markdown parser
│   │   ├── wysiwyg.ts      # WYSIWYG mode
│   │   ├── preview.ts      # Split preview mode
│   │   └── rpc-server.ts   # RPC server
│   ├── package.json
│   └── tsconfig.json
├── plugin/mark.lua     # Auto-load entry
├── doc/mark.txt        # Vim help documentation
└── tests/              # Test files
```

## Build & Test Commands

### Lua Plugin
```bash
# Run tests (using plenary.nvim or busted)
nvim --headless -c "PlenaryBustedDirectory tests/ {minimal_init = 'tests/minimal_init.vim'}"

# Or with busted
busted tests/

# Run single test file
busted tests/test_config_spec.lua

# Lint Lua code
luacheck lua/ --globals vim
```

### TypeScript Renderer
```bash
cd typescript/

# Install dependencies
npm install

# Build
npm run build

# Watch mode for development
npm run dev

# Run tests
npm test

# Run single test
npm test -- renderer.test.ts

# Lint
npm run lint

# Type check
npm run typecheck
```

### Manual Testing
```bash
# Test plugin in Neovim
nvim -u tests/minimal_init.vim test.md

# Open Neovim with plugin loaded
nvim -c "lua require('mark').setup()" test.md
```

## Code Style Guidelines

### Lua Code Style

#### File Structure
```lua
-- Description of module
-- @module mark.config

local M = {}

-- Private variables
local config = {}

-- Private functions
local function validate_config(cfg)
  -- Implementation
end

-- Public API
function M.setup(opts)
  -- Implementation
end

return M
```

#### Naming Conventions
- **Modules:** lowercase with underscores: `rpc_client.lua`
- **Functions:** snake_case: `get_buffer_content()`, `parse_markdown()`
- **Variables:** snake_case: `local buffer_id`, `local current_mode`
- **Constants:** UPPER_SNAKE_CASE: `local DEFAULT_CONFIG`
- **Private functions:** prefix with underscore: `local function _internal_helper()`

#### Code Formatting
- **Indentation:** 2 spaces (no tabs)
- **Line length:** Max 100 characters
- **Strings:** Single quotes preferred: `'hello'` over `"hello"`
- **Tables:** Trailing commas for multi-line tables
```lua
local config = {
  auto_start = false,
  update_delay = 100,
  split_position = 'right',  -- trailing comma
}
```

#### Imports
```lua
-- Standard library first
local vim = vim

-- Third-party plugins
local async = require('plenary.async')

-- Local modules (relative)
local config = require('mark.config')
local utils = require('mark.utils')
```

#### Error Handling
- Use `pcall()` for operations that may fail
- Always validate user input
- Provide helpful error messages with `vim.notify()`
```lua
local ok, result = pcall(function()
  return risky_operation()
end)

if not ok then
  vim.notify('mark.nvim: ' .. result, vim.log.levels.ERROR)
  return nil
end
```

#### Neovim API Best Practices
- Use `vim.api.*` for core operations
- Use `vim.fn.*` sparingly (prefer Lua API)
- Use `vim.schedule()` for deferred execution
- Use `vim.loop` (libuv) for timers and async I/O
- Always clean up autocommands and event listeners

### TypeScript Code Style

#### File Structure
```typescript
// Imports
import { CliRenderer } from 'opentui';
import type { Token } from 'marked';

// Types/Interfaces
interface RenderOptions {
  theme: string;
  fontSize: number;
}

// Class or functions
export class MarkdownRenderer {
  // Implementation
}
```

#### Naming Conventions
- **Files:** camelCase: `rpcServer.ts`, `markdownParser.ts`
- **Classes:** PascalCase: `PreviewMode`, `WYSIWYGRenderer`
- **Functions:** camelCase: `parseMarkdown()`, `renderToken()`
- **Variables:** camelCase: `cursorLine`, `scrollOffset`
- **Constants:** UPPER_SNAKE_CASE: `const DEFAULT_THEME = 'default'`
- **Interfaces/Types:** PascalCase: `RenderOptions`, `ParsedMarkdown`
- **Private members:** prefix with `#` or `private`: `#renderer`, `private config`

#### Code Formatting
- **Indentation:** 2 spaces
- **Line length:** Max 100 characters
- **Semicolons:** Always use semicolons
- **Quotes:** Single quotes for strings, backticks for templates
- **Trailing commas:** Yes for multi-line objects/arrays

#### Imports
```typescript
// Node built-ins first
import * as fs from 'fs';
import * as path from 'path';

// External dependencies
import { marked } from 'marked';
import { CliRenderer } from 'opentui';

// Local modules (relative)
import { parseMarkdown } from './parser';
import type { RenderOptions } from './types';
```

#### Error Handling
- Use try-catch for async operations
- Always type error objects
- Log errors appropriately
```typescript
try {
  await renderer.render(content);
} catch (error) {
  if (error instanceof Error) {
    console.error(`Render failed: ${error.message}`);
  }
  throw error;
}
```

#### Type Safety
- Always use TypeScript strict mode
- Prefer interfaces over types for objects
- Use `unknown` instead of `any`
- Define return types explicitly for public functions
```typescript
function parseMarkdown(content: string): ParsedMarkdown {
  // Type is explicit
}
```

## Communication Protocol (RPC)

### Message Format
All messages are JSON-RPC 2.0 over stdio.

### Request Types
```typescript
// Neovim → TypeScript
{
  jsonrpc: '2.0',
  id: 1,
  method: 'updateContent',
  params: { content: string, cursorLine: number }
}

// TypeScript → Neovim (response)
{
  jsonrpc: '2.0',
  id: 1,
  result: { rendered: true }
}
```

### Supported Methods
- `initialize(config)` - Setup renderer
- `updateContent(content, cursorLine)` - Update preview
- `setCursor(line, col)` - Sync scroll
- `setMode(mode)` - Switch preview/WYSIWYG
- `shutdown()` - Clean exit

## Testing Guidelines

### Lua Tests
- Use plenary.nvim or busted
- Test file naming: `*_spec.lua`
- Mock external dependencies
- Test both success and failure cases

### TypeScript Tests
- Use Jest or Vitest
- Test file naming: `*.test.ts`
- Mock OpenTUI renderer for unit tests
- Integration tests for RPC communication

## Performance Considerations

- **Debouncing:** Updates debounced to 100ms (configurable)
- **Incremental rendering:** Only re-render changed blocks
- **Viewport culling:** Render visible area + buffer
- **Lazy loading:** Large documents loaded in chunks
- **Caching:** Cache parsed/rendered output for unchanged content

## Git Commit Guidelines

- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- Keep commits focused and atomic
- Reference issues: `feat: add table rendering (closes #42)`

## Common Tasks

### Adding a New Command
1. Define command in `lua/mark/commands.lua`
2. Register in `lua/mark/init.lua` setup
3. Document in `doc/mark.txt`
4. Add tests

### Adding a New Render Type
1. Add token handler in `typescript/src/renderer.ts`
2. Define rendering logic using OpenTUI components
3. Update parser metadata extraction
4. Test with various markdown samples

### Debugging
- Lua: `vim.notify()` or `:messages`
- TypeScript: `console.log()` goes to stderr (visible in `:messages`)
- Enable debug logging: `require('mark').setup({ debug = true })`

## Resources

- [Neovim Lua Guide](https://neovim.io/doc/user/lua-guide.html)
- [OpenTUI Documentation](https://github.com/codingwatching/OpenTUI)
- [marked.js Documentation](https://marked.js.org/)
- [Neovim Plugin Development Best Practices](https://github.com/nanotee/nvim-lua-guide)
