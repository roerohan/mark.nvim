-- User commands for mark.nvim (OpenTUI version)
-- @module mark.commands

local M = {}
local config = require('mark.config')
local utils = require('mark.utils')

local state = {
  preview_win = nil,
  preview_buf = nil,
  terminal_job_id = nil,
  source_buf = nil,
  mode = 'preview',
}

-- Debug function to check paths
function M.debug_info()
  local plugin_dir = vim.fn.fnamemodify(debug.getinfo(1).source:sub(2), ':h:h:h')
  local app_script = plugin_dir .. '/typescript/dist/main.js'
  
  print('=== mark.nvim Debug Info ===')
  print('Plugin directory: ' .. plugin_dir)
  print('App script path: ' .. app_script)
  print('App script exists: ' .. tostring(vim.fn.filereadable(app_script) == 1))
  
  if vim.fn.filereadable(app_script) == 1 then
    local timestamp = vim.fn.getftime(app_script)
    print('App script timestamp: ' .. os.date('%Y-%m-%d %H:%M:%S', timestamp))
    print('Using new MarkdownRenderable version (v5.0)')
  end
  
  print('Bun available: ' .. tostring(vim.fn.executable('bun') == 1))
  print('===========================')
end

-- Start preview mode with OpenTUI
function M.start_preview()
  if not utils.is_markdown_buffer() then
    vim.notify('mark.nvim: Not a markdown buffer', vim.log.levels.WARN)
    return
  end
  
  if state.preview_win and vim.api.nvim_win_is_valid(state.preview_win) then
    vim.notify('mark.nvim: Preview already active', vim.log.levels.INFO)
    return
  end
  
  -- Check if bun is available
  if vim.fn.executable('bun') == 0 then
    vim.notify('mark.nvim: Bun runtime not found. Please install Bun from https://bun.sh', vim.log.levels.ERROR)
    return
  end
  
  -- Get the markdown file path
  local file_path = vim.api.nvim_buf_get_name(0)
  if file_path == '' then
    vim.notify('mark.nvim: Buffer has no file path', vim.log.levels.ERROR)
    return
  end
  
  -- Find the OpenTUI app script
  local plugin_dir = vim.fn.fnamemodify(debug.getinfo(1).source:sub(2), ':h:h:h')
  local app_script = plugin_dir .. '/typescript/dist/main.js'
  
  -- Debug: Log the path being used
  utils.log('Using app script: ' .. app_script)
  utils.log('App timestamp: ' .. os.date('%Y-%m-%d %H:%M:%S', vim.fn.getftime(app_script)))
  
  if vim.fn.filereadable(app_script) == 0 then
    vim.notify('mark.nvim: OpenTUI app not found at: ' .. app_script, vim.log.levels.ERROR)
    vim.notify('mark.nvim: Please run: cd ' .. plugin_dir .. '/typescript && bun install && bun run build', vim.log.levels.ERROR)
    return
  end
  
  -- Save current state
  local source_win = vim.api.nvim_get_current_win()
  state.source_buf = vim.api.nvim_get_current_buf()
  
  -- Create split window
  local cfg = config.get()
  local split_cmd
  if cfg.split_position == 'right' then
    split_cmd = 'rightbelow vsplit'
  elseif cfg.split_position == 'left' then
    split_cmd = 'leftabove vsplit'
  elseif cfg.split_position == 'top' then
    split_cmd = 'leftabove split'
  else
    split_cmd = 'rightbelow split'
  end
  
  vim.cmd(split_cmd)
  
  -- Get the new window and set its size
  local preview_win = vim.api.nvim_get_current_win()
  if cfg.split_position == 'right' or cfg.split_position == 'left' then
    local total_width = vim.o.columns
    local preview_width = math.floor(total_width * cfg.split_size / 100)
    vim.api.nvim_win_set_width(preview_win, preview_width)
  else
    local total_height = vim.o.lines
    local preview_height = math.floor(total_height * cfg.split_size / 100)
    vim.api.nvim_win_set_height(preview_win, preview_height)
  end
  
  -- Open terminal with OpenTUI app
  local terminal_buf = vim.api.nvim_create_buf(false, true)
  vim.api.nvim_win_set_buf(preview_win, terminal_buf)
  
  -- Start the OpenTUI app in the terminal
  local job_id = vim.fn.termopen(
    string.format('bun %s %s', vim.fn.shellescape(app_script), vim.fn.shellescape(file_path)),
    {
      on_exit = function(_, exit_code)
        utils.log('OpenTUI app exited with code: ' .. exit_code)
        state.terminal_job_id = nil
        -- Auto-close preview if app exits
        if state.preview_win and vim.api.nvim_win_is_valid(state.preview_win) then
          vim.schedule(function()
            M.stop_preview()
          end)
        end
      end,
    }
  )
  
  if job_id <= 0 then
    vim.notify('mark.nvim: Failed to start OpenTUI app', vim.log.levels.ERROR)
    vim.api.nvim_win_close(preview_win, true)
    return
  end
  
  state.preview_win = preview_win
  state.preview_buf = terminal_buf
  state.terminal_job_id = job_id
  state.mode = 'preview'
  
  -- Set buffer options
  vim.api.nvim_buf_set_option(terminal_buf, 'bufhidden', 'wipe')
  vim.api.nvim_buf_set_option(terminal_buf, 'buflisted', false)
  vim.api.nvim_buf_set_name(terminal_buf, 'mark://preview')
  
  -- Return focus to source window
  vim.api.nvim_set_current_win(source_win)
  
  -- Setup autocommands
  M._setup_autocommands()
  
  utils.log('Preview started with OpenTUI')
  vim.notify('mark.nvim: Preview started. File changes will auto-reload.', vim.log.levels.INFO)
end

-- Stop preview mode
function M.stop_preview()
  if state.terminal_job_id then
    -- Send Ctrl+C to the terminal to gracefully exit OpenTUI
    vim.fn.jobstop(state.terminal_job_id)
    state.terminal_job_id = nil
  end
  
  if state.preview_win and vim.api.nvim_win_is_valid(state.preview_win) then
    vim.api.nvim_win_close(state.preview_win, true)
  end
  
  state.preview_win = nil
  state.preview_buf = nil
  state.source_buf = nil
  
  -- Clear autocommands
  pcall(vim.api.nvim_clear_autocmds, { group = 'MarkNvim' })
  
  utils.log('Preview stopped')
end

-- Toggle preview mode
function M.toggle_preview()
  if state.preview_win and vim.api.nvim_win_is_valid(state.preview_win) then
    M.stop_preview()
  else
    M.start_preview()
  end
end

-- Refresh preview by sending signal to OpenTUI app
function M.refresh_preview()
  -- The OpenTUI app watches the file automatically
  -- Just save the buffer to trigger a refresh
  if state.source_buf and vim.api.nvim_buf_is_valid(state.source_buf) then
    vim.cmd('silent write')
    vim.notify('mark.nvim: Preview refreshed', vim.log.levels.INFO)
  end
end

-- Setup autocommands for auto-save on changes
function M._setup_autocommands()
  local group = vim.api.nvim_create_augroup('MarkNvim', { clear = true })
  
  -- Auto-save on text change (debounced) to trigger file watcher
  local timer = vim.loop.new_timer()
  local pending = false
  
  vim.api.nvim_create_autocmd({ 'TextChanged', 'TextChangedI' }, {
    group = group,
    buffer = state.source_buf,
    callback = function()
      if pending then return end
      pending = true
      
      timer:start(500, 0, vim.schedule_wrap(function()
        pending = false
        if vim.api.nvim_buf_is_valid(state.source_buf) then
          -- Auto-save to trigger OpenTUI reload
          vim.cmd('silent write')
        end
      end))
    end,
  })
  
  -- Cleanup on buffer unload
  vim.api.nvim_create_autocmd('BufUnload', {
    group = group,
    buffer = state.source_buf,
    callback = function()
      if timer then
        timer:stop()
        timer:close()
      end
      M.stop_preview()
    end,
  })
  
  -- Handle preview window close
  vim.api.nvim_create_autocmd('WinClosed', {
    group = group,
    pattern = '*',
    callback = function(ev)
      local closed_win = tonumber(ev.match)
      if closed_win == state.preview_win then
        M.stop_preview()
      end
    end,
  })
end

return M
