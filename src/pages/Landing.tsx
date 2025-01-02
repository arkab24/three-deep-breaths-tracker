import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '@/integrations/supabase/client';
import { GoogleSignIn } from '@/components/auth/GoogleSignIn';

export default function Landing({ navigation }) {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigation.replace('App');
      }
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>three deep breaths</Text>
      <View style={styles.authContainer}>
        <GoogleSignIn />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#008489',
    marginBottom: 48,
    textAlign: 'center',
  },
  authContainer: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});