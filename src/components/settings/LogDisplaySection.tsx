import { useState, useEffect } from 'react'
import { getLogDisplayConfig, updateItemsPerLog } from '../../services/logDisplayConfigService'
import { SettingsCard } from './SettingsCard'

export function LogDisplaySection() {
  const [itemsPerLog, setItemsPerLog] = useState(10)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const config = getLogDisplayConfig()
    setItemsPerLog(config.itemsPerLog)
  }, [])

  const handleItemsPerLogChange = (value: number) => {
    if (value >= 1 && value <= 100) {
      setItemsPerLog(value)
      updateItemsPerLog(value)
      setMessage(`Items per log changed to ${value}`)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <SettingsCard title="Log Display" subtitle="Configure how log items are displayed in the interface">
      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Items per log</label>
          <input
            type="number"
            min="1"
            max="100"
            value={itemsPerLog}
            onChange={(e) => handleItemsPerLogChange(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/20 text-gray-200 text-sm hover:border-white/30 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-colors [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <p className="text-xs text-gray-500">Number of items to display before showing "Load more" button</p>
        </div>

        {message && (
          <div className="px-4 py-3 rounded-lg border border-green-500/30 bg-green-500/10 text-green-400 text-sm animate-in fade-in duration-200">
            {message}
          </div>
        )}
      </div>
    </SettingsCard>
  )
}
