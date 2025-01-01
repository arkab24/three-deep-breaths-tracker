import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

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
            }
          }}
          providers={["google"]}
          view="sign_in"
          showLinks={true}
          redirectTo={window.location.origin + "/app"}
          socialLayout="vertical"
        />
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-breath-text">
              or
            </span>
          </div>
        </div>
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
            }
          }}
          providers={[]}
          view="sign_in"
          showLinks={true}
          redirectTo={window.location.origin + "/app"}
        />
      </div>
    </div>
  );
}