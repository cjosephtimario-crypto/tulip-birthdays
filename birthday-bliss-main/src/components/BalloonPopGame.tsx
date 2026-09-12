import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RotateCcw, Trophy, Timer, Zap, Award, User } from 'lucide-react'
import confetti from 'canvas-confetti'
import { supabase } from '@/lib/supabase'

interface Balloon {
  id: number
  x: number
  y: number
  color: string
  sizeClass: string
  spawnTime: number
}

type GameMode = 'easy' | 'normal' | 'hard'

interface LeaderboardEntry {
  name: string
  score: number
}

const MODE_SETTINGS: Record<GameMode, { label: string; lifespan: number; spawnInterval: number }> = {
  easy: { label: 'Easy 🌸', lifespan: 5500, spawnInterval: 3000 },
  normal: { label: 'Normal 🌷', lifespan: 3000, spawnInterval: 1800 },
  hard: { label: 'Hard 🔥', lifespan: 1400, spawnInterval: 100 },
}

const BALLOON_COLORS: string[] = ['bg-pink-400', 'bg-purple-400', 'bg-blue-400', 'bg-yellow-400', 'bg-red-400']

const BALLOON_SIZES: { class: string }[] = [
  { class: 'w-16 h-22 text-sm' },   // Large
  { class: 'w-13 h-18 text-xs' },   // Medium
  { class: 'w-10 h-14 text-[10px]' }, // Small
]

export function BalloonPopGame() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu')
  const [mode, setMode] = useState<GameMode>('normal')
  const [playerName, setPlayerName] = useState<string>('Player')
  const [score, setScore] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number>(60)
  const [balloons, setBalloons] = useState<Balloon[]>([])
  
  const [leaderboards, setLeaderboards] = useState<Record<GameMode, LeaderboardEntry[]>>({
    easy: [],
    normal: [],
    hard: [],
  })
  
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false)
  const [lastPopFeedback, setLastPopFeedback] = useState<{ id: number; text: string; points: number } | null>(null)

  useEffect(() => {
    const savedName = localStorage.getItem('tulip_balloon_player_name')
    if (savedName) setPlayerName(savedName)

    fetchLeaderboards()
  }, [])

  const fetchLeaderboards = async () => {
    try {
      const { data, error } = await supabase
        .from('balloon_leaderboard')
        .select('*')
        .order('Score', { ascending: false })

      if (error) {
        console.error('Error fetching leaderboards:', error)
        return
      }

      if (data) {
        const newBoards: Record<GameMode, LeaderboardEntry[]> = { easy: [], normal: [], hard: [] }
        const counts: Record<GameMode, number> = { easy: 0, normal: 0, hard: 0 }

        data.forEach((row: any) => {
          const m = row.mode as GameMode
          if (newBoards[m] && counts[m] < 5) {
            newBoards[m].push({ name: row.Name, score: row.Score })
            counts[m]++
          }
        })

        setLeaderboards(newBoards)
      }
    } catch (e) {
      console.error('Failed to connect to Supabase', e)
    }
  }

  const handleNameChange = (name: string) => {
    setPlayerName(name)
    localStorage.setItem('tulip_balloon_player_name', name)
  }

  useEffect(() => {
    if (gameState !== 'playing') return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState])

  useEffect(() => {
    if (gameState === 'playing' && timeLeft === 0) {
      endGame(score)
    }
  }, [timeLeft, gameState])

  useEffect(() => {
    if (gameState !== 'playing') return

    const settings = MODE_SETTINGS[mode]

    const spawnSingleBalloon = () => {
      setBalloons((prevBalloons) => {
        if (mode === 'hard' && prevBalloons.length > 0) return prevBalloons

        const id = Date.now() + Math.random()
        const randomIndex = Math.floor(Math.random() * BALLOON_COLORS.length)
        const color = BALLOON_COLORS[randomIndex] ?? 'bg-pink-400'

        let sizeObj = BALLOON_SIZES[1] ?? { class: 'w-13 h-18 text-xs' }
        if (mode === 'easy') {
          sizeObj = Math.random() > 0.3 ? (BALLOON_SIZES[0] ?? sizeObj) : sizeObj
        } else if (mode === 'hard') {
          sizeObj = Math.random() > 0.4 ? (BALLOON_SIZES[2] ?? sizeObj) : sizeObj
        } else {
          sizeObj = BALLOON_SIZES[Math.floor(Math.random() * BALLOON_SIZES.length)] ?? sizeObj
        }

        const newBalloon: Balloon = {
          id,
          x: Math.floor(Math.random() * 70) + 10,
          y: Math.floor(Math.random() * 60) + 15,
          color,
          sizeClass: sizeObj.class,
          spawnTime: Date.now(),
        }

        setTimeout(() => {
          setBalloons((current) => current.filter((b) => b.id !== id))
        }, settings.lifespan)

        return mode === 'hard' ? [newBalloon] : [...prevBalloons, newBalloon]
      })
    }

    const spawner = setInterval(spawnSingleBalloon, settings.spawnInterval)
    return () => clearInterval(spawner)
  }, [gameState, mode])

  const startGame = (selectedMode: GameMode) => {
    setMode(selectedMode)
    setScore(0)
    setTimeLeft(60)
    setBalloons([])
    setIsNewRecord(false)
    setGameState('playing')
  }

  const popBalloon = (id: number, spawnTime: number) => {
    const reactionTime = Date.now() - spawnTime
    let points = 1
    let feedbackText = '+1 Point'

    if (mode === 'easy') {
      if (reactionTime < 3500) {
        points = 5
        feedbackText = '+5 Easy 5pts! 🌸'
      } else if (reactionTime < 4800) {
        points = 3
        feedbackText = '+3 Good! 👍'
      } else {
        points = 1
        feedbackText = '+1 Hard 1pt!'
      }
    } else if (mode === 'normal') {
      if (reactionTime < 1200) {
        points = 5
        feedbackText = '+5 Fast! ⚡'
      } else if (reactionTime < 2200) {
        points = 3
        feedbackText = '+3 Good! 👍'
      } else {
        points = 1
        feedbackText = '+1 Harder 1pt'
      }
    } else {
      if (reactionTime < 300) {
        points = 5
        feedbackText = '+5 Lightning! 🔥'
      } else if (reactionTime < 700) {
        points = 3
        feedbackText = '+3 Nice! 👍'
      } else {
        points = 1
        feedbackText = '+1 Point'
      }
    }

    setScore((prev) => prev + points)
    setBalloons((prev) => prev.filter((b) => b.id !== id))
    setLastPopFeedback({ id, text: feedbackText, points })
    setTimeout(() => setLastPopFeedback(null), 600)
  }

  const endGame = async (finalScore: number) => {
    setGameState('gameover')

    const currentList = leaderboards[mode] || []
    const existingUserEntry = currentList.find((entry) => entry.name.toLowerCase() === (playerName || 'Player').toLowerCase())
    
    let isPersonalBest = false
    if (!existingUserEntry || finalScore > existingUserEntry.score) {
      isPersonalBest = true
    }

    setIsNewRecord(isPersonalBest)

    try {
      await supabase.from('balloon_leaderboard').insert([
        { Name: playerName || 'Player', Score: finalScore, mode: mode }
      ])
      await fetchLeaderboards()
    } catch (e) {
      console.error('Error inserting score to Supabase', e)
    }

    if (isPersonalBest) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#a855f7', '#3b82f6', '#eab308']
      })
    } else {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } })
    }
  }

  const getTopScoreForMode = (m: GameMode) => {
    const list = leaderboards[m]
    if (!list || list.length === 0) return 0
    return list[0]?.score || 0
  }

  return (
    <div className="space-y-6 text-center max-w-md mx-auto">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-primary font-bold text-sm">
          <Zap className="w-4 h-4" />
          <span>Balloon Pop Challenge</span>
        </div>
        <h2 className="font-display text-2xl font-bold">Pop the Balloons! 🎈</h2>
        <p className="text-sm text-muted-foreground">
          Test your reflexes! Fast = 5pts, Medium = 3pts, Slow = 1pt.
        </p>
      </div>

      {gameState === 'menu' && (
        <div className="space-y-6 py-6 bg-accent/20 p-6 rounded-3xl border border-border/50">
          <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-2xl border border-purple-100 shadow-sm">
            <User className="w-4 h-4 text-primary" />
            <input
              type="text"
              value={playerName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter your name..."
              className="bg-transparent text-sm font-semibold focus:outline-none w-full text-foreground"
              maxLength={15}
            />
          </div>

          <h3 className="font-display font-bold text-lg">Select Difficulty Mode</h3>
          <div className="flex flex-col gap-3">
            {(['easy', 'normal', 'hard'] as GameMode[]).map((m) => (
              <Button
                key={m}
                onClick={() => startGame(m)}
                className="rounded-2xl h-12 font-bold text-base gradient-dream text-white shadow-soft hover:opacity-90 capitalize flex justify-between px-6"
              >
                <span>{MODE_SETTINGS[m].label}</span>
                <span className="text-xs bg-white/25 px-2.5 py-1 rounded-full">Peak: {getTopScoreForMode(m)} Pts</span>
              </Button>
            ))}
          </div>

          <div className="bg-white/70 p-4 rounded-2xl text-left space-y-3 border border-purple-100 shadow-sm">
            <div className="font-bold text-foreground text-xs flex items-center gap-1.5 uppercase tracking-wider text-purple-700">
              <Award className="w-4 h-4" /> Global Leaderboards
            </div>
            
            <div className="space-y-3 text-xs">
              {(['easy', 'normal', 'hard'] as GameMode[]).map((m) => {
                const entries = leaderboards[m] || []
                return (
                  <div key={m} className="space-y-1">
                    <div className="font-bold capitalize text-primary text-[11px] border-b border-border/40 pb-0.5 flex justify-between">
                      <span>{m} Mode</span>
                      <span className="text-[10px] text-muted-foreground font-normal">Top Player</span>
                    </div>
                    {entries.length === 0 ? (
                      <div className="text-muted-foreground italic text-[11px] py-0.5">No records yet</div>
                    ) : (
                      entries.slice(0, 2).map((entry, idx) => (
                        <div key={idx} className="flex justify-between py-0.5 text-foreground">
                          <span className="font-medium truncate max-w-[140px]">{idx + 1}. {entry.name}</span>
                          <span className="font-extrabold">{entry.score} Pts</span>
                        </div>
                      ))
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-6 py-3 bg-accent/40 rounded-2xl font-bold text-sm">
            <span className="flex items-center gap-1.5 text-primary">
              <Timer className="w-4 h-4" /> Time: {timeLeft}s
            </span>
            <span className="bg-white px-3 py-1 rounded-full shadow-sm text-foreground">
              Mode: <span className="capitalize text-primary">{mode}</span>
            </span>
            <span className="text-purple-600">Score: {score}</span>
          </div>

          <div className="relative w-full h-[380px] rounded-3xl bg-gradient-to-b from-purple-50/60 to-blue-50/60 border-2 border-purple-100 shadow-inner overflow-hidden select-none">
            {balloons.map((b) => (
              <div
                key={b.id}
                onClick={() => popBalloon(b.id, b.spawnTime)}
                className={`absolute rounded-full cursor-pointer flex items-center justify-center shadow-lg transition-transform hover:scale-115 animate-bounce z-20 ${b.sizeClass} ${b.color}`}
                style={{ left: `${b.x}%`, top: `${b.y}%` }}
              >
                <div className="w-0.5 h-6 bg-white/70 absolute -bottom-6" />
                <span className="text-white font-bold drop-shadow">POP</span>
              </div>
            ))}

            {lastPopFeedback && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                <span className="text-lg font-black text-primary animate-fade-in bg-white/90 px-4 py-1.5 rounded-full shadow-md">
                  {lastPopFeedback.text}
                </span>
              </div>
            )}

            {balloons.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/60 text-sm pointer-events-none">
                Waiting for balloons...
              </div>
            )}
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="space-y-6 py-6 bg-white p-8 rounded-3xl shadow-xl border border-purple-100">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-primary">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-2xl text-foreground">Time's Up! 🎂</h3>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="font-bold text-foreground">{playerName}</span> scored <span className="font-bold text-primary">{score}</span> points in <span className="capitalize font-semibold">{mode}</span> mode.
            </p>
            {isNewRecord && (
              <div className="mt-3 inline-block bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-black animate-bounce shadow-sm">
                🎉 NEW PEAK SCORE RECORD! 🎉
              </div>
            )}
          </div>

          <div className="bg-accent/30 p-4 rounded-2xl text-left space-y-2 text-xs">
            <div className="font-bold text-foreground mb-1 flex items-center gap-1.5 text-purple-700">
              <Award className="w-4 h-4" /> {capitalize(mode)} Mode Leaderboard
            </div>
            <div className="space-y-1">
              {(leaderboards[mode] || []).map((entry, idx) => (
                <div key={idx} className={`flex justify-between py-1 border-b border-border/40 last:border-0 ${entry.name.toLowerCase() === playerName.toLowerCase() ? 'font-black text-primary' : ''}`}>
                  <span>{idx + 1}. {entry.name}</span>
                  <span>{entry.score} Pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => startGame(mode)}
              className="flex-1 rounded-full gradient-dream text-white font-bold shadow-soft"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Play Again
            </Button>
            <Button
              variant="outline"
              onClick={() => setGameState('menu')}
              className="rounded-full font-bold"
            >
              Change Mode
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}