import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Separator } from "@/components/ui/separator";

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
                }
              }
            },
            className: {
              container: 'space-y-4',
              divider: 'hidden',
              button: 'w-full',
              anchor: 'text-breath-inhale hover:text-breath-exhale',
              label: 'block text-sm font-medium text-breath-text mb-1',
              input: 'w-full px-3 py-2 border border-breath-border rounded-md focus:outline-none focus:ring-2 focus:ring-breath-inhale focus:border-transparent',
              message: 'text-sm text-red-500 mt-1',
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: "Don't have an account? Sign up",
              },
            },
          }}
          providers={["google"]}
          view="sign_in"
          showLinks={false}
          redirectTo={window.location.origin + "/app"}
          socialLayout="vertical"
        />
      </div>
    </div>
  );
}