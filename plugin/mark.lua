-- Auto-load entry point for mark.nvim
-- This file is automatically loaded by Neovim

if vim.g.loaded_mark_nvim then
  return
end
vim.g.loaded_mark_nvim = 1

-- Check Neovim version
if vim.fn.has('nvim-0.9.0') == 0 then
  vim.notify('mark.nvim requires Neovim >= 0.9.0', vim.log.levels.ERROR)
  return
end

-- Plugin will be setup by user calling require('mark').setup()
