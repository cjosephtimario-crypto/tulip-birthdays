import { useState, useEffect } from 'react'
import { Sparkles, Heart, Flower2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WelcomeCelebrationProps {
  onClose: () => void
}

interface Balloon {
  id: number
  x: number
  color: string
  speed: number
}

export function WelcomeCelebration({ onClose }: WelcomeCelebrationProps) {
  const [canClose, setCanClose] = useState(false)
  const [balloons, setBalloons] = useState<Balloon[]>([])

  const playSoundEffect = (type: 'boom' | 'chime' | 'balloon') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const now = audioCtx.currentTime

      if (type === 'boom') {
        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(150, now)
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.8)
        
        gain.gain.setValueAtTime(0.8, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8)

        osc.connect(gain)
        gain.connect(audioCtx.destination)
        osc.start(now)
        osc.stop(now + 0.8)
      } else if (type === 'chime') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, index) => {
          const osc = audioCtx.createOscillator()
          const gain = audioCtx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + index * 0.1)

          gain.gain.setValueAtTime(0.2, now + index * 0.1)
          gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.6)

          osc.connect(gain)
          gain.connect(audioCtx.destination)
          osc.start(now + index * 0.1)
          osc.stop(now + index * 0.1 + 0.6)
        })
      } else if (type === 'balloon') {
        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(200, now)
        osc.frequency.linearRampToValueAtTime(400, now + 0.3)

        gain.gain.setValueAtTime(0.1, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

        osc.connect(gain)
        gain.connect(audioCtx.destination)
        osc.start(now)
        osc.stop(now + 0.3)
      }
    } catch (e) {
      console.log('AudioContext not allowed yet', e)
    }
  }

  useEffect(() => {
    playSoundEffect('boom')
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
      })
    })

    const chimeTimer = setTimeout(() => {
      playSoundEffect('chime')
    }, 400)

    const buttonTimer = setTimeout(() => {
      setCanClose(true)
    }, 3500)

    const balloonColors = [
      'bg-pink-400',
      'bg-purple-400',
      'bg-indigo-400',
      'bg-rose-300',
      'bg-fuchsia-400',
    ]

    const balloonInterval = setInterval(() => {
      setBalloons((prev) => {
        const newBalloon: Balloon = {
          id: Date.now() + Math.random(),
          x: Math.random() * 90 + 5,
          color: balloonColors[Math.floor(Math.random() * balloonColors.length)] || 'bg-pink-400',
          speed: Math.random() * 2 + 3,
        }
        return [...prev.slice(-15), newBalloon]
      })
      playSoundEffect('balloon')
    }, 600)

    return () => {
      clearTimeout(chimeTimer)
      clearTimeout(buttonTimer)
      clearInterval(balloonInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md overflow-hidden animate-fade-in">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {balloons.map((b) => (
          <div
            key={b.id}
            className={`absolute bottom-[-50px] w-8 h-10 rounded-full ${b.color} shadow-lg animate-balloon-rise flex items-center justify-center opacity-80`}
            style={{
              left: `${b.x}%`,
              animationDuration: `${b.speed}s`,
            }}
          >
            <div className="absolute bottom-[-6px] w-0.5 h-4 bg-white/60"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-lg mx-auto space-y-6">
        <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-pink-500/30 via-purple-500/40 to-indigo-500/30 blur-3xl animate-pulse -z-10"></div>

        <div className="relative animate-bouquet-emerge">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-pink-400 to-purple-400 flex items-center justify-center shadow-[0_20px_30px_rgba(236,72,153,0.4)] animate-float">
            <Flower2 className="w-16 h-16 text-white" />
          </div>
          <div className="absolute -top-4 -right-4 animate-bounce">
            <Sparkles className="w-8 h-8 text-yellow-300 drop-shadow-md" />
          </div>
          <div className="absolute -bottom-2 -left-4 animate-bounce delay-150">
            <Heart className="w-7 h-7 text-pink-400 fill-pink-400 drop-shadow-md" />
          </div>
        </div>

        <div className="space-y-2 animate-fade-in-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1 text-xs font-bold text-white tracking-wider uppercase backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" /> Special Delivery
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg">
            Welcome to Your Sanctuary! 🌷
          </h2>
          <p className="text-sm text-pink-100/90 max-w-sm mx-auto leading-relaxed">
            Fresh tulips, sparkling memories, and joyful celebrations are all set up and waiting for you.
          </p>
        </div>

        <div className="min-h-[50px] flex items-center justify-center">
          {canClose ? (
            <Button
              onClick={onClose}
              size="lg"
              className="rounded-full px-8 py-3 gradient-dream text-white font-bold shadow-[0_0_25px_rgba(216,180,254,0.6)] hover:scale-105 transition-transform animate-fade-in"
            >
              Thank you 💖
            </Button>
          ) : (
            <p className="text-xs text-white/50 animate-pulse">Preparing your celebration...</p>
          )}
        </div>
      </div>
    </div>
  )
}