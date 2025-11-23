import type { LogBorderConfig, LogBorderMode, RayColor } from '../types'

const STORAGE_KEY = 'akira_log_border_config'

const defaultConfig: LogBorderConfig = {
  mode: 'multicolor',
  unifiedColor: 'purple',
}

export function getLogBorderConfig(): LogBorderConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load log border config:', error)
  }
  return defaultConfig
}

export function setLogBorderMode(mode: LogBorderMode): void {
  try {
    const config = getLogBorderConfig()
    config.mode = mode
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch (error) {
    console.error('Failed to save log border mode:', error)
  }
}

export function setLogBorderUnifiedColor(color: RayColor): void {
  try {
    const config = getLogBorderConfig()
    config.unifiedColor = color
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch (error) {
    console.error('Failed to save log border color:', error)
  }
}
