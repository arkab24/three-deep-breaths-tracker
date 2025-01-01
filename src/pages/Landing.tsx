import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { EmailSignInForm } from "@/components/auth/EmailSignInForm";
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/app");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-breath-background p-4">
      <h1 className="text-4xl md:text-6xl font-bold text-breath-inhale mb-12 text-center">
        three deep breaths
      </h1>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-breath-border">
        <EmailSignInForm />
        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                OR
              </span>
            </div>
          </div>
          <GoogleSignIn />
        </div>
      </div>
    </div>
  );
}