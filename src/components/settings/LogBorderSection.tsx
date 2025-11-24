import { useState, useEffect } from 'react'
import { rayColors } from '../../types'
import type { LogBorderMode, RayColor } from '../../types'
import { getLogBorderConfig, setLogBorderMode, setLogBorderUnifiedColor } from '../../services/logBorderConfigService'
import { SettingsCard } from './SettingsCard'

export function LogBorderSection() {
  const [mode, setMode] = useState<LogBorderMode>('multicolor')
  const [unifiedColor, setUnifiedColor] = useState<RayColor>('purple')

  useEffect(() => {
    const config = getLogBorderConfig()
    setMode(config.mode)
    if (config.unifiedColor) {
      setUnifiedColor(config.unifiedColor)
    }
  }, [])

  const handleModeChange = (newMode: LogBorderMode) => {
    setMode(newMode)
    setLogBorderMode(newMode)
  }

  const handleColorChange = (color: RayColor) => {
    setUnifiedColor(color)
    setLogBorderUnifiedColor(color)
  }

  return (
    <SettingsCard title="Log Border Style" subtitle="Customize the appearance of log entry borders">
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => handleModeChange('multicolor')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                mode === 'multicolor'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 border border-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 text-purple-300 hover:from-purple-500/20 hover:to-purple-600/20 hover:border-purple-500/50'
              }`}
            >
              Multicolor
            </button>
            <button
              onClick={() => handleModeChange('unified')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                mode === 'unified'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 border border-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 text-purple-300 hover:from-purple-500/20 hover:to-purple-600/20 hover:border-purple-500/50'
              }`}
            >
              Unified
            </button>
          </div>
        </div>

        {mode === 'unified' && (
          <div className="space-y-3 pt-3 border-t border-white/5">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">Select Color</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(rayColors)
                .filter(([color]) => color !== 'default')
                .map(([color, styles]) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color as RayColor)}
                    className={`w-5 h-5 rounded-md cursor-pointer outline-none ${styles.bg} ${
                      unifiedColor === color ? 'ring-2 ring-white' : 'opacity-50'
                    }`}
                    title={color}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </SettingsCard>
  )
}
