import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TulipBorder, Tulip, TulipCorner } from "@/components/Tulips";
import { SiteHeader } from "@/components/SiteHeader";
import { Sparkles, Heart } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate({ to: "/dashboard" });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            birthday: birthday,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
      } else {
        navigate({ to: "/dashboard" });
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
      } else {
        navigate({ to: "/dashboard" });
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
      {/* Super abundant scattered background tulips */}
      <div className="absolute top-12 left-8 opacity-40 pointer-events-none hidden lg:block">
        <Tulip className="h-32 w-24 animate-float" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" />
      </div>
      <div className="absolute top-20 right-16 opacity-35 pointer-events-none hidden lg:block">
        <Tulip className="h-20 w-14 animate-float" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "1s" }} />
      </div>
      <div className="absolute top-[28rem] left-10 opacity-30 pointer-events-none hidden lg:block">
        <Tulip className="h-40 w-28 animate-float" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "0.5s" }} />
      </div>
      <div className="absolute top-[32rem] right-12 opacity-35 pointer-events-none hidden lg:block">
        <Tulip className="h-28 w-20 animate-float" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" style={{ animationDelay: "1.5s" }} />
      </div>
      <div className="absolute bottom-24 left-14 opacity-35 pointer-events-none hidden lg:block">
        <Tulip className="h-24 w-16 animate-float" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" style={{ animationDelay: "2s" }} />
      </div>
      <div className="absolute bottom-16 right-20 opacity-40 pointer-events-none hidden lg:block">
        <Tulip className="h-36 w-24 animate-float" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "0.8s" }} />
      </div>

      <TulipCorner className="top-10 left-6 -rotate-12" />
      <TulipCorner className="top-24 right-8 rotate-12" />

      <div>
        <SiteHeader />

        <main className="px-4 py-12 relative z-10 flex items-center justify-center">
          <div className="w-full max-w-md card-cute p-8 relative overflow-hidden bg-white/95 backdrop-blur-md shadow-xl">
            {/* Corner flowers inside the auth card */}
            <div className="absolute -top-3 -right-3 opacity-30 pointer-events-none">
              <Tulip className="h-16 w-12 animate-sway" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" />
            </div>
            <div className="absolute -bottom-3 -left-3 opacity-30 pointer-events-none">
              <Tulip className="h-20 w-14 animate-sway" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "0.4s" }} />
            </div>

            <div className="text-center mb-6 space-y-2">
              <div className="flex justify-center items-center gap-2 mb-1">
                <Tulip className="h-10 w-7 animate-sway" bloom="var(--tulip-purple)" stem="var(--tulip-stem)" />
                <Sparkles className="w-6 h-6 text-purple-600" />
                <Tulip className="h-10 w-7 animate-sway" bloom="var(--tulip-blue)" stem="var(--tulip-stem)" style={{ animationDelay: "0.3s" }} />
              </div>
              <h1 className="font-display text-2xl font-bold">
                {isSignUp ? "Create your account" : "Welcome back"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isSignUp
                  ? "Start your countdown to a very special day."
                  : "Sign in to check your live countdown."}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="rounded-xl border-purple-100 focus:border-purple-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="rounded-xl border-purple-100 focus:border-purple-300"
                    />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <Label htmlFor="birthday">Your birthday</Label>
                    <Input
                      id="birthday"
                      type="date"
                      required
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="rounded-xl border-purple-100 focus:border-purple-300"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="rounded-xl border-purple-100 focus:border-purple-300"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl border-purple-100 focus:border-purple-300"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full gradient-dream text-white font-bold py-2.5 shadow-md hover:scale-[1.02] transition-transform"
              >
                {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Need an account? Create one"}
              </button>
            </div>
          </div>
        </main>
      </div>

      <TulipBorder className="pb-8 pt-4" />
    </div>
  );
}