import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tulip } from "@/components/Tulips";

export function SiteHeader() {
  const [signedIn, setSignedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  const linkClass =
    "rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:bg-accent hover:text-accent-foreground";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Tulip className="h-9 w-6" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" />
          <span className="font-display text-lg font-bold text-gradient sm:text-xl">
            Tulip Birthdays
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/" className={linkClass} activeProps={{ className: "bg-accent text-accent-foreground" }}>
            Home
          </Link>
          <Link
            to="/about"
            className={linkClass}
            activeProps={{ className: "bg-accent text-accent-foreground" }}
          >
            About Us
          </Link>
          {signedIn ? (
            <>
              <Link
                to="/dashboard"
                className={linkClass}
                activeProps={{ className: "bg-accent text-accent-foreground" }}
              >
                Dashboard
              </Link>
              <Button variant="outline" size="sm" className="rounded-full" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="rounded-full gradient-dream shadow-soft">
              <Link to="/auth">Login / Sign Up</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
