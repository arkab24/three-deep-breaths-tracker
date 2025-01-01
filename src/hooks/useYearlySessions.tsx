import { useQuery } from "@tanstack/react-query";
import { startOfYear, endOfYear } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const useYearlySessions = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/');
      } else {
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

      console.log('Fetching yearly sessions...');
      const { data, error } = await supabase
        .from('sessions')
        .select('completed_at')
        .gte('completed_at', yearStart.toISOString())
        .lte('completed_at', yearEnd.toISOString());

      if (error) {
        console.error('Error fetching sessions:', error);
        if (error.message.includes('JWT expired')) {
          navigate('/');
        }
        throw error;
      }

      console.log('Yearly sessions data:', data);
      return data || [];
    },
    enabled: isAuthenticated,
  });

  return { sessions, isAuthenticated, yearStart, yearEnd };
};