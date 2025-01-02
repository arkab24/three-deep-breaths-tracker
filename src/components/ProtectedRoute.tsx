import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { supabase } from '@/integrations/supabase/client';
import Index from '@/pages/Index';

export default function ProtectedRoute({ navigation }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session ? "Session exists" : "No session");
        
        if (!session) {
          console.log("No session found, redirecting to login");
          navigation.replace('Landing');
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        navigation.replace('Landing');
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session ? "Session exists" : "No session");
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in");
      } else if (event === 'SIGNED_OUT' || !session) {
        console.log("User signed out or session expired, redirecting to login");
        navigation.replace('Landing');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F8F8' }}>
        <ActivityIndicator size="large" color="#008489" />
      </View>
    );
  }

  return <Index />;
}