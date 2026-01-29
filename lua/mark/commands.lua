-- User commands for mark.nvim (OpenTUI version)
-- @module mark.commands

local M = {}
local config = require('mark.config')
local utils = require('mark.utils')

-- State management
local state = {
  preview_win = nil,
  preview_buf = nil,
  terminal_job_id = nil,
  source_buf = nil,
  mode = 'preview',
  stopping = false,
  stopped_job_ids = {},
}

-- Exit code constants
local EXIT_CODE = {
  CLEAN = 0,
  SIGTERM = 143,
  SIGTERM_ALT = 15,
}

-- Private helper functions

local function is_sigterm(exit_code)
  return exit_code == EXIT_CODE.SIGTERM or exit_code == EXIT_CODE.SIGTERM_ALT
end

local function get_plugin_paths()
  local plugin_dir = vim.fn.fnamemodify(debug.getinfo(2).source:sub(2), ':h:h:h')
  local app_script = plugin_dir .. '/typescript/dist/main.js'
  return plugin_dir, app_script
end

local function validate_environment()
  if vim.fn.executable('bun') == 0 then
    vim.notify(
      'mark.nvim: Bun runtime not found. Please install Bun from https://bun.sh',
      vim.log.levels.ERROR
    )
    return false
  end
  return true
end

local function validate_file(file_path)
  if file_path == '' then
    vim.notify(
      'mark.nvim: Buffer has no file path. Please save the file first (:w)',
      vim.log.levels.ERROR
    )
    return false
  end

  if vim.fn.filereadable(file_path) == 0 then
    vim.notify(
      'mark.nvim: File does not exist on disk. Please save the file first (:w)',
      vim.log.levels.ERROR
    )
    return false
  end

  return true
end

local function validate_app_script(app_script, plugin_dir)
  if vim.fn.filereadable(app_script) == 0 then
    vim.notify('mark.nvim: OpenTUI app not found at: ' .. app_script, vim.log.levels.ERROR)
    vim.notify(
      'mark.nvim: Please run: cd ' .. plugin_dir .. '/typescript && bun install && bun run build',
      vim.log.levels.ERROR
    )
    return false
  end
  return true
end

local function get_split_command(position)
  local commands = {
    right = 'rightbelow vsplit',
    left = 'leftabove vsplit',
    top = 'leftabove split',
    bottom = 'rightbelow split',
  }
  return commands[position] or commands.right
end

local function resize_window(win, position, size)
  if position == 'right' or position == 'left' then
    local total_width = vim.o.columns
    local preview_width = math.floor(total_width * size / 100)
    vim.api.nvim_win_set_width(win, preview_width)
  else
    local total_height = vim.o.lines
    local preview_height = math.floor(total_height * size / 100)
    vim.api.nvim_win_set_height(win, preview_height)
  end
end

local function create_preview_window(cfg)
  local split_cmd = get_split_command(cfg.split_position)
  vim.cmd(split_cmd)

  local preview_win = vim.api.nvim_get_current_win()
  resize_window(preview_win, cfg.split_position, cfg.split_size)

  return preview_win
end

local function setup_terminal_buffer(preview_win)
  local terminal_buf = vim.api.nvim_create_buf(false, true)
  vim.api.nvim_win_set_buf(preview_win, terminal_buf)

  -- Set buffer options
  vim.api.nvim_buf_set_option(terminal_buf, 'bufhidden', 'wipe')
  vim.api.nvim_buf_set_option(terminal_buf, 'buflisted', false)
  vim.api.nvim_buf_set_name(terminal_buf, 'mark://preview')

  return terminal_buf
end

local function setup_window_options(preview_win)
  vim.api.nvim_win_set_option(preview_win, 'number', false)
  vim.api.nvim_win_set_option(preview_win, 'relativenumber', false)
  vim.api.nvim_win_set_option(preview_win, 'signcolumn', 'no')
end

local function build_terminal_command(app_script, file_path, theme)
  local escaped_app = vim.fn.shellescape(app_script)
  local escaped_file = vim.fn.shellescape(file_path)

  if theme and theme ~= '' then
    local escaped_theme = vim.fn.shellescape(theme)
    return string.format('bun %s %s %s', escaped_app, escaped_file, escaped_theme)
  else
    return string.format('bun %s %s', escaped_app, escaped_file)
  end
end

local function handle_job_exit(job_id_exit, exit_code)
  -- Ignore exit callbacks for jobs we intentionally stopped
  if state.stopped_job_ids[job_id_exit] then
    state.stopped_job_ids[job_id_exit] = nil
    print(string.format('[mark.nvim] Ignoring exit for stopped job %d', job_id_exit))
    return
  end

  -- Don't handle exit if we're currently stopping (prevents recursion)
  if state.stopping then
    return
  end

  state.terminal_job_id = nil

  -- Log exit based on exit code
  if exit_code == EXIT_CODE.CLEAN then
    print('[mark.nvim] Preview closed by user')
  elseif is_sigterm(exit_code) then
    print('[mark.nvim] Preview stopped')
  else
    vim.schedule(function()
      local msg = string.format(
        '[mark.nvim] Preview crashed with exit code: %d. Check :messages for details.',
        exit_code
      )
      vim.notify(msg, vim.log.levels.ERROR)
    end)
  end

  -- Cleanup the preview window
  vim.schedule(function()
    if state.preview_win and vim.api.nvim_win_is_valid(state.preview_win) then
      M.stop_preview()
    end
  end)
end

local function cleanup_state()
  state.preview_win = nil
  state.preview_buf = nil
  state.source_buf = nil
end

-- Public API functions

function M.debug_info()
  local plugin_dir, app_script = get_plugin_paths()

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

function M.start_preview()
  -- Early validation checks
  if not utils.is_markdown_buffer() then
    vim.notify('mark.nvim: Not a markdown buffer', vim.log.levels.WARN)
    return
  end

  if state.preview_win and vim.api.nvim_win_is_valid(state.preview_win) then
    vim.notify('mark.nvim: Preview already active', vim.log.levels.INFO)
    return
  end

  -- Clear stopping flag when starting new preview
  state.stopping = false

  -- Validate environment
  if not validate_environment() then
    return
  end

  -- Validate file
  local file_path = vim.api.nvim_buf_get_name(0)
  if not validate_file(file_path) then
    return
  end

  -- Validate app script
  local plugin_dir, app_script = get_plugin_paths()
  if not validate_app_script(app_script, plugin_dir) then
    return
  end

  -- Save current state
  local source_win = vim.api.nvim_get_current_win()
  state.source_buf = vim.api.nvim_get_current_buf()

  -- Create and configure preview window
  local cfg = config.get()
  local preview_win = create_preview_window(cfg)
  local terminal_buf = setup_terminal_buffer(preview_win)
  setup_window_options(preview_win)

  -- Start terminal with OpenTUI app
  local cmd = build_terminal_command(app_script, file_path, cfg.theme)
  local job_id = vim.fn.termopen(cmd, { on_exit = handle_job_exit })

  if job_id <= 0 then
    vim.notify('mark.nvim: Failed to start OpenTUI app', vim.log.levels.ERROR)
    vim.api.nvim_win_close(preview_win, true)
    return
  end

  -- Update state
  state.preview_win = preview_win
  state.preview_buf = terminal_buf
  state.terminal_job_id = job_id
  state.mode = 'preview'

  -- Return focus to source window
  vim.api.nvim_set_current_win(source_win)

  -- Setup autocommands
  M._setup_autocommands()

  vim.notify('mark.nvim: Preview started. File changes will auto-reload.', vim.log.levels.INFO)
end

function M.stop_preview()
  -- Prevent recursive calls
  if state.stopping then
    return
  end
  state.stopping = true

  -- Stop terminal job
  if state.terminal_job_id then
    state.stopped_job_ids[state.terminal_job_id] = true
    pcall(vim.fn.jobstop, state.terminal_job_id)
    state.terminal_job_id = nil
  end

  -- Close preview window
  if state.preview_win and vim.api.nvim_win_is_valid(state.preview_win) then
    pcall(vim.api.nvim_win_close, state.preview_win, true)
  end

  -- Clear state
  cleanup_state()

  -- Clear autocommands
  pcall(vim.api.nvim_clear_autocmds, { group = 'MarkNvim' })

  -- Reset stopping flag after delay
  vim.defer_fn(function()
    state.stopping = false
  end, 200)
end

function M.toggle_preview()
  if state.preview_win and vim.api.nvim_win_is_valid(state.preview_win) then
    M.stop_preview()
  else
    M.start_preview()
  end
end

function M.refresh_preview()
  if state.source_buf and vim.api.nvim_buf_is_valid(state.source_buf) then
    vim.cmd('silent write')
    vim.notify('mark.nvim: Preview refreshed', vim.log.levels.INFO)
  end
end

function M._setup_autocommands()
  local group = vim.api.nvim_create_augroup('MarkNvim', { clear = true })
  local timer = vim.loop.new_timer()
  local pending = false

  -- Auto-save on text change (debounced)
  vim.api.nvim_create_autocmd({ 'TextChanged', 'TextChangedI' }, {
    group = group,
    buffer = state.source_buf,
    callback = function()
      if pending then return end
      pending = true

      timer:start(500, 0, vim.schedule_wrap(function()
        pending = false
        if vim.api.nvim_buf_is_valid(state.source_buf) then
          pcall(vim.cmd, 'silent write')
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

  -- Auto-enter insert mode when focusing preview window
  vim.api.nvim_create_autocmd('WinEnter', {
    group = group,
    pattern = '*',
    callback = function()
      local current_win = vim.api.nvim_get_current_win()
      if current_win == state.preview_win then
        vim.cmd('startinsert')
      end
    end,
  })
end

return M
