import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Separator } from "@/components/ui/separator";

export const GoogleSignIn = () => {
  return (
    <>
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
          },
        }}
        view="sign_in"
        showLinks={true}
        redirectTo={window.location.origin + "/app"}
        socialLayout="vertical"
      />
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
              container: '',
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
      </div>
    </>
  );
};