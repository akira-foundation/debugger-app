import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'

export const LogDisplayConfigSchema = z.object({
  itemsPerLog: z.number().int().min(1).max(100),
  maxHeight: z.number().int().min(100).max(1000),
})

export type LogDisplayConfig = z.infer<typeof LogDisplayConfigSchema>

interface LogDisplayStore {
  config: LogDisplayConfig
  setItemsPerLog: (value: number) => void
  setMaxHeight: (value: number) => void
}

export const useLogDisplayStore = create<LogDisplayStore>()(
  persist(
    (set) => ({
      config: {
        itemsPerLog: 10,
        maxHeight: 200,
      },
      setItemsPerLog: (value: number) => {
        try {
          LogDisplayConfigSchema.pick({ itemsPerLog: true }).parse({ itemsPerLog: value })
          set((state) => ({
            config: { ...state.config, itemsPerLog: value },
          }))
        } catch (e) {
          console.error('Invalid itemsPerLog value:', e)
        }
      },
      setMaxHeight: (value: number) => {
        try {
          LogDisplayConfigSchema.pick({ maxHeight: true }).parse({ maxHeight: value })
          set((state) => ({
            config: { ...state.config, maxHeight: value },
          }))
        } catch (e) {
          console.error('Invalid maxHeight value:', e)
        }
      },
    }),
    {
      name: 'log-display-config',
    },
  ),
)
