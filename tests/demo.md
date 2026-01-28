# OpenTUI Markdown Demo

Welcome to the **MarkdownRenderable** showcase! This demonstrates automatic table alignment and syntax highlighting.

## Features

- Automatic **table column alignment** based on content width
- Proper handling of `inline code`, **bold**, and *italic* in tables
- Multiple syntax themes to choose from
- Conceal mode hides formatting markers

## Comparison Table

| Feature | Status | Priority | Notes |
|---|---|---|---|
| Table alignment | **Done** | High | Uses `marked` parser |
| Conceal mode | *Working* | Medium | Hides `**`, `` ` ``, etc. |
| Theme switching | **Done** | Low | 3 themes available |
| Unicode support | 日本語 | High | CJK characters |

## Code Examples

Here's how to use it:

```typescript
import { MarkdownRenderable } from "@opentui/core"

const md = new MarkdownRenderable(renderer, {
  content: "# Hello World",
  syntaxStyle: mySyntaxStyle,
  conceal: true, // Hide formatting markers
})
```

### API Reference

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `constructor` | `ctx, options` | `MarkdownRenderable` | Create new instance |
| `clearCache` | none | `void` | Force re-render content |

## Inline Formatting Examples

| Style | Syntax | Rendered |
|---|---|---|
| Bold | `**text**` | **bold text** |
| Italic | `*text*` | *italic text* |
| Code | `` `code` `` | `inline code` |
| Link | `[text](url)` | [OpenTUI](https://github.com) |

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

## Performance

The table alignment uses:
1. AST-based parsing with `marked`
2. Caching for repeated content
3. Smart width calculation accounting for concealed chars

---

## Keybindings Reference

### Theme & View
- **T** - Cycle through themes (GitHub Dark → Monokai → Nord)
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

- [OpenTUI GitHub](https://github.com/anomalyco/opentui)
- [Documentation](https://opentui.com/docs)
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

- [x] Implement MarkdownRenderable
- [x] Add syntax highlighting
- [x] Create theme system
- [ ] Add custom theme loading
- [ ] Implement search functionality

---

*This demo file showcases the capabilities of the mark.nvim markdown preview!*

**Try different themes with the `T` key!** 🎨
