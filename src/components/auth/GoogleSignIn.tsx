import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export const GoogleSignIn = () => {
  return (
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
          container: 'space-y-0',
          divider: 'hidden',
          button: 'w-full',
        }
      }}
      providers={["google"]}
      view="sign_in"
      showLinks={false}
      redirectTo={window.location.origin + "/app"}
      socialLayout="vertical"
    />
  );
};