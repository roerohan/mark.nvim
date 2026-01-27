-- Main entry point for mark.nvim
-- @module mark

local M = {}

local config = require('mark.config')
local commands = require('mark.commands')

-- Setup plugin with user configuration
function M.setup(opts)
  opts = opts or {}
  
  -- Apply configuration
  if not config.setup(opts) then
    return
  end
  
  local cfg = config.get()
  
  -- Create user commands
  vim.api.nvim_create_user_command('MarkPreview', function()
    commands.start_preview()
  end, { desc = 'Start markdown preview' })
  
  vim.api.nvim_create_user_command('MarkPreviewStop', function()
    commands.stop_preview()
  end, { desc = 'Stop markdown preview' })
  
  vim.api.nvim_create_user_command('MarkPreviewToggle', function()
    commands.toggle_preview()
  end, { desc = 'Toggle markdown preview' })
  
  vim.api.nvim_create_user_command('MarkRefresh', function()
    commands.refresh_preview()
  end, { desc = 'Refresh markdown preview' })
  
  vim.api.nvim_create_user_command('MarkDebug', function()
    commands.debug_info()
  end, { desc = 'Show mark.nvim debug info' })
  
  -- Setup keybindings if configured
  if cfg.mappings and cfg.mappings.toggle_preview then
    vim.keymap.set('n', cfg.mappings.toggle_preview, commands.toggle_preview, { desc = 'Toggle markdown preview' })
  end
  
  -- Auto-start if configured
  if cfg.auto_start then
    vim.api.nvim_create_autocmd('FileType', {
      pattern = { 'markdown', 'md' },
      callback = function()
        commands.start_preview()
      end,
    })
  end
  
  -- Cleanup on exit
  vim.api.nvim_create_autocmd('VimLeavePre', {
    callback = function()
      commands.stop_preview()
    end,
  })
end

return M
