'use client';

import { usePathname } from 'next/navigation';
import './firebase/firebase';
import { AuthContextProvider } from './firebase/authContext';
import { useEffect, useLayoutEffect, useState } from 'react';
import Navbar from './Navbar';
import HamburgerNav from './HamburgerNav';

const paths_without_nav = ['auth'];

const ClientLayout = ({ children }: any) => {
  const pathname = usePathname();
  const path = pathname.split('/')[1];

  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    const resized = () => {
      setWindowWidth(window.innerWidth);
    };
    resized();

    window.addEventListener('resize', resized);

    return () => {
      window.removeEventListener('resize', resized);
    };
  }, []);

  return (
    <AuthContextProvider>
      {paths_without_nav.includes(path) ? (
        <></>
      ) : (
        <>{(windowWidth as number) <= 1100 ? <HamburgerNav /> : <Navbar />}</>
      )}
      {children}
    </AuthContextProvider>
  );
};

export default ClientLayout;
