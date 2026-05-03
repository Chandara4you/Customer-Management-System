// feat/rights-context — M4: Wayne Andy Villamor (Sprint 2)
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const UserRightsContext = createContext(null);

export function UserRightsProvider({ children }) {
  const { currentUser, profile } = useAuth();
  const [rights, setRights] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) {
      setRights({});
      setLoading(false);
      return;
    }

    async function loadRights() {
      const { data, error } = await supabase
        .from('UserModule_Rights')
        .select('right_code, right_value')
        .eq('userid', currentUser.id);

      if (error) {
        console.error('loadRights:', error);
        setRights({});
      } else {
        const map = {};
        data.forEach(r => { map[r.right_code] = r.right_value === 1; });
        setRights(map);
      }
      setLoading(false);
    }

    loadRights();
  }, [currentUser]);

  return (
    <UserRightsContext.Provider value={{ rights, loading, userType: profile?.user_type }}>
      {children}
    </UserRightsContext.Provider>
  );
}

export function useRights() {
  const ctx = useContext(UserRightsContext);
  if (!ctx) throw new Error('useRights must be used within <UserRightsProvider>');
  return ctx;
}
