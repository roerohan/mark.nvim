# mark.nvim

A beautiful terminal-based markdown preview for Neovim with live rendering, syntax highlighting, and no browser required.

## ✨ Features

- 🎨 **Beautiful Themes** - GitHub Dark, Monokai, Nord (cycle with `T`)
- 📊 **Full Markdown Support** - Tables, inline formatting, code blocks
- 🎯 **Live Preview** - Auto-updates as you type
- 🔤 **Syntax Highlighting** - Tree-sitter powered code blocks
- 👁️ **Conceal Mode** - Hide formatting markers (toggle with `C`)
- 🚀 **Streaming Demo** - Watch content appear in real-time
- 💻 **Terminal Native** - No browser, works in tmux/ssh

## 📦 Requirements

- Neovim >= 0.9.0
- [Bun](https://bun.sh) >= 1.0.0

## 🚀 Installation

### [lazy.nvim](https://github.com/folke/lazy.nvim)

```lua
{
  'roerohan/mark.nvim',
  ft = 'markdown',
  build = 'cd typescript && bun install && bun run build',
  config = function()
    require('mark').setup()
  end,
}
```

### [packer.nvim](https://github.com/wbthomason/packer.nvim)

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

## 🎮 Usage

### Commands

```vim
:MarkPreview        " Start preview
:MarkPreviewStop    " Stop preview
:MarkPreviewToggle  " Toggle preview
```

### Keybindings in Preview

| Key | Action |
|-----|--------|
| `T` | Cycle themes (GitHub → Monokai → Nord) |
| `C` | Toggle conceal mode |
| `R` | Reload file |
| `S` | Start streaming demo |
| `E` | Toggle endless streaming |
| `X` | Stop streaming |
| `[` / `]` | Adjust streaming speed |
| `?` | Show help |
| `ESC` | Exit preview |

### In Neovim

```vim
<leader>mp    " Toggle preview (default mapping)
<C-w>w        " Switch between editor and preview
```

## ⚙️ Configuration

```lua
require('mark').setup({
  split_position = 'right',  -- 'right', 'left', 'top', 'bottom'
  split_size = 50,           -- Percentage (1-100)
  auto_start = false,        -- Auto-start on markdown files
  
  mappings = {
    toggle_preview = '<leader>mp',
  },
})
```

## 🧪 Quick Test

```bash
# Navigate to plugin directory
cd ~/.local/share/nvim/lazy/mark.nvim  # or your plugin path

# Open test file
nvim tests/demo.md

# In Neovim
:MarkPreview
```

Then try:
- Press `T` to cycle through themes
- Press `C` to toggle conceal mode
- Press `?` for help
- Edit the file and watch it update live

## 📚 Supported Markdown

✅ Headings (H1-H6) with colors  
✅ **Bold**, *italic*, `inline code`  
✅ Tables with automatic alignment  
✅ Code blocks with syntax highlighting  
✅ Lists (ordered and unordered)  
✅ Blockquotes  
✅ Horizontal rules  
✅ Links  
✅ Unicode and emoji 🎉  

## 🔧 Troubleshooting

**Preview not showing?**
```vim
:lua require('mark.commands').debug_info()
```

**Check build:**
```bash
ls typescript/dist/main.js  # Should exist
cd typescript && bun run build  # Rebuild if needed
```

**Old preview showing?**
```vim
" Reload plugin
:lua package.loaded['mark.commands'] = nil
:lua require('mark').setup()
```

## 🏗️ Architecture

```
Neovim (Lua)  ←→  Terminal  ←→  OpenTUI App (TypeScript)
  │                                      │
  ├─ Commands                           ├─ MarkdownRenderable
  ├─ Window management                  ├─ 3 Themes
  └─ Auto-save                          ├─ File watching
                                        └─ Keyboard handling
```

## 🎨 Themes Preview

**GitHub Dark** - Clean and familiar  
**Monokai** - Classic and vibrant  
**Nord** - Beautiful Nordic palette  

Switch between them instantly with `T` key!

## 📝 Development

```bash
cd typescript

# Build
npm run build

# Watch mode
npm run dev

# Test
./test.sh
```

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Submit a PR

## 📄 License

[MIT License](./LICENSE)

## 🙏 Acknowledgments

Built with:
- [OpenTUI](https://github.com/anomalyco/opentui) - Terminal UI framework
- [marked](https://marked.js.org/) - Markdown parser
- [Bun](https://bun.sh/) - Fast JavaScript runtime
