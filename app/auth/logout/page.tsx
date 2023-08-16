'use client';

import { getAuth, signOut } from 'firebase/auth';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const page: NextPage = () => {
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    signOut(auth).then(() => router.replace('/home'));
  }, []);

  return <>Logging out. . .</>;
};

export default page;
