-- Utility functions for mark.nvim
-- @module mark.utils

local M = {}

-- Get content of current buffer
function M.get_buffer_content(bufnr)
  bufnr = bufnr or vim.api.nvim_get_current_buf()
  local lines = vim.api.nvim_buf_get_lines(bufnr, 0, -1, false)
  return table.concat(lines, '\n')
end

-- Get cursor position
function M.get_cursor_position()
  local cursor = vim.api.nvim_win_get_cursor(0)
  return {
    line = cursor[1],
    col = cursor[2],
  }
end

-- Check if buffer is markdown
function M.is_markdown_buffer(bufnr)
  bufnr = bufnr or vim.api.nvim_get_current_buf()
  local filetype = vim.api.nvim_buf_get_option(bufnr, 'filetype')
  return filetype == 'markdown' or filetype == 'md'
end

-- Create split window
function M.create_split_window(position, size)
  local cmd
  if position == 'right' then
    cmd = 'vertical rightbelow new'
  elseif position == 'left' then
    cmd = 'vertical leftabove new'
  elseif position == 'top' then
    cmd = 'horizontal leftabove new'
  elseif position == 'bottom' then
    cmd = 'horizontal rightbelow new'
  else
    cmd = 'vertical rightbelow new'
  end
  
  vim.cmd(cmd)
  local win = vim.api.nvim_get_current_win()
  local buf = vim.api.nvim_create_buf(false, true)
  vim.api.nvim_win_set_buf(win, buf)
  
  -- Set window options
  vim.api.nvim_win_set_option(win, 'wrap', true)
  vim.api.nvim_win_set_option(win, 'number', false)
  vim.api.nvim_win_set_option(win, 'relativenumber', false)
  vim.api.nvim_win_set_option(win, 'cursorline', false)
  vim.api.nvim_win_set_option(win, 'conceallevel', 3)
  vim.api.nvim_win_set_option(win, 'concealcursor', 'nvic')
  
  -- Set buffer options
  vim.api.nvim_buf_set_option(buf, 'buftype', 'nofile')
  vim.api.nvim_buf_set_option(buf, 'bufhidden', 'wipe')
  vim.api.nvim_buf_set_option(buf, 'swapfile', false)
  vim.api.nvim_buf_set_option(buf, 'modifiable', true)
  vim.api.nvim_buf_set_option(buf, 'filetype', 'markdown-preview')
  vim.api.nvim_buf_set_name(buf, 'mark://preview')
  
  -- Add placeholder text
  vim.api.nvim_buf_set_lines(buf, 0, -1, false, {
    '',
    '  Loading markdown preview...',
    '',
  })
  
  -- Disable line wrapping initially
  vim.api.nvim_buf_set_option(buf, 'wrap', true)
  vim.api.nvim_buf_set_option(buf, 'linebreak', true)
  
  -- Resize window
  if position == 'right' or position == 'left' then
    local total_width = vim.o.columns
    local width = math.floor(total_width * size / 100)
    vim.api.nvim_win_set_width(win, width)
  else
    local total_height = vim.o.lines
    local height = math.floor(total_height * size / 100)
    vim.api.nvim_win_set_height(win, height)
  end
  
  return win, buf
end

-- Create floating window
function M.create_floating_window()
  local width = math.floor(vim.o.columns * 0.8)
  local height = math.floor(vim.o.lines * 0.8)
  local row = math.floor((vim.o.lines - height) / 2)
  local col = math.floor((vim.o.columns - width) / 2)
  
  local buf = vim.api.nvim_create_buf(false, true)
  local win = vim.api.nvim_open_win(buf, true, {
    relative = 'editor',
    width = width,
    height = height,
    row = row,
    col = col,
    style = 'minimal',
    border = 'rounded',
  })
  
  -- Set buffer options
  vim.api.nvim_buf_set_option(buf, 'buftype', 'nofile')
  vim.api.nvim_buf_set_option(buf, 'bufhidden', 'wipe')
  vim.api.nvim_buf_set_option(buf, 'swapfile', false)
  vim.api.nvim_buf_set_name(buf, 'mark://preview')
  
  return win, buf
end

-- Debug log (disabled to avoid spam)
function M.log(_msg, _level)
  -- Disabled - only log through vim.notify for actual errors
end

return M
