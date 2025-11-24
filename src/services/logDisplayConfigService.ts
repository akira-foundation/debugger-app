const LOG_DISPLAY_CONFIG_KEY = 'log_display_config'

interface LogDisplayConfig {
  itemsPerLog: number
}

const DEFAULT_CONFIG: LogDisplayConfig = {
  itemsPerLog: 10,
}

export function getLogDisplayConfig(): LogDisplayConfig {
  try {
    const stored = localStorage.getItem(LOG_DISPLAY_CONFIG_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load log display config:', e)
  }
  return DEFAULT_CONFIG
}

export function setLogDisplayConfig(config: LogDisplayConfig): void {
  try {
    localStorage.setItem(LOG_DISPLAY_CONFIG_KEY, JSON.stringify(config))
  } catch (e) {
    console.error('Failed to save log display config:', e)
  }
}

export function updateItemsPerLog(itemsPerLog: number): void {
  const config = getLogDisplayConfig()
  setLogDisplayConfig({ ...config, itemsPerLog })
}
