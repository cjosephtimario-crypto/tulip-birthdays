import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Sparkles, Bell, Clock, UserPlus, LayoutDashboard } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { TulipBorder, TulipCorner } from "@/components/Tulips";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import tulipsArt from "@/assets/tulips.png";
import tulipHero from "@/assets/tulip-hero.jpg";

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
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const userDisplayName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || "Friend";

  return (
    <div className="min-h-screen relative bg-purple-50/30">
      <div className="relative z-30">
        <SiteHeader />
      </div>

      {/* Hero Section pinned as a sticky full-fold background card */}
      <section className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center -mt-20 pt-20 z-10">
        {/* Full fold image background */}
        <div className="absolute inset-0 z-0">
          <img
            src={tulipHero}
            alt="Tulip hero background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]"></div>
        </div>

        <TulipCorner className="top-16 left-10 -rotate-12 z-20" />
        <TulipCorner className="top-24 right-16 rotate-12 z-20" />

        <div className="relative z-20 mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-6 text-center lg:text-left bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/50">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/80 border border-purple-100 text-xs text-purple-700 font-medium mx-auto lg:mx-0 shadow-sm">
              <Shield className="w-3.5 h-3.5" />
              <span>Protected by encrypted accounts and row-level security</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold sm:text-6xl tracking-tight text-slate-900 dark:text-white">
              {session ? (
                <span>Welcome back, <span className="text-gradient">{userDisplayName}</span>!</span>
              ) : (
                <span>Never forget a special <span className="text-gradient">birthday</span> again</span>
              )}
            </h1>

            <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {session
                ? "Your countdown is active and running. Head straight to your dashboard to check your countdown status and wishlist."
                : "Tulip Birthdays keeps a live countdown to your big day, wakes you up with a calm morning reminder, and cheers you on with a sweet little companion surrounded by flowers."}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              {!loadingSession && session ? (
                <Button asChild size="lg" className="rounded-full px-8 py-3 gradient-dream text-white font-bold shadow-lg hover:scale-105 transition-transform">
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="rounded-full px-8 py-3 gradient-dream text-white font-bold shadow-lg hover:scale-105 transition-transform">
                    <Link to="/auth">Get started free</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-3 border-purple-200 hover:bg-purple-50 bg-white/70">
                    <Link to="/about">Our story</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="relative hidden lg:flex justify-center">
            <div className="card-cute p-6 sm:p-8 w-full max-w-md relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/50 shadow-2xl">
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
        </div>
      </section>

      {/* Main content container that climbs up / scrolls over the pinned hero image */}
      <main className="relative z-20 bg-purple-50/90 dark:bg-slate-950 rounded-t-[2.5rem] shadow-[0_-20px_40px_rgba(0,0,0,0.15)] px-4 py-16 sm:py-24 space-y-20 border-t border-white/50">
        {/* How It Works Section */}
        <section className="mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md py-6 px-4 rounded-3xl max-w-2xl mx-auto shadow-md border border-purple-100">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">How it works</h2>
            <p className="text-slate-700 dark:text-slate-200 max-w-xl mx-auto font-medium">
              Four gentle steps to read through before you sign up, so you always know what to expect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card-cute p-8 space-y-4 relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-lg border border-purple-100">
                <div className="w-12 h-12 rounded-2xl bg-purple-100/80 flex items-center justify-center text-purple-600">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-sm font-medium">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <TulipBorder className="my-8" />

        {/* Bottom Call to Action */}
        {!session && (
          <section className="mx-auto max-w-3xl text-center card-cute p-10 sm:p-14 space-y-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md relative overflow-hidden shadow-xl border border-purple-100">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Ready for your countdown?</h2>
            <p className="text-slate-700 dark:text-slate-200 max-w-md mx-auto font-medium">
              It takes less than a minute. Your birthday, your data, your celebration.
            </p>
            <div className="pt-2">
              <Button asChild size="lg" className="rounded-full px-10 py-3 gradient-dream text-white font-bold shadow-lg hover:scale-105 transition-transform">
                <Link to="/auth">Start your countdown</Link>
              </Button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}