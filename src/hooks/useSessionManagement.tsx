import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

export const useSessionManagement = () => {
  const queryClient = useQueryClient();

  const { data: todaySessions } = useQuery({
    queryKey: ['sessions', 'today'],
    queryFn: async () => {
      const today = new Date();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .gte('completed_at', startOfDay(today).toISOString())
        .lte('completed_at', endOfDay(today).toISOString())
        .eq('user_id', user.id);

      if (error) throw error;
      console.log('Today\'s sessions:', data);
      return data || [];
    },
  });

  const handleSessionComplete = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('sessions')
        .insert([{
          user_id: user.id
        }]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      console.log('Session recorded successfully');
    } catch (error) {
      console.error('Error recording session:', error);
      toast({
        title: "Error",
        description: "Failed to record session. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    todaySessions,
    handleSessionComplete
  };
};