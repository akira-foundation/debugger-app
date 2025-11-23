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
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Trial Status</h2>
        <div className="h-px flex-1 bg-white/5"></div>
      </div>

      <div className="rounded-xl p-6 bg-gradient-to-br from-yellow-500/5 via-yellow-500/2 to-transparent border border-yellow-500/20 backdrop-blur-sm">
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
      </div>
    </section>
  )
}
