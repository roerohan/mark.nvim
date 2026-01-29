#!/bin/bash
# Quick test script for mark.nvim
# Opens Neovim with mark.nvim loaded and a test markdown file

cd "$(dirname "$0")"

echo "Testing mark.nvim..."
echo "Commands available:"
echo "  :MarkPreview       - Open preview"
echo "  :MarkPreviewToggle - Toggle preview"
echo "  <leader>mp         - Toggle preview (keymap)"
echo ""

nvim -c "set rtp+=." \
     -c "lua require('mark').setup({ mappings = { toggle_preview = '<leader>mx' }})" \
     -c "MarkPreview" \
     tests/demo.md
