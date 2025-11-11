import { useEffect, useMemo, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'
import ChallengeCard from './ChallengeCard'
import CircularTimer from './CircularTimer'

const PRIMARY = '#A259FF'

const basePrompts = [
  // Curated examples and similar tone; will expand procedurally
  'Ask someone if they can rate your outfit 1-10.',
  'Say “Good morning!” loudly to a random group.',
  'Tell a stranger you saw them in your dream.',
  'Ask someone if they believe in aliens.',
  'Stare at someone’s shoes for 3 seconds and say “nice choice.”',
  'Compliment someone on something random, like their handwriting.',
  'Ask a stranger if you look trustworthy.',
  'Tell a friend they look suspicious today.',
  'Wave at someone and act like you know them.',
  'Ask someone to take a picture of you doing something goofy.',
]

const templates = [
  'Ask someone if they can rate your {item} 1-10.',
  'Say “{greet}!” loudly to a random group.',
  'Tell a stranger you saw them in your {dream}.',
  'Ask someone if they believe in {topic}.',
  'Stare at someone’s {thing} for 3 seconds and say “nice choice.”',
  'Compliment someone on their {random}.',
  'Ask a stranger if you look {adj}.',
  'Tell a friend they look {adj} today.',
  'Wave at someone and act like you know them.',
  'Ask someone to take a picture of you doing something {silly}.',
  'Drop a quick “{line}” to a passerby.',
]

const banks = {
  item: ['outfit','hat','hair','vibe','playlist','walk'],
  greet: ['Good morning','Hello there','Top of the morning','Howdy team'],
  dream: ['dream','vision','movie last night','daydream'],
  topic: ['aliens','mermaids','time travel','ghosts','parallel universes'],
  thing: ['shoes','backpack','water bottle','socks','phone case'],
  random: ['handwriting','earrings','laugh','posture','energy'],
  adj: ['trustworthy','suspicious','mysterious','iconic','legendary'],
  silly: ['goofy','ridiculous','epic','dramatic','silly'],
  line: ['You look like main character energy','Be bold, not boring','Today feels cinematic','Vibes are immaculate'],
}

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)] }

function generateOne(){
  const useTemplate = Math.random() < 0.8
  if(!useTemplate) return pick(basePrompts)
  let t = pick(templates)
  t = t.replace('{item}', pick(banks.item))
    .replace('{greet}', pick(banks.greet))
    .replace('{dream}', pick(banks.dream))
    .replace('{topic}', pick(banks.topic))
    .replace('{thing}', pick(banks.thing))
    .replace('{random}', pick(banks.random))
    .replace('{adj}', pick(banks.adj))
    .replace('{silly}', pick(banks.silly))
    .replace('{line}', pick(banks.line))
  return t
}

function seededChallenges(){
  const existing = localStorage.getItem('outvent.challenges')
  if (existing) return JSON.parse(existing)
  const items = []
  for(let i=0;i<1000;i++){
    const text = generateOne()
    // simple distribution: 1:50%, 2:35%, 3:15%
    const r = Math.random()
    const difficulty = r < 0.5 ? 1 : r < 0.85 ? 2 : 3
    items.push({ id: i+1, text, difficulty })
  }
  localStorage.setItem('outvent.challenges', JSON.stringify(items))
  return items
}

export default function Generator({ onResult }){
  const [difficulty, setDifficulty] = useState(() => Number(localStorage.getItem('outvent.lastDifficulty')||0))
  const [current, setCurrent] = useState(null)
  const [remaining, setRemaining] = useState(0)
  const [running, setRunning] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [tab, setTab] = useState('play')
  const all = useMemo(() => seededChallenges(), [])
  const intervalRef = useRef(null)

  // Restore last difficulty
  useEffect(()=>{
    localStorage.setItem('outvent.lastDifficulty', String(difficulty))
  }, [difficulty])

  // Timer
  useEffect(()=>{
    if(!running) return
    intervalRef.current = setInterval(()=>{
      setRemaining(prev => prev - 1)
    }, 1000)
    return ()=> clearInterval(intervalRef.current)
  }, [running])

  useEffect(()=>{
    if(remaining <= 0 && running){
      setRunning(false)
      onResult?.('loss', current)
      navigator.vibrate?.(100)
    }
  }, [remaining, running])

  useEffect(()=>{
    if(!current) return setIsFavorite(false)
    const favs = JSON.parse(localStorage.getItem('outvent.favorites')||'[]')
    setIsFavorite(!!favs.find(f=>f.text===current.text && f.difficulty===current.difficulty))
  }, [current])

  function getCandidates(){
    if(difficulty===0){
      return all
    }
    return all.filter(c=>c.difficulty===difficulty)
  }

  function generate(){
    const arr = getCandidates()
    const item = arr[Math.floor(Math.random()*arr.length)]
    setCurrent(item)
    setRemaining(60*60)
    setRunning(true)
    onResult?.('start', item)
    navigator.vibrate?.(40)
    const audio = new Audio('/tone.mp3')
    audio.volume = 0.15
    audio.play().catch(()=>{})
  }

  function markDone(){
    if(!running) return
    setRunning(false)
    onResult?.('win', current)
    navigator.vibrate?.([60,40,60])
    const audio = new Audio('/success.mp3')
    audio.volume = 0.2
    audio.play().catch(()=>{})
  }

  function toggleFavorite(){
    if(!current) return
    const favs = JSON.parse(localStorage.getItem('outvent.favorites')||'[]')
    let updated
    if(isFavorite){
      updated = favs.filter(f=> !(f.text===current.text && f.difficulty===current.difficulty))
      setIsFavorite(false)
    } else {
      updated = [{...current, savedAt: Date.now()}, ...favs].slice(0,200)
      setIsFavorite(true)
    }
    localStorage.setItem('outvent.favorites', JSON.stringify(updated))
  }

  return (
    <div className="relative w-full">
      <div className="h-64 w-full rounded-2xl overflow-hidden border border-white/10 mb-4">
        <Spline scene="https://prod.spline.design/atN3lqky4IzF-KEP/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1">
          {[
            {v:1,l:'1 — Easy'},
            {v:2,l:'2 — Medium'},
            {v:3,l:'3 — Hard'},
            {v:0,l:'Random'},
          ].map(opt=> (
            <button key={opt.v}
              onClick={()=> setDifficulty(opt.v)}
              className={`px-3 py-1.5 rounded-full text-sm transition ${difficulty===opt.v ? 'bg-purple-600 text-white' : 'text-white/70 hover:text-white'}`}
            >{opt.l}</button>
          ))}
        </div>
        <div className="text-white/70 text-sm">
          {difficulty===0 && current ? `Random → Difficulty ${current.difficulty}` : difficulty===0 ? 'Random' : `Difficulty ${difficulty}`}
        </div>
      </div>

      <ChallengeCard
        challenge={current}
        visible={!!current}
        onFavorite={toggleFavorite}
        isFavorite={isFavorite}
      />

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <button onClick={generate} className="sm:col-span-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-4 rounded-2xl text-lg shadow-[0_0_30px_rgba(162,89,255,0.6)] transition">
          Generate Challenge
        </button>
        <div className="flex justify-center">
          <CircularTimer remaining={remaining} total={3600} onComplete={()=>{}} color={PRIMARY} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button onClick={markDone} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50" disabled={!running}>Mark as Done</button>
        <button onClick={()=>{ setRunning(false); setRemaining(0); }} className="flex-1 bg-rose-600/80 hover:bg-rose-500 text-white font-semibold py-3 rounded-xl transition" disabled={!running}>Give Up</button>
      </div>
    </div>
  )
}
