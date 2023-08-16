import { User, getAuth } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';

const AuthContext = createContext<User | null>(null);

export const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>();
  const auth = getAuth();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) return setUser(null);

      setUser(user);

      const token = await user.getIdToken();
      document.cookie = `auth=${token}; path=/;`;
    });
  }, []);

  return (
    <AuthContext.Provider value={user as User}>{children}</AuthContext.Provider>
  );
};

export const useUser = () => useContext(AuthContext);
