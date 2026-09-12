import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Sparkles, Volume2, Calendar, PartyPopper } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import { TulipCorner, Tulip, TulipBorder } from '@/components/Tulips'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { WishlistTab } from '@/components/WishlistTab'
import { MemoriesTab } from '@/components/MemoriesTab'
import { BalloonPopGame } from '@/components/BalloonPopGame'
import { InteractiveGarden } from '@/components/InteractiveGarden'
import maidArt from '@/assets/maid.png'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})

const maidQuotes = [
  "I have watered the tulips just for you today. Let us make it wonderful.",
  "Your special day is approaching. I am keeping everything sparkling and ready for you.",
  "Fresh tulips and happy memories are waiting right here.",
  "I prepared all your birthday surprises with extra care. What should we check first?",
  "The garden is blooming so nicely this morning, and everything is ready for your celebration.",
  "I organized your wishlist items so we can keep track of everything easily.",
  "Taking care of your party preparations is my absolute favorite task.",
  "I polished up the memories album so we can look back at wonderful times together.",
  "Just a gentle reminder to take a deep breath and smile today.",
  "Everything is running smoothly, and your big day is going to be amazing."
]

function Dashboard() {
  const [activeTab, setActiveTab] = useState<'wishlist' | 'memories' | 'game' | 'garden'>('wishlist')
  const [userProfile, setUserProfile] = useState<{ first_name?: string; birthday?: string }>({})
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const quoteIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 5)) % maidQuotes.length
  const currentQuote = maidQuotes[quoteIndex]

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices()
      }
    }

    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles' as any)
        .select('first_name, birthday')
        .eq('id', user.id)
        .maybeSingle()

      if (data) {
        setUserProfile(data as any)
      } else {
        setUserProfile({
          first_name: (user.user_metadata as any)?.first_name || user.email?.split('@')[0] || 'Friend',
          birthday: (user.user_metadata as any)?.birthday || '2026-12-31'
        })
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const birthdayStr = userProfile.birthday || '2026-12-31'

      const [, monthStr, dayStr] = birthdayStr.split('-')
      const month = Number(monthStr) || 12
      const day = Number(dayStr) || 31

      const targetYear = now.getFullYear()
      let target = new Date(targetYear, month - 1, day)

      if (now.getTime() > target.getTime()) {
        target = new Date(targetYear + 1, month - 1, day)
      }

      const diff = target.getTime() - now.getTime()
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor(diff / 1000) % 60,
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [userProfile.birthday])

  const speakMaid = () => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()

    const name = userProfile.first_name || 'Friend'
    const text = 'Welcome back ' + name + '. ' + currentQuote
    const utterance = new SpeechSynthesisUtterance(text)

    const voices = window.speechSynthesis.getVoices()
    const femaleVoice = voices.find((v) =>
      /zira|female|samantha|victoria|karen|fiona|aria|jenny|natural|neural/i.test(v.name)
    ) || voices.find((v) => v.lang.includes('en') && !/david|mark|george|james/i.test(v.name)) || voices[0]

    if (femaleVoice) utterance.voice = femaleVoice
    
    utterance.pitch = 1.65 
    utterance.rate = 1.15
    utterance.volume = 1.0

    window.speechSynthesis.speak(utterance)
  }

  const displayName = userProfile.first_name || 'Friend'

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Super abundant scattered background tulips */}
      <div className="absolute top-16 left-8 opacity-35 pointer-events-none hidden lg:block">
        <Tulip className="h-32 w-24 animate-float" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" />
      </div>
      <div className="absolute top-28 right-16 opacity-30 pointer-events-none hidden lg:block">
        <Tulip className="h-20 w-14 animate-float" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "1s" }} />
      </div>
      <div className="absolute top-[32rem] left-10 opacity-25 pointer-events-none hidden lg:block">
        <Tulip className="h-40 w-28 animate-float" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "0.5s" }} />
      </div>
      <div className="absolute top-[38rem] right-12 opacity-30 pointer-events-none hidden lg:block">
        <Tulip className="h-28 w-20 animate-float" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" style={{ animationDelay: "1.5s" }} />
      </div>
      <div className="absolute bottom-32 left-14 opacity-30 pointer-events-none hidden lg:block">
        <Tulip className="h-24 w-16 animate-float" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" style={{ animationDelay: "2s" }} />
      </div>
      <div className="absolute bottom-20 right-20 opacity-35 pointer-events-none hidden lg:block">
        <Tulip className="h-36 w-24 animate-float" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "0.8s" }} />
      </div>

      <SiteHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8 relative z-10">
        <TulipCorner className="absolute -left-12 top-10 hidden md:block opacity-40 pointer-events-none" />
        <TulipCorner className="absolute -right-12 top-20 hidden md:block opacity-40 pointer-events-none" />

        {/* Top Hero Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Maid Assistant Hero Card */}
          <div className="card-cute md:col-span-2 p-6 flex items-center justify-between relative overflow-hidden bg-white/95 backdrop-blur-md">
            <div className="absolute top-3 right-4 opacity-25">
              <Tulip className="h-16 w-10 animate-sway" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" />
            </div>

            <div className="space-y-3 z-10 max-w-md">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                <Sparkles className="h-3.5 w-3.5" /> Cute · Secure · Thoughtful
              </span>
              <h1 className="font-display text-2xl font-bold sm:text-3xl">
                Welcome back, <span className="text-gradient">{displayName}</span>! 🌷
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "{currentQuote}"
              </p>
              <Button onClick={speakMaid} variant="outline" size="sm" className="rounded-full gap-2 border-purple-200 hover:bg-purple-50">
                <Volume2 className="h-4 w-4 text-primary" /> Talk to Maid Assistant
              </Button>
            </div>

            {/* Anime Maid Illustration Asset */}
            <div className="relative w-32 sm:w-40 flex-shrink-0 flex items-center justify-center">
              <img
                src={maidArt}
                alt="Cute maid assistant"
                className="w-28 sm:w-36 drop-shadow-xl animate-float pointer-events-none"
              />
            </div>
          </div>

          {/* Dynamic Birthday Countdown Card */}
          <div className="card-cute p-6 gradient-dream text-primary-foreground flex flex-col justify-between shadow-glow relative overflow-hidden">
            <div className="absolute bottom-2 right-2 opacity-20">
              <Tulip className="h-20 w-14 animate-sway" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" />
            </div>

            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-90 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Live Countdown
              </span>
              <Sparkles className="h-4 w-4" />
            </div>

            <div className="z-10">
              <h2 className="font-display text-xl font-bold mt-2">The Big Day 🎂</h2>
              <div className="grid grid-cols-4 gap-2 text-center my-4">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-2">
                  <span className="block text-xl font-extrabold">{timeLeft.days}</span>
                  <span className="text-[10px] uppercase font-medium opacity-90">Days</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-2">
                  <span className="block text-xl font-extrabold">{timeLeft.hours}</span>
                  <span className="text-[10px] uppercase font-medium opacity-90">Hours</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-2">
                  <span className="block text-xl font-extrabold">{timeLeft.minutes}</span>
                  <span className="text-[10px] uppercase font-medium opacity-90">Mins</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-2">
                  <span className="block text-xl font-extrabold">{timeLeft.seconds}</span>
                  <span className="text-[10px] uppercase font-medium opacity-90">Secs</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                import('canvas-confetti').then((confetti) => confetti.default())
              }}
              variant="secondary"
              className="w-full rounded-full gap-2 font-bold shadow-soft z-10"
            >
              <PartyPopper className="h-4 w-4" /> Trigger Confetti
            </Button>
          </div>

        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="card-cute p-1.5 flex gap-1 bg-white/80 backdrop-blur-md">
          {[
            { id: 'wishlist', label: '🎁 Wishlist' },
            { id: 'memories', label: '📸 Memories' },
            { id: 'game', label: '🎈 Mini-Game' },
            { id: 'garden', label: '🌷 Garden' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'gradient-dream text-primary-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Workspace Area */}
        <div className="card-cute p-6 md:p-8 min-h-[420px] bg-white/90 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-4 right-6 opacity-20 pointer-events-none">
            <Tulip className="h-16 w-11" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" />
          </div>
          {activeTab === 'wishlist' && <WishlistTab />}
          {activeTab === 'memories' && <MemoriesTab />}
          {activeTab === 'game' && <BalloonPopGame />}
          {activeTab === 'garden' && <InteractiveGarden />}
        </div>

      </main>

      <TulipBorder className="pb-8 pt-4 mt-8" />
    </div>
  )
}