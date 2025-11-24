interface SettingsCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function SettingsCard({ title, subtitle, children }: SettingsCardProps) {
  return (
    <div className="glass card r border border-white/10 backdrop-blur-lg overflow-hidden">
      <div className="">
        <h3 className="font-medium text-gray-200 px-3 pt-2">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5 px-3 pb-0.5">{subtitle}</p>}
      </div>

      <div className="mb-0.5 mx-0.5">
        <div className="glass card p-3  border border-white/10 backdrop-blur-lg bg-white/5">
          {children}
        </div>
      </div>
    </div>
  )
}
