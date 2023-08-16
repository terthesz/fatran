'use client';

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { BsArrowLeft as ArrowLeft } from 'react-icons/bs';

const layout: NextPage = ({ children }: any) => {
  const router = useRouter();
  const auth = getAuth();

  const pathname = usePathname();
  const [path, setPath] = useState<string>();

  useEffect(() => {
    setPath(pathname.split('/')[2]);
  }, [pathname]);

  useEffect(() => {
    if (!path) return;

    auth.authStateReady().then(() => {
      const user = auth.currentUser;

      if (
        (user && path !== 'verify') ||
        (user?.emailVerified == true && path === 'verify')
      )
        router.push('/events');

      if (!user && path === 'verify') router.push('/home');
    });
  }, [path]);

  return (
    <>
      <div className="w-[100%] h-[100%] absolute">
        <button
          onClick={() => router.back()}
          id="auth-layout-back"
          className="absolute cursor-pointer z-50 left-0 top-0 p-[1rem] flex flex-row text-gray-700 items-center"
        >
          <ArrowLeft
            size="30px"
            className="pointer-events-none transition-all duration-100"
          />
          <p className="relative pointer-events-none font-semibold -left-[7rem] opacity-0 transition-all duration-300">
            Vrátiť sa späť.
          </p>
        </button>

        {children}
      </div>
    </>
  );
};

export default layout;
