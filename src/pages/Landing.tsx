import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
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
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#008489',
                  brandAccent: '#00A699',
                  brandButtonText: 'white',
                  defaultButtonBackground: '#F8F8F8',
                  defaultButtonBackgroundHover: '#EBEBEB',
                  inputBackground: 'white',
                  inputBorder: '#EBEBEB',
                  inputBorderHover: '#008489',
                  inputBorderFocus: '#00A699',
                }
              }
            },
            className: {
              divider: 'my-4'
            }
          }}
          providers={["google"]}
          redirectTo={window.location.origin + "/app"}
          view="sign_in"
        />
      </div>
    </div>
  );
}