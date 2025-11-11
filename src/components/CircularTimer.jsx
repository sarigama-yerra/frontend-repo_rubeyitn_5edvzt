import { useEffect, useMemo } from 'react'

export default function CircularTimer({ total=3600, remaining, onComplete, size=140, color="#A259FF" }) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(1, remaining / total))
  const dash = useMemo(() => progress * circumference, [progress, circumference])

  useEffect(() => {
    if (remaining <= 0 && onComplete) onComplete()
  }, [remaining, onComplete])

  const minutes = Math.floor(Math.max(0, remaining) / 60)
  const seconds = Math.max(0, remaining) % 60

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-lg">
        <circle cx="50" cy="50" r={radius} className="text-white/10" stroke="currentColor" strokeWidth="10" fill="transparent" />
        <circle
          cx="50" cy="50" r={radius}
          stroke={color}
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - dash}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
        <text x="50" y="54" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="700">
          {String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}
        </text>
      </svg>
      <p className="text-xs text-white/70 mt-2">1 hour to complete</p>
    </div>
  )
}
