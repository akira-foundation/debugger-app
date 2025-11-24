import { createContext, useContext, ReactNode, useState } from 'react'

interface FilterContextType {
  selectedColor: string | null
  selectedLogTypes: Set<string>
  searchQuery: string
  setSelectedColor: (color: string | null) => void
  setSelectedLogTypes: (types: Set<string>) => void
  setSearchQuery: (query: string) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

interface FilterProviderProps {
  children: ReactNode
}

export function FilterProvider({ children }: FilterProviderProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedLogTypes, setSelectedLogTypes] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <FilterContext.Provider
      value={{
        selectedColor,
        selectedLogTypes,
        searchQuery,
        setSelectedColor,
        setSelectedLogTypes,
        setSearchQuery,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider')
  }
  return context
}
