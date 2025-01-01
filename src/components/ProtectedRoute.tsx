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
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Initial session check:", session ? "Session exists" : "No session");
        
        if (!session || error) {
          console.log("No valid session found, redirecting to login");
          // Clear any existing session data
          await supabase.auth.signOut();
          navigate("/");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        // On any error, safely redirect to login
        await supabase.auth.signOut();
        navigate("/");
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session ? "Session exists" : "No session");
      
      if (event === 'SIGNED_OUT' || !session) {
        console.log("User signed out or session expired, redirecting to login");
        // Ensure clean logout
        await supabase.auth.signOut();
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