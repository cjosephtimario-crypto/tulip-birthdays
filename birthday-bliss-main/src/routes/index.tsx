import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Sparkles, Bell, Clock, UserPlus } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { TulipBorder, Tulip, TulipCorner } from "@/components/Tulips";
import { Button } from "@/components/ui/button";
import tulipsArt from "@/assets/tulips.png";

export const Route = createFileRoute("/")({
  component: Home,
});

const steps = [
  {
    icon: UserPlus,
    title: "Create your account",
    text: "Sign up with your name, birthday, and a password. Your details stay safe and belong only to you.",
  },
  {
    icon: Clock,
    title: "Watch your countdown",
    text: "Your dashboard shows the days, hours, minutes, and seconds until your next big moment, ticking live right beside you.",
  },
  {
    icon: Bell,
    title: "Turn on morning reminders",
    text: "Tap the reminder button to allow notifications. Every morning at six, you will get a gentle nudge showing how many days are left.",
  },
  {
    icon: Sparkles,
    title: "Celebrate the big day",
    text: "When your birthday finally arrives, the dashboard bursts into confetti with a cheerful chime to make you feel truly special.",
  },
];

function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Scattered varying background tulips */}
      <div className="absolute top-8 left-6 opacity-35 pointer-events-none hidden lg:block">
        <Tulip className="h-28 w-20 animate-float" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" />
      </div>
      <div className="absolute top-24 right-12 opacity-30 pointer-events-none hidden lg:block">
        <Tulip className="h-16 w-12 animate-float" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "1s" }} />
      </div>
      <div className="absolute top-96 left-4 opacity-25 pointer-events-none hidden lg:block">
        <Tulip className="h-36 w-24 animate-float" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "0.5s" }} />
      </div>
      <div className="absolute top-[32rem] right-8 opacity-30 pointer-events-none hidden lg:block">
        <Tulip className="h-20 w-14 animate-float" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" style={{ animationDelay: "1.5s" }} />
      </div>
      <div className="absolute bottom-32 left-16 opacity-30 pointer-events-none hidden lg:block">
        <Tulip className="h-24 w-16 animate-float" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" style={{ animationDelay: "2s" }} />
      </div>
      <div className="absolute bottom-20 right-20 opacity-35 pointer-events-none hidden lg:block">
        <Tulip className="h-32 w-22 animate-float" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "0.8s" }} />
      </div>

      <TulipCorner className="top-12 left-10 -rotate-12" />
      <TulipCorner className="top-36 right-16 rotate-12" />
      
      <SiteHeader />

      <main className="px-4 py-8 sm:py-16 relative z-10">
        {/* Hero Section */}
        <section className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-xs text-purple-700 font-medium mx-auto lg:mx-0 shadow-sm">
              <Shield className="w-3.5 h-3.5" />
              <span>Protected by encrypted accounts and row-level security</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold sm:text-6xl tracking-tight">
              Never forget a special <span className="text-gradient">birthday</span> again
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Tulip Birthdays keeps a live countdown to your big day, wakes you up with a calm morning reminder, and cheers you on with a sweet little companion surrounded by flowers.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Button asChild size="lg" className="rounded-full px-8 py-3 gradient-dream text-white font-bold shadow-lg hover:scale-105 transition-transform">
                <Link to="/auth">Get started free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-3 border-purple-200 hover:bg-purple-50">
                <Link to="/about">Our story</Link>
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute -top-6 -right-6 opacity-40">
              <Tulip className="h-16 w-12 animate-sway" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" />
            </div>
            <div className="absolute -bottom-6 -left-6 opacity-40">
              <Tulip className="h-20 w-14 animate-sway" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "0.5s" }} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-3xl filter blur-xl opacity-60 -z-10"></div>
            <div className="card-cute p-6 sm:p-8 w-full max-w-md relative">
              <img
                src={tulipsArt}
                alt="Illustrated bouquet of pastel blue and purple tulips"
                loading="lazy"
                width={1024}
                height={768}
                className="mx-auto w-full max-w-xs"
              />
            </div>
          </div>
        </section>

        <TulipBorder className="my-16" />

        {/* How It Works Section */}
        <section className="mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">How it works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Four gentle steps to read through before you sign up, so you always know what to expect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="card-cute p-8 space-y-4 relative overflow-hidden">
                <div className="absolute top-3 right-4 opacity-25">
                  <Tulip 
                    className={index % 2 === 0 ? "h-12 w-8" : "h-16 w-10"} 
                    bloom={index % 2 === 0 ? "var(--tulip-purple)" : "var(--tulip-blue)"} 
                    stem="var(--tulip-stem)" 
                  />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <TulipBorder className="my-16" />

        {/* Bottom Call to Action */}
        <section className="mx-auto max-w-3xl text-center card-cute p-10 sm:p-14 space-y-6 bg-white/90 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-4 left-6 opacity-30">
            <Tulip className="h-14 w-10 animate-sway" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" />
          </div>
          <div className="absolute bottom-4 right-6 opacity-30">
            <Tulip className="h-16 w-11 animate-sway" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" style={{ animationDelay: "0.7s" }} />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">Ready for your countdown?</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            It takes less than a minute. Your birthday, your data, your celebration.
          </p>
          <div className="pt-2">
            <Button asChild size="lg" className="rounded-full px-10 py-3 gradient-dream text-white font-bold shadow-lg hover:scale-105 transition-transform">
              <Link to="/auth">Start your countdown</Link>
            </Button>
          </div>
        </section>
      </main>

      <TulipBorder className="pb-8 pt-4" />
    </div>
  );
}