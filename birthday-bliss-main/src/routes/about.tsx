import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Lock, Users, Clock } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { TulipBorder, Tulip } from "@/components/Tulips";
import { Button } from "@/components/ui/button";
import tulipsArt from "@/assets/tulips.png";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Tulip Birthdays" },
      {
        name: "description",
        content:
          "Our mission: help people never miss or forget a special birthday moment, with a warm, private and beautifully simple reminder app.",
      },
      { property: "og:title", content: "About Us — Tulip Birthdays" },
      {
        property: "og:description",
        content: "Why we built a birthday reminder that feels like a handwritten note, not a calendar alert.",
      },
    ],
  }),
  component: About,
});

const values = [
  {
    icon: Heart,
    title: "Moments over notifications",
    text: "A birthday is a rare chance to make someone feel seen. Every screen is designed around protecting that warm feeling.",
  },
  {
    icon: Clock,
    title: "Gentle and right on time",
    text: "You get one calm reminder at six in the morning local time, which is early enough to plan something nice and quiet enough to never feel like nagging.",
  },
  {
    icon: Lock,
    title: "Private by default",
    text: "Your data is encrypted and secure, meaning your birthday lists belong strictly to you. They are never sold and never shared.",
  },
  {
    icon: Users,
    title: "Made for everyone",
    text: "Clean fonts, comfortable spacing, and a responsive layout mean it looks lovely whether you are checking it on your phone during breakfast or a laptop at work.",
  },
];

function About() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Scattered varying background tulips */}
      <div className="absolute top-10 left-8 opacity-35 pointer-events-none hidden lg:block">
        <Tulip className="h-28 w-20 animate-float" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" />
      </div>
      <div className="absolute top-28 right-12 opacity-30 pointer-events-none hidden lg:block">
        <Tulip className="h-16 w-12 animate-float" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "1s" }} />
      </div>
      <div className="absolute top-[35rem] left-6 opacity-25 pointer-events-none hidden lg:block">
        <Tulip className="h-36 w-24 animate-float" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "0.5s" }} />
      </div>
      <div className="absolute top-[40rem] right-10 opacity-30 pointer-events-none hidden lg:block">
        <Tulip className="h-20 w-14 animate-float" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" style={{ animationDelay: "1.5s" }} />
      </div>
      <div className="absolute bottom-36 left-16 opacity-30 pointer-events-none hidden lg:block">
        <Tulip className="h-24 w-16 animate-float" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" style={{ animationDelay: "2s" }} />
      </div>
      <div className="absolute bottom-24 right-20 opacity-35 pointer-events-none hidden lg:block">
        <Tulip className="h-32 w-22 animate-float" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "0.8s" }} />
      </div>

      <SiteHeader />

      <main className="px-4 py-12 relative z-10">
        <section className="mx-auto max-w-4xl text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Tulip className="h-14 w-10 animate-sway opacity-90" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" />
            <Tulip className="h-20 w-14 animate-sway" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "0.2s" }} />
            <Tulip className="h-24 w-16 animate-sway" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" style={{ animationDelay: "0.4s" }} />
            <Tulip className="h-20 w-14 animate-sway" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "0.6s" }} />
            <Tulip className="h-14 w-10 animate-sway opacity-90" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" style={{ animationDelay: "0.8s" }} />
          </div>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
            The world exists so no one feels <span className="text-gradient">forgotten</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Tulip Birthdays started from a simple missed call and a late happy birthday text. The world needed something
            warmer than a calendar app, a little companion that counts down with you, keeps track of birthdays on your behalf,
            and makes the day itself feel truly special.
          </p>
        </section>

        <TulipBorder className="my-10" />

        <section className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2">
          {values.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className="card-cute p-6 relative overflow-hidden">
              <div className="absolute top-3 right-4 opacity-25 pointer-events-none">
                <Tulip 
                  className={index % 2 === 0 ? "h-12 w-8" : "h-16 w-10"} 
                  bloom={index % 2 === 0 ? "var(--tulip-purple)" : "var(--tulip-blue)"} 
                  stem="var(--tulip-stem)" 
                />
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-petal text-petal-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </section>

        <TulipBorder className="my-10" />

        <section className="mx-auto mt-8 grid max-w-5xl items-center gap-8 md:grid-cols-2">
          <div className="card-cute p-6 flex justify-center relative overflow-hidden">
            <div className="absolute top-4 left-4 opacity-30 pointer-events-none">
              <Tulip className="h-20 w-14 animate-sway" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" />
            </div>
            <div className="absolute bottom-4 right-4 opacity-30 pointer-events-none">
              <Tulip className="h-20 w-14 animate-sway" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "0.5s" }} />
            </div>
            <img
              src={tulipsArt}
              alt="Illustrated bouquet of pastel blue and purple tulips"
              loading="lazy"
              width={1024}
              height={768}
              className="mx-auto w-full max-w-xs"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold">Why tulips?</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Tulips come back faithfully every single year right on schedule, which is exactly what a good reminder
              should do. Blue stands for calm, purple represents celebration, and there is a bloom for every person worth
              remembering, especially the one who inspired this whole little world.
            </p>
            {!isLoggedIn && (
              <Button asChild size="lg" className="mt-6 rounded-full gradient-dream shadow-soft">
                <Link to="/auth">Start your countdown</Link>
              </Button>
            )}
          </div>
        </section>
      </main>

      <TulipBorder className="pb-8 pt-4" />
    </div>
  );
}