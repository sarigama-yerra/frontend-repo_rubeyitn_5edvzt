import { useState, useEffect } from 'react'

export default function TopNav({ onTabChange, currentTab }) {
  const tabs = [
    { id: 'play', label: 'Play' },
    { id: 'progress', label: 'Progress' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'history', label: 'History' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <div className="w-full flex items-center justify-between gap-2">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-fuchsia-400 text-transparent bg-clip-text">
        Outvent
      </h1>
      <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-sm transition ${currentTab===t.id ? 'bg-purple-600 text-white' : 'text-white/70 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
