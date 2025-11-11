import { useEffect, useMemo, useState } from 'react'

export function useStats(){
  const [wins, setWins] = useState(Number(localStorage.getItem('outvent.wins')||0))
  const [losses, setLosses] = useState(Number(localStorage.getItem('outvent.losses')||0))
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem('outvent.history')||'[]'))
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('outvent.favorites')||'[]'))

  function addResult(type, challenge){
    const entry = { type, challenge, at: Date.now() }
    const newHistory = [entry, ...history].slice(0, 500)
    setHistory(newHistory)
    localStorage.setItem('outvent.history', JSON.stringify(newHistory))
    if(type==='win'){
      const w = wins+1; setWins(w); localStorage.setItem('outvent.wins', w)
    } else if(type==='loss'){
      const l = losses+1; setLosses(l); localStorage.setItem('outvent.losses', l)
    }
  }

  function reset(){
    setWins(0); setLosses(0); setHistory([]); setFavorites([])
    localStorage.setItem('outvent.wins', '0')
    localStorage.setItem('outvent.losses', '0')
    localStorage.setItem('outvent.history', '[]')
    localStorage.setItem('outvent.favorites', '[]')
  }

  useEffect(()=>{
    const interval = setInterval(()=>{
      setFavorites(JSON.parse(localStorage.getItem('outvent.favorites')||'[]'))
    }, 800)
    return ()=> clearInterval(interval)
  }, [])

  const total = wins + losses
  const rate = total ? Math.round((wins/total)*100) : 0

  return { wins, losses, total, rate, history, favorites, addResult, reset }
}

export function ProgressView({ wins, losses, rate }){
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white">
      <h3 className="text-xl font-bold mb-4">Progress</h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-3xl font-extrabold text-emerald-300">{wins}</div>
          <div className="text-sm text-white/70">Won</div>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-rose-300">{losses}</div>
          <div className="text-sm text-white/70">Lost</div>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-purple-300">{rate}%</div>
          <div className="text-sm text-white/70">Win rate</div>
        </div>
      </div>
      {wins+losses>0 && (
        <p className="mt-4 text-white/80">You completed {wins} of {wins+losses} challenges.</p>
      )}
    </div>
  )
}

export function FavoritesView({ favorites }){
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white">
      <h3 className="text-xl font-bold mb-4">Favorites</h3>
      {favorites.length===0 ? (
        <p className="text-white/70">No favorites yet. Add your best moments!</p>
      ) : (
        <ul className="space-y-3">
          {favorites.map((f,i)=> (
            <li key={i} className="p-3 rounded-xl bg-black/40 border border-white/10">
              <div className="text-sm text-white/60">Difficulty {f.difficulty}</div>
              <div className="text-white font-medium">{f.text}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function HistoryView({ history }){
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white">
      <h3 className="text-xl font-bold mb-4">History</h3>
      {history.length===0 ? (
        <p className="text-white/70">No past challenges yet.</p>
      ) : (
        <ul className="space-y-3">
          {history.map((h,i)=> (
            <li key={i} className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start justify-between gap-3">
              <div>
                <div className={`text-xs font-semibold ${h.type==='win'?'text-emerald-300':'text-rose-300'}`}>{h.type.toUpperCase()}</div>
                <div className="text-xs text-white/60">Difficulty {h.challenge?.difficulty}</div>
                <div className="text-white font-medium">{h.challenge?.text}</div>
              </div>
              <div className="text-xs text-white/50 whitespace-nowrap">{new Date(h.at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function SettingsView({ onReset }){
  function notify(){
    if('Notification' in window){
      if(Notification.permission==='granted'){
        new Notification('Outvent', { body: 'Time for a confidence challenge?' })
      } else {
        Notification.requestPermission().then(p=>{
          if(p==='granted') new Notification('Outvent', { body: 'Time for a confidence challenge?' })
        })
      }
    }
  }
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white space-y-4">
      <h3 className="text-xl font-bold">Settings</h3>
      <button onClick={notify} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg">Send Daily Reminder</button>
      <button onClick={onReset} className="bg-rose-600/80 hover:bg-rose-500 text-white px-4 py-2 rounded-lg">Reset Progress</button>
      <p className="text-white/70 text-sm">Motivation Mode: “Be bold, not boring.”</p>
    </div>
  )
}
