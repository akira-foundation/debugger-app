import { useState, useEffect } from 'react'
import { getLogDisplayConfig, updateItemsPerLog } from '../../services/logDisplayConfigService'

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
    <div className="space-y-4 p-4 rounded-lg bg-white/5 border border-white/10">
      <h3 className="font-medium text-gray-200">Log Display</h3>

      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Items per log</label>
          <input
            type="number"
            min="1"
            max="100"
            value={itemsPerLog}
            onChange={(e) => handleItemsPerLogChange(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-gray-200 text-sm hover:border-white/30 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-colors"
          />
          <p className="text-xs text-gray-500">Number of items to display before showing "Load more" button</p>
        </div>

        {message && (
          <div className="px-4 py-3 rounded-lg border border-green-500/30 bg-green-500/10 text-green-400 text-sm animate-in fade-in duration-200">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
