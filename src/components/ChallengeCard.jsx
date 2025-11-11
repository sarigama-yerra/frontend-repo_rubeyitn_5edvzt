import { motion, AnimatePresence } from 'framer-motion'

export default function ChallengeCard({ challenge, visible, onFavorite, isFavorite }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={challenge?.text}
          initial={{ y: 20, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -10, opacity: 0, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          className="relative w-full rounded-2xl p-6 bg-gradient-to-br from-gray-900/70 to-black/60 backdrop-blur-md border border-white/10 shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-widest text-white/60">Challenge</span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              challenge?.difficulty === 1 ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
              challenge?.difficulty === 2 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
              'bg-red-500/20 text-red-300 border border-red-400/30'
            }`}>Difficulty {challenge?.difficulty}</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {challenge?.text}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={onFavorite}
              className={`px-3 py-1 rounded-full text-sm font-medium transition border ${isFavorite ? 'bg-purple-600/30 text-purple-200 border-purple-400/40' : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'}`}
            >
              {isFavorite ? '★ Favorited' : '☆ Add to Favorites'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
