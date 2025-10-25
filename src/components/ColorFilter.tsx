import { rayColors } from '../types'
import type { RayColor } from '../types'

interface ColorFilterProps {
  selectedColor: RayColor | null
  onSelectColor: (color: RayColor | null) => void
}

export function ColorFilter({ selectedColor, onSelectColor }: ColorFilterProps) {
  return (
    <div className="flex gap-3 px-6 py-3 bg-[#0f0f0f]/50 border-b border-white/5 overflow-x-auto items-center">
      <button
        onClick={() => onSelectColor(null)}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
          selectedColor === null
            ? 'bg-white/20 text-white'
            : 'bg-white/5 text-gray-400 hover:bg-white/10'
        }`}
      >
        All
      </button>
      <div className="flex gap-2 items-center">
        {Object.entries(rayColors)
          .filter(([color]) => color !== 'default')
          .map(([color, styles]) => (
            <button
              key={color}
              onClick={() => onSelectColor(color as RayColor)}
              className={`w-4 h-4 rounded-full transition-all flex-shrink-0 ${styles.bg} ${
                selectedColor === color ? 'ring-1 ring-white' : 'opacity-60 hover:opacity-100'
              }`}
              title={color}
            />
          ))}
      </div>
    </div>
  )
}
