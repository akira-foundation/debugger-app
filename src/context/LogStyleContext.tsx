import { createContext, useContext, ReactNode } from 'react'

interface LogStyleContextType {
  borderClass: string
  textClass: string
}

const LogStyleContext = createContext<LogStyleContextType | undefined>(undefined)

interface LogStyleProviderProps {
  children: ReactNode
  borderClass: string
  textClass: string
}

export function LogStyleProvider({ children, borderClass, textClass }: LogStyleProviderProps) {
  return (
    <LogStyleContext.Provider value={{ borderClass, textClass }}>
      {children}
    </LogStyleContext.Provider>
  )
}

export function useLogStyle() {
  const context = useContext(LogStyleContext)
  if (!context) {
    return { borderClass: 'border-white/10', textClass: 'text-gray-400' }
  }
  return context
}
