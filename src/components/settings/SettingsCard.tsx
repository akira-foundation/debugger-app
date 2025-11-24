interface SettingsCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function SettingsCard({ title, subtitle, children }: SettingsCardProps) {
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <div className="">
        <h3 className="font-medium text-gray-200 px-3 pt-2">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5 px-3 pb-3">{subtitle}</p>}
      </div>

      <div className="mb-0.5 mx-0.5">
        <div className="p-3 border border-white/10 rounded-lg">
          {children}
        </div>
      </div>
    </div>
  )
}
