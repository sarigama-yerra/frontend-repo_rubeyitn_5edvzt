import { useEffect, useMemo, useState } from 'react'
import TopNav from './components/TopNav'
import Generator from './components/Generator'
import { FavoritesView, HistoryView, ProgressView, SettingsView, useStats } from './components/StatsViews'

function App() {
  const { wins, losses, rate, history, favorites, addResult, reset } = useStats()
  const [tab, setTab] = useState('play')

  function handleResult(type, challenge){
    if(type==='start') return
    addResult(type, challenge)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0713] via-[#120a20] to-[#0b0713] text-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <TopNav currentTab={tab} onTabChange={setTab} />

        {tab==='play' && (
          <div className="mt-6">
            <Generator onResult={handleResult} />
          </div>
        )}

        {tab==='progress' && (
          <div className="mt-6">
            <ProgressView wins={wins} losses={losses} rate={rate} />
          </div>
        )}

        {tab==='favorites' && (
          <div className="mt-6">
            <FavoritesView favorites={favorites} />
          </div>
        )}

        {tab==='history' && (
          <div className="mt-6">
            <HistoryView history={history} />
          </div>
        )}

        {tab==='settings' && (
          <div className="mt-6">
            <SettingsView onReset={reset} />
          </div>
        )}

        <footer className="mt-10 text-center text-xs text-white/50">
          Outvent — a playful confidence trainer. Be bold, not boring.
        </footer>
      </div>
    </div>
  )
}

export default App
