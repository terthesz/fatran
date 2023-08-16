'use client';

import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useUser } from './firebase/authContext';
import Link from 'next/link';
import { HiCog as Settings } from 'react-icons/hi';
import { IoMdExit as Logout } from 'react-icons/io';
import navItems from '@/config/nav-items.json';

const Navbar = () => {
  const activeItem = useRef<number | null>(null);
  const items = useRef<Array<Element> | null>(null);
  const nav = useRef<HTMLDivElement | null>(null);
  const profileWrapper = useRef<HTMLDivElement | null>(null);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const user = useUser();

  //

  useLayoutEffect(() => {
    if (!nav.current) throw new Error('No nav element :(');
    if (!items.current)
      items.current = Array.from(nav.current.querySelectorAll('a'));

    const current_page = location.pathname.replaceAll('/', '').split('?')[0];

    const current_page_in_array = navItems.find(
      (item: any) => item.path.replace(' ', '-') === current_page
    );
    if (!current_page_in_array)
      throw new Error(`Could not find page ${current_page} in navbar.`);

    const current_page_index = navItems.indexOf(current_page_in_array);

    (items.current as Array<Element>)[current_page_index].classList.add(
      'active'
    );
    activeItem.current = current_page_index;
  }, []);

  useEffect(() => {
    const onClick = (event: any) => {
      if (!profileWrapper.current) return;
      if (profileWrapper.current.contains(event?.target)) return;

      setShowProfileMenu(false);
    };

    const onKeydown = (event: any) => {
      if (event.key === 'Escape' || event.keyCode === 27)
        setShowProfileMenu(false);
    };

    const onScroll = (e: Event) => {
      const scroll_pos = window.scrollY;

      if (scrolled && scroll_pos > 10) return;
      setScrolled(scroll_pos > 10);
    };

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeydown);
      window.removeEventListener('scroll', onScroll);

      setShowProfileMenu(false);
    };
  }, []);

  //

  return (
    <div
      className={`w-full fixed top-0 left-0 flex text-white z-50 py-[1.5rem] px-[3rem] transition-colors duration-100 ${
        scrolled ? 'scrolled' : ''
      }`}
    >
      <Link
        href="/domov"
        className="font-semibold tracking-wider cursor-pointer transition-all duration-100 hover:scale-105 active:scale-100"
      >
        Skauting ma baví!
      </Link>

      <nav ref={nav}>
        {navItems.map((item: any) => {
          return (
            <Link href={'/' + item.path} key={item.name}>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="flex gap-x-8 nav-auth absolute right-[3rem] top-1/2 -translate-y-1/2">
        {user ? (
          <>
            <div
              ref={profileWrapper}
              className="w-[2.5rem] relative text-black font-medium"
            >
              <p
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-full cursor-pointer transition-all duration-50 hover:scale-[1.08] grid place-items-center active:scale-[.92] aspect-square bg-white rounded-full"
              >
                {user.displayName
                  ?.split('_')
                  .map((str) => str.split('')[0].toUpperCase())
                  .join('')}
              </p>

              <div
                className={`absolute top-[3.5rem] right-0 ${
                  showProfileMenu ? 'visible' : 'hidden'
                }`}
              >
                <div className="absolute bg-white w-[1rem] aspect-square rounded-md rotate-45 -top-[.4rem] right-[.65rem] -z-10"></div>
                <div className="bg-white flex flex-col gap-y-2 rounded-md px-[1.2rem] py-[1rem]">
                  <Link
                    onClick={() => setShowProfileMenu(false)}
                    href="/user/settings"
                    className="!p-0 flex flex-row gap-[.3rem] items-center transition-all duration-100 hover:scale-[1.02] active:scale-[.98]"
                  >
                    <Settings size="23px" /> Nastavenia
                  </Link>

                  <hr />

                  <Link
                    onClick={() => setShowProfileMenu(false)}
                    href="/auth/logout"
                    className="!p-0 flex flex-row gap-[.3rem] items-center whitespace-nowrap text-red-500 duration-100 hover:scale-[1.02] active:scale-[.98]"
                  >
                    <Logout size="23px" /> Odhlásiť sa
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="border-2 border-white">
              Prihlásiť sa
            </Link>
            <Link href="/auth/register" className="bg-white text-gray-800">
              Registrovať sa
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
