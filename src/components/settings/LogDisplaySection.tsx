import { useState } from 'react'
import { z } from 'zod'
import { useLogDisplayStore, LogDisplayConfigSchema } from '../../stores/logDisplayStore'
import { SettingsCard } from './SettingsCard'

export function LogDisplaySection() {
  const config = useLogDisplayStore((state) => state.config)
  const setItemsPerLog = useLogDisplayStore((state) => state.setItemsPerLog)
  const setMaxHeight = useLogDisplayStore((state) => state.setMaxHeight)

  const [itemsPerLogInput, setItemsPerLogInput] = useState(String(config.itemsPerLog))
  const [maxHeightInput, setMaxHeightInput] = useState(String(config.maxHeight))
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateAndSave = (value: string, field: 'itemsPerLog' | 'maxHeight') => {
    setError(null)
    setMessage(null)

    if (!value.trim()) {
      setError('Value cannot be empty')
      return
    }

    try {
      const num = parseInt(value, 10)
      if (isNaN(num)) {
        setError('Must be a valid number')
        return
      }

      const schema = LogDisplayConfigSchema.pick({ [field]: true })
      schema.parse({ [field]: num })

      if (field === 'itemsPerLog') {
        setItemsPerLog(num)
        setMessage(`Items per log changed to ${num}`)
      } else {
        setMaxHeight(num)
        setMessage(`Max height changed to ${num}px`)
      }
      setTimeout(() => setMessage(null), 3000)
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message)
      } else {
        setError('Invalid input')
      }
    }
  }

  const handleItemsPerLogBlur = () => {
    if (itemsPerLogInput !== String(config.itemsPerLog)) {
      validateAndSave(itemsPerLogInput, 'itemsPerLog')
    }
  }

  const handleMaxHeightBlur = () => {
    if (maxHeightInput !== String(config.maxHeight)) {
      validateAndSave(maxHeightInput, 'maxHeight')
    }
  }

  return (
    <SettingsCard title="Log Display" subtitle="Configure how log items are displayed in the interface">
      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Items per log</label>
          <input
            type="text"
            value={itemsPerLogInput}
            onChange={(e) => setItemsPerLogInput(e.target.value)}
            onBlur={handleItemsPerLogBlur}
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/20 text-gray-200 text-sm hover:border-white/30 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-colors"
          />
          <p className="text-xs text-gray-500">Number of items to display before showing "Load more" button (1-100)</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">Log content max height</label>
          <input
            type="text"
            value={maxHeightInput}
            onChange={(e) => setMaxHeightInput(e.target.value)}
            onBlur={handleMaxHeightBlur}
            className="w-full px-3 py-2 rounded bg-white/5 border border-white/20 text-gray-200 text-sm hover:border-white/30 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-colors"
          />
          <p className="text-xs text-gray-500">Maximum height in pixels before showing expand button (100-1000)</p>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm animate-in fade-in duration-200">
            {error}
          </div>
        )}

        {message && (
          <div className="px-4 py-3 rounded-lg border border-green-500/30 bg-green-500/10 text-green-400 text-sm animate-in fade-in duration-200">
            {message}
          </div>
        )}
      </div>
    </SettingsCard>
  )
}
