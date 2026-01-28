-- Configuration management for mark.nvim
-- @module mark.config

local M = {}

-- Default configuration
local DEFAULT_CONFIG = {
  -- General settings
  auto_start = false,
  update_delay = 100,
  
  -- Window settings
  split_position = 'right',
  split_size = 50,
  use_floating = false,
  
  -- Rendering settings
  theme = 'GitHub Dark', -- Available: 'GitHub Dark', 'Monokai', 'Nord', 'Orng'
  font_size = 'medium',
  show_line_numbers = false,
  
  -- Keybindings
  mappings = {
    toggle_preview = '<leader>mp',
    toggle_wysiwyg = '<leader>mw',
    sync_scroll = '<leader>ms',
  },
  
  -- Markdown features
  enable_tables = true,
  enable_code_blocks = true,
  enable_images = true,
  enable_links = true,
  syntax_highlight = true,
  
  -- Debug
  debug = false,
}

-- Current configuration
local config = vim.deepcopy(DEFAULT_CONFIG)

-- Valid theme names
local VALID_THEMES = {'GitHub Dark', 'Monokai', 'Nord', 'Orng'}

-- Validate configuration
local function validate_config(cfg)
  if cfg.update_delay and type(cfg.update_delay) ~= 'number' then
    return false, 'update_delay must be a number'
  end
  
  if cfg.split_position and not vim.tbl_contains({'right', 'left', 'top', 'bottom'}, cfg.split_position) then
    return false, 'split_position must be one of: right, left, top, bottom'
  end
  
  if cfg.split_size and (type(cfg.split_size) ~= 'number' or cfg.split_size < 1 or cfg.split_size > 100) then
    return false, 'split_size must be a number between 1 and 100'
  end
  
  if cfg.theme and not vim.tbl_contains(VALID_THEMES, cfg.theme) then
    return false, 'theme must be one of: ' .. table.concat(VALID_THEMES, ', ')
  end
  
  return true
end

-- Setup configuration with user options
function M.setup(opts)
  opts = opts or {}
  
  local ok, err = validate_config(opts)
  if not ok then
    vim.notify('mark.nvim: ' .. err, vim.log.levels.ERROR)
    return false
  end
  
  config = vim.tbl_deep_extend('force', config, opts)
  return true
end

-- Get current configuration
function M.get()
  return config
end

-- Get default configuration
function M.get_default()
  return vim.deepcopy(DEFAULT_CONFIG)
end

return M
