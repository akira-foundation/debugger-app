import { SettingsCard } from './SettingsCard'

interface TrialSectionProps {
  isTrialActive: boolean
  trialDaysRemaining: number
  trialStartDate: Date | null
}

export function TrialSection({
  isTrialActive,
  trialDaysRemaining,
  trialStartDate,
}: TrialSectionProps) {
  if (!isTrialActive) return null

  return (
    <SettingsCard title="Trial Status" subtitle="Your trial license information and remaining days">
      <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
              <span className="text-sm font-medium text-yellow-300">Active</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Time Remaining</span>
            <span className={`text-sm font-semibold font-mono ${
              trialDaysRemaining <= 2 ? 'text-red-300' : 'text-yellow-300'
            }`}>
              {trialDaysRemaining} {trialDaysRemaining === 1 ? 'day' : 'days'}
            </span>
          </div>

          {trialStartDate && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Started On</span>
              <span className="text-sm font-mono text-gray-400">
                {trialStartDate.toLocaleDateString()} at {trialStartDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}
      </div>
    </SettingsCard>
  )
}
