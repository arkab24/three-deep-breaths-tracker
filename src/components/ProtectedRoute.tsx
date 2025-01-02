import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session ? "Session exists" : "No session");
        
        if (!session) {
          console.log("No session found, redirecting to login");
          navigate("/");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        navigate("/");
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session ? "Session exists" : "No session");
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, navigating to app");
        navigate("/app");
      } else if (event === 'SIGNED_OUT' || !session) {
        console.log("User signed out or session expired, redirecting to login");
        navigate("/");
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-breath-background">
        <div className="animate-pulse text-breath-text">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}