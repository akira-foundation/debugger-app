import React from 'react'

interface SettingsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  isActive?: boolean
}

export function SettingsButton({
  children,
  variant = 'secondary',
  isActive = false,
  className,
  ...props
}: SettingsButtonProps) {
  const baseStyles = 'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer'

  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-purple-700 border border-purple-500 text-white shadow-lg shadow-purple-500/30',
    secondary: 'bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 text-purple-300 hover:from-purple-500/20 hover:to-purple-600/20 hover:border-purple-500/50',
  }

  const activeClass = isActive ? variants.primary : variants.secondary

  return (
    <button className={`${baseStyles} ${activeClass} ${className || ''}`} {...props}>
      {children}
    </button>
  )
}
