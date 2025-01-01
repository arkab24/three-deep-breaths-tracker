import { useQuery } from "@tanstack/react-query";
import { startOfYear, endOfYear } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export const useYearlySessions = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          throw error;
        }
        if (!session) {
          console.log("No active session found");
          await supabase.auth.signOut();
          navigate('/');
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check error:", error);
        await supabase.auth.signOut();
        navigate('/');
        toast({
          title: "Session Error",
          description: "Please sign in again",
          variant: "destructive",
        });
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        await supabase.auth.signOut();
        navigate('/');
      } else if (session) {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const yearStart = startOfYear(new Date());
  const yearEnd = endOfYear(new Date());

  const { data: sessions } = useQuery({
    queryKey: ['sessions', 'yearly'],
    queryFn: async () => {
      if (!isAuthenticated) {
        console.log('User not authenticated, skipping query');
        return [];
      }

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('User fetch error:', userError);
          throw userError;
        }

        console.log('Fetching yearly sessions...');
        const { data, error } = await supabase
          .from('sessions')
          .select('completed_at')
          .gte('completed_at', yearStart.toISOString())
          .lte('completed_at', yearEnd.toISOString());

        if (error) {
          console.error('Error fetching sessions:', error);
          if (error.message.includes('JWT expired') || error.message.includes('session_not_found')) {
            await supabase.auth.signOut();
            navigate('/');
          }
          throw error;
        }

        console.log('Yearly sessions data:', data);
        return data || [];
      } catch (error) {
        console.error('Session fetch error:', error);
        await supabase.auth.signOut();
        navigate('/');
        return [];
      }
    },
    enabled: isAuthenticated,
    retry: false,
  });

  return { sessions, isAuthenticated, yearStart, yearEnd };
};