# mark.nvim Demo

Welcome to **mark.nvim** - a beautiful terminal-based markdown preview for Neovim! This demo showcases automatic table alignment, syntax highlighting, and live rendering.

## Features

- 🎨 **Beautiful themes** - GitHub Dark, Monokai, Nord, and Orng
- 📊 **Full markdown support** - Tables with automatic alignment
- 🔤 **Syntax highlighting** - Tree-sitter powered code blocks
- 👁️ **Conceal mode** - Hide formatting markers like `**`, `*`, `` ` ``
- 🚀 **Live preview** - Updates as you type in Neovim
- 💻 **Terminal native** - No browser required, works everywhere

## Comparison Table

| Feature | Status | Priority | Notes |
|---|---|---|---|
| Table alignment | **Done** | High | Automatic column width |
| Conceal mode | **Done** | Medium | Hides `**`, `` ` ``, etc. |
| Theme switching | **Done** | High | 4 beautiful themes |
| Live preview | **Done** | High | Updates as you type |
| Unicode support | 日本語 | High | CJK characters |

## Installation & Usage

Quick setup with your favorite plugin manager:

```lua
-- lazy.nvim
{
  'roerohan/mark.nvim',
  ft = 'markdown',
  build = 'cd typescript && bun install && bun run build',
  config = function()
    require('mark').setup({
      theme = 'Orng',        -- Default theme: 'GitHub Dark', 'Monokai', 'Nord', 'Orng'
      split_position = 'right',
      split_size = 50,
      auto_start = false,
    })
  end,
}
```

### Commands

| Command | Description |
|---|---|
| `:MarkPreview` | Start the preview |
| `:MarkPreviewStop` | Stop the preview |
| `:MarkPreviewToggle` | Toggle preview on/off |

## Inline Formatting Examples

| Style | Syntax | Rendered |
|---|---|---|
| Bold | `**text**` | **bold text** |
| Italic | `*text*` | *italic text* |
| Code | `` `code` `` | `inline code` |
| Link | `[text](url)` | [mark.nvim](https://github.com/roerohan/mark.nvim) |

## Mixed Content

> **Note**: This blockquote contains **bold** and `code` formatting.
> It should render correctly with proper styling.

### Emoji Support

| Emoji | Name | Category |
|---|---|---|
| 🚀 | Rocket | Transport |
| 🎨 | Palette | Art |
| ⚡ | Lightning | Nature |
| 🔥 | Fire | Nature |

---

## Alignment Examples

| Left | Center | Right |
|:---|:---:|---:|
| L1 | C1 | R1 |
| Left aligned | Centered text | Right aligned |
| Short | Medium length | Longer content here |

## How It Works

mark.nvim combines:
1. **Neovim (Lua)** - Plugin integration, window management, auto-save
2. **OpenTUI (TypeScript)** - Terminal UI framework with markdown rendering
3. **Bun runtime** - Fast JavaScript execution
4. **File watching** - Auto-reload on changes

---

## Keybindings Reference

### Theme & View
- **T** - Cycle through themes (GitHub Dark → Monokai → Nord → Orng)
- **C** - Toggle concealment (hide/show `**`, `*`, `` ` ``, etc.)
- **R** - Reload file from disk

### Streaming Mode
- **S** - Start/restart streaming simulation
- **E** - Toggle endless mode (repeats content forever)
- **X** - Stop streaming
- **[** - Decrease speed (slower)
- **]** - Increase speed (faster)

### Navigation
- **?** - Toggle help screen
- **ESC** - Exit application
- **Arrow keys** - Scroll content

---

## Additional Markdown Elements

### Lists

#### Unordered Lists
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

#### Ordered Lists
1. First step
2. Second step
3. Third step
   1. Sub-step A
   2. Sub-step B
4. Fourth step

### Code Blocks

#### JavaScript
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('World'));
```

#### Python
```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

#### Bash
```bash
#!/bin/bash
echo "Building project..."
npm run build
echo "Done!"
```

### Headings Hierarchy

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

### Text Formatting

Regular text with **bold**, *italic*, ***bold and italic***, ~~strikethrough~~, and `inline code`.

### Links

- [mark.nvim GitHub](https://github.com/roerohan/mark.nvim)
- [OpenTUI Framework](https://github.com/anomalyco/opentui) - Powers the terminal rendering
- [Markdown Guide](https://www.markdownguide.org/)

### Images (Markdown Syntax)

![Alt text](https://via.placeholder.com/150)

### Horizontal Rules

---

***

___

### Blockquotes

> This is a simple blockquote.

> This is a blockquote
> that spans multiple lines
> and contains **formatting**.

> Nested blockquotes:
> > Level 2
> > > Level 3

### Task Lists

- [x] Terminal-based markdown preview
- [x] Live update on file changes
- [x] Beautiful syntax highlighting
- [x] Theme switching (3 themes)
- [x] Conceal mode for clean reading
- [ ] Custom theme loading from config
- [ ] Search functionality
- [ ] Split view mode

---

*This demo file showcases the capabilities of the mark.nvim markdown preview!*

**Try different themes with the `T` key!** 🎨
