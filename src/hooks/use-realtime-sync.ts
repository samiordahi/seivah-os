import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

export function useRealtimeSync() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    console.log('Setting up Supabase Realtime listeners...');

    // Listen to changes in memories table
    const memoriesChannel = supabase
      .channel('memories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'memories',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Memories change detected:', payload);
        }
      )
      .subscribe();

    // Listen to changes in transactions table
    const transactionsChannel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Transactions change detected:', payload);
          // This will trigger automatic UI updates in components that use this data
        }
      )
      .subscribe();

    // Listen to changes in connections table
    const connectionsChannel = supabase
      .channel('connections-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connections',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Connections change detected:', payload);
        }
      )
      .subscribe();

    // Listen to changes in profiles table
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Profile change detected:', payload);
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      console.log('Cleaning up Supabase Realtime listeners...');
      supabase.removeChannel(memoriesChannel);
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(connectionsChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, [user]);

  return {
    // Could return channel status or other realtime info if needed
  };
}