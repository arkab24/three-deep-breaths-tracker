import { BreathingCircle } from "@/components/BreathingCircle";
import { SessionsTracker } from "@/components/SessionsTracker";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="flex-1 container max-w-lg mx-auto p-4 md:p-6 space-y-6 md:space-y-8 min-h-screen bg-breath-background flex flex-col">
      <div className="flex-1">
        <BreathingCircle />
        <SessionsTracker />
      </div>
      <div className="flex justify-center pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-breath-text hover:text-breath-inhale"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </main>
  );
};

export default Index;