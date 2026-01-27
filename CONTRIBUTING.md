# Contributing to mark.nvim

Thank you for your interest in contributing to mark.nvim! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/mark.nvim
cd mark.nvim
```

### 2. Set Up Development Environment

```bash
# Install TypeScript dependencies
cd typescript
npm install
cd ..

# Install Lua testing tools (optional)
luarocks install busted
git clone https://github.com/nvim-lua/plenary.nvim ../plenary.nvim
```

### 3. Read the Guidelines

- [AGENTS.md](AGENTS.md) - Code style and conventions
- [TESTING.md](TESTING.md) - How to test your changes
- [README.md](README.md) - Project overview

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/my-new-feature
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

Follow the code style in [AGENTS.md](AGENTS.md):

**Lua:**
- 2 spaces indentation
- snake_case naming
- Single quotes for strings
- Use `vim.api.*` over `vim.fn.*`

**TypeScript:**
- 2 spaces indentation
- camelCase for variables/functions
- PascalCase for classes/types
- Always use semicolons
- Single quotes for strings

### 3. Test Your Changes

```bash
# TypeScript tests
cd typescript
npm test
npm run lint
npm run typecheck

# Lua tests
busted tests/

# Manual testing
nvim -u tests/minimal_init.vim tests/test_example.md
```

### 4. Commit Your Changes

Use conventional commit format:

```bash
git commit -m "feat: add new rendering mode"
git commit -m "fix: resolve scroll sync issue"
git commit -m "docs: update installation guide"
git commit -m "test: add parser tests"
git commit -m "refactor: improve renderer performance"
```

### 5. Push and Create PR

```bash
git push origin feature/my-new-feature
```

Then create a Pull Request on GitHub.

## Types of Contributions

### Bug Fixes

1. Check if issue already exists
2. Create issue if it doesn't
3. Reference issue in PR: "Fixes #123"
4. Include test case that reproduces bug
5. Verify fix works

### New Features

1. Open issue to discuss feature first
2. Wait for maintainer approval
3. Implement feature following style guide
4. Add tests for new functionality
5. Update documentation

### Documentation

1. Fix typos, improve clarity
2. Add examples
3. Update outdated information
4. Create tutorials/guides

### Tests

1. Add missing test coverage
2. Improve existing tests
3. Add integration tests
4. Performance benchmarks

## Pull Request Guidelines

### Before Submitting

- [ ] Tests pass (`npm test` and `busted tests/`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Manual testing done
- [ ] Documentation updated if needed
- [ ] Commit messages follow convention
- [ ] Branch is up to date with main

### PR Description

Include:
- What changed and why
- How to test the changes
- Screenshots/GIFs if UI changes
- Related issue numbers

Example:
```markdown
## Description
Adds support for rendering mermaid diagrams in code blocks.

## Changes
- Added mermaid parser in `typescript/src/parser.ts`
- Added diagram renderer in `typescript/src/renderer.ts`
- Updated config to enable/disable diagrams

## Testing
1. Create markdown file with mermaid code block
2. Run `:MarkPreview`
3. Verify diagram renders correctly

Fixes #42
```

### Review Process

1. Maintainer reviews code
2. CI/CD checks run automatically
3. Address review feedback
4. Maintainer merges when approved

## Project Structure

```
mark.nvim/
├── lua/mark/              # Neovim plugin (Lua)
│   ├── init.lua           # Main entry
│   ├── config.lua         # Configuration
│   ├── commands.lua       # User commands
│   ├── rpc.lua            # RPC client
│   └── utils.lua          # Utilities
├── typescript/            # Renderer (TypeScript)
│   └── src/
│       ├── main.ts        # Entry point
│       ├── renderer.ts    # Markdown renderer
│       ├── parser.ts      # Parser wrapper
│       ├── rpc-server.ts  # RPC server
│       ├── theme.ts       # Themes
│       └── types.ts       # Type definitions
├── tests/                 # Test files
├── doc/                   # Vim documentation
└── plugin/                # Auto-load entry
```

## Common Tasks

### Adding a New Render Type

1. Update `typescript/src/renderer.ts`:
   ```typescript
   private renderNewType(token: Tokens.NewType): string[] {
     // Your rendering logic
   }
   ```

2. Add to main render switch:
   ```typescript
   private renderToken(token: Token): string[] {
     if (parser.isNewType(token)) {
       return this.renderNewType(token);
     }
     // ...
   }
   ```

3. Add type guard in `parser.ts`:
   ```typescript
   export function isNewType(token: Token): token is Tokens.NewType {
     return token.type === 'newtype';
   }
   ```

4. Add tests:
   ```typescript
   it('should render new type', () => {
     const renderer = new MarkdownRenderer(defaultConfig);
     const markdown = '<!-- your test case -->';
     const parsed = parseMarkdown(markdown);
     const lines = renderer.render(parsed.tokens);
     expect(lines.some(line => line.includes('expected'))).toBe(true);
   });
   ```

### Adding a Configuration Option

1. Update `lua/mark/config.lua`:
   ```lua
   local DEFAULT_CONFIG = {
     -- ...
     new_option = true,
   }
   ```

2. Add validation if needed:
   ```lua
   local function validate_config(cfg)
     if cfg.new_option and type(cfg.new_option) ~= 'boolean' then
       return false, 'new_option must be a boolean'
     end
     return true
   end
   ```

3. Use in TypeScript:
   ```typescript
   interface Config {
     new_option: boolean;
   }
   ```

4. Document in `README.md` and `doc/mark.txt`

### Adding a Command

1. Add to `lua/mark/commands.lua`:
   ```lua
   function M.new_command()
     -- Implementation
   end
   ```

2. Register in `lua/mark/init.lua`:
   ```lua
   vim.api.nvim_create_user_command('MarkNewCommand', function()
     commands.new_command()
   end, { desc = 'Description' })
   ```

3. Document in `doc/mark.txt`

## Debugging Tips

### Lua Debugging

```lua
-- Enable debug mode
require('mark').setup({ debug = true })

-- Add debug prints
local utils = require('mark.utils')
utils.log('Debug message')

-- Check messages
:messages
```

### TypeScript Debugging

```typescript
// Add console.error (goes to Neovim :messages)
console.error('Debug:', someVariable);

// Test RPC manually
echo '{"jsonrpc":"2.0","id":1,"method":"test"}' | node dist/main.js
```

### Testing Locally

```bash
# Test without installing
nvim -u <(cat <<EOF
set rtp+=.
lua require('mark').setup({debug = true})
EOF
) tests/test_example.md
```

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues/PRs first

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
