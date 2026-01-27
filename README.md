# mark.nvim

A terminal-based WYSIWYG markdown preview plugin for Neovim with live rendering, syntax highlighting, and beautiful formatting - all without leaving your terminal!

## Features

- **Live Preview**: Real-time markdown rendering as you type (auto-saves every 500ms)
- **Terminal Native**: No browser required - renders directly in your terminal using OpenTUI
- **Rich Formatting**: Styled headings with colors/underlines, bordered code blocks, lists, blockquotes
- **Syntax Highlighting**: Tree-sitter powered syntax highlighting in code blocks
- **Split Window**: Preview in right/left/top/bottom split
- **GitHub Dark Theme**: Beautiful default color scheme
- **Customizable**: Configurable layouts and keybindings

## Requirements

- Neovim >= 0.9.0
- Bun >= 1.0.0 (required by OpenTUI)

## Installation

### Using [lazy.nvim](https://github.com/folke/lazy.nvim)

```lua
{
  'roerohan/mark.nvim',
  ft = 'markdown',
  build = 'cd typescript && bun install && bun run build',
  config = function()
    require('mark').setup({
      -- your configuration here (optional)
    })
  end,
}
```

### Using [packer.nvim](https://github.com/wbthomason/packer.nvim)

```lua
use {
  'roerohan/mark.nvim',
  ft = 'markdown',
  run = 'cd typescript && bun install && bun run build',
  config = function()
    require('mark').setup()
  end,
}
```

### Using [vim-plug](https://github.com/junegunn/vim-plug)

```vim
Plug 'roerohan/mark.nvim', { 'do': 'cd typescript && bun install && bun run build' }
```

Then in your init.lua:
```lua
require('mark').setup()
```

### Manual Installation

```bash
cd ~/.local/share/nvim/site/pack/plugins/start/
git clone https://github.com/roerohan/mark.nvim
cd mark.nvim/typescript
bun install
bun run build
```

## Configuration

Here's the default configuration with all available options:

```lua
require('mark').setup({
  -- Window settings
  split_position = 'right',     -- 'right', 'left', 'top', 'bottom'
  split_size = 50,              -- Percentage of window (1-100)
  
  -- Auto-start preview when opening markdown files
  auto_start = false,
  
  -- Keybindings
  mappings = {
    toggle_preview = '<leader>mp',  -- Toggle preview
  },
  
  -- Markdown features
  enable_tables = true,
  enable_code_blocks = true,
  syntax_highlight = true,
  
  -- Debug
  debug = false,
})
```

### Minimal Configuration

```lua
require('mark').setup()  -- Uses all defaults
```

### Custom Configuration Example

```lua
require('mark').setup({
  auto_start = true,          -- Start preview automatically
  split_position = 'bottom',  -- Preview at bottom
  split_size = 40,            -- 40% of window height
  update_delay = 50,          -- Faster updates
  debug = true,               -- Enable debug logging
})
```

## Usage

### Commands

| Command | Description |
|---------|-------------|
| `:MarkPreview` | Start markdown preview |
| `:MarkPreviewStop` | Stop markdown preview |
| `:MarkPreviewToggle` | Toggle preview on/off |

### Default Keybindings

| Key | Action |
|-----|--------|
| `<leader>mp` | Toggle preview |

## How to Test

### 1. Quick Test

```bash
# Navigate to the mark.nvim directory
cd /path/to/mark.nvim

# Build the TypeScript renderer
cd typescript
bun install
bun run build
cd ..

# Open the test markdown file
nvim -u tests/minimal_init.vim tests/test_example.md
```

Once in Neovim:
1. Type `:MarkPreview` or press `<leader>mp`
2. You should see a split window with rendered markdown
3. Start editing - the preview updates in real-time!

### 2. Test with Your Own Config

Create a test init.lua file:

```lua
-- test_init.lua
vim.opt.runtimepath:append('.')

require('mark').setup({
  debug = true,  -- Enable debug output
})
```

Then:
```bash
nvim -u test_init.lua your_document.md
```

### 3. Run Automated Tests

#### Lua Tests
```bash
# Install plenary.nvim for testing
git clone https://github.com/nvim-lua/plenary.nvim ../plenary.nvim

# Run all tests
nvim --headless -c "PlenaryBustedDirectory tests/ {minimal_init = 'tests/minimal_init.vim'}"

# Run specific test
busted tests/test_config_spec.lua
```

#### TypeScript Tests
```bash
cd typescript

# Run all tests
bun test

# Run specific test
bun test renderer.test.ts
```

### 4. Manual Testing Checklist

Open `tests/test_example.md` and verify:

- [ ] Headings are styled with colors and underlines
- [ ] Code blocks have rounded borders and syntax labels
- [ ] Tables show dimensions
- [ ] Lists show colored bullets/numbers correctly
- [ ] Blockquotes have borders
- [ ] Horizontal rules render as lines
- [ ] Preview updates as you type (auto-save every 500ms)
- [ ] `:MarkPreviewToggle` toggles preview
- [ ] `:MarkPreviewStop` closes preview

### 5. Troubleshooting Tests

If the preview doesn't start:

```bash
# Check if Bun is installed
bun --version  # Should be >= 1.0.0

# Check if TypeScript was built
ls typescript/dist/opentui-app.js  # Should exist

# Rebuild if needed
cd typescript && bun run build

# Check for errors
nvim -c "lua require('mark').setup({debug = true})" test.md
# Then run :MarkPreview and check :messages for errors
```

## Architecture

```
┌─────────────────────────────────────┐
│       Neovim (Lua Plugin)           │
│  • Opens terminal buffer            │
│  • Auto-saves on buffer changes     │
│  • Window management                │
└──────────────┬──────────────────────┘
               │ Terminal + File watching
┌──────────────▼──────────────────────┐
│   Bun + OpenTUI Renderer            │
│  • Markdown parser (marked)         │
│  • OpenTUI terminal UI              │
│  • File polling (500ms)             │
│  • Tree-sitter syntax highlighting  │
└─────────────────────────────────────┘
```

## Supported Markdown Features

- ✅ Headings (H1-H6) with colors and underlines
- ✅ Paragraphs with word wrapping
- ✅ Code blocks with syntax highlighting and rounded borders
- ✅ Bullet lists with colored bullets
- ✅ Numbered lists
- ✅ Blockquotes with borders
- ✅ Tables (shows dimensions)
- ✅ Horizontal rules
- ⚠️ Inline formatting (bold/italic/code) - currently stripped from text

## Performance

- **Debounced updates**: Changes are batched to avoid excessive rendering
- **Fast rendering**: Terminal rendering is extremely fast
- **Minimal overhead**: Separate process doesn't slow down Neovim

## Development

### Project Structure

```
mark.nvim/
├── lua/mark/              # Neovim plugin (Lua)
│   ├── init.lua           # Main entry point
│   ├── config.lua         # Configuration
│   ├── commands.lua       # Terminal management
│   └── utils.lua          # Utilities
├── typescript/            # OpenTUI Renderer (TypeScript)
│   ├── src/
│   │   ├── opentui-app.ts # Main OpenTUI application
│   │   └── parser.ts      # Markdown parser wrapper
│   └── dist/              # Compiled JS
├── tests/                 # Test files
└── plugin/                # Auto-load entry
```

### Building

```bash
cd typescript
bun run build       # Compile TypeScript
bun run dev         # Watch mode
```

### Testing

```bash
# Lua tests
busted tests/

# TypeScript tests
cd typescript && bun test
```

## Roadmap

- [ ] Inline formatting (proper bold/italic/code rendering with template literals)
- [ ] Scrolling support for long documents
- [ ] Full table rendering (not just dimensions)
- [ ] Additional themes (light mode, custom colors)
- [ ] Image rendering with terminal graphics protocols
- [ ] LaTeX math support
- [ ] Mermaid diagram support
- [ ] Performance optimizations for large documents

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run tests and linting
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [OpenTUI](https://github.com/codingwatching/OpenTUI) for the terminal UI framework
- [marked](https://marked.js.org/) for markdown parsing
- [Bun](https://bun.sh/) for the fast JavaScript runtime
- [Neovim](https://neovim.io/) for the amazing editor
- Inspired by other preview plugins but with a terminal-first approach

## Support

- Issues: [GitHub Issues](https://github.com/roerohan/mark.nvim/issues)
- Discussions: [GitHub Discussions](https://github.com/roerohan/mark.nvim/discussions)
