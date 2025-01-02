import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export const EmailSignInForm = () => {
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
          container: 'space-y-4',
          divider: 'hidden',
          button: 'w-full',
          anchor: 'text-breath-inhale hover:text-breath-exhale',
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
          sign_up: {
            email_label: 'Email',
            password_label: 'Password',
            button_label: 'Sign up',
            loading_button_label: 'Signing up...',
            social_provider_text: 'Sign up with {{provider}}',
            link_text: 'Have an account? Sign in',
          },
        },
      }}
      providers={[]}
      view="sign_in"
      showLinks={true}
      redirectTo={window.location.origin + "/app"}
    />
  );
};