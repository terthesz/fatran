import navItems from '@/config/nav-items.json';
import Hamburger from 'hamburger-react';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useUser } from './firebase/authContext';
import { HiCog as Settings } from 'react-icons/hi';
import { IoMdExit as Logout } from 'react-icons/io';

const HamburgerNav = () => {
  const activeItem = useRef<number | null>(null);
  const navigation = useRef<HTMLDivElement | null>(null);
  const items = useRef<Array<Element> | null>(null);

  const hamburgerNavWrapper = useRef<HTMLDivElement | null>(null);
  const hamburger = useRef<HTMLDivElement | null>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = useUser();

  useLayoutEffect(() => {
    if (!navigation.current) throw new Error('No nav element :(');
    if (!items.current)
      items.current = Array.from(navigation.current.querySelectorAll('a'));

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
      if (!hamburgerNavWrapper.current || !hamburger.current) return;
      if (
        hamburgerNavWrapper.current.contains(event?.target) ||
        hamburger.current.contains(event?.target)
      )
        return;

      setIsMenuOpen(false);
    };

    const onScroll = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };

    document.addEventListener('click', onClick);
    document.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <div
        ref={hamburger}
        className="absolute right-0 top-0 z-50 text-white p-[.5rem]"
      >
        <Hamburger
          rounded
          size={30}
          toggled={isMenuOpen}
          onToggle={setIsMenuOpen}
          color={isMenuOpen ? 'black' : 'white'}
        />
      </div>

      <div
        id="hamburger-nav"
        ref={hamburgerNavWrapper}
        className={`bg-white fixed w-[90%] h-full top-0 z-40 flex flex-col justify-center transition-all duration-100 items-center ${
          isMenuOpen ? 'right-0' : '-right-[100%]'
        }`}
      >
        <Link
          href="/domov"
          className="text-lg font-semibold tracking-wider cursor-pointer transition-all duration-100 hover:scale-105 active:scale-100"
        >
          Skauting ma baví!
        </Link>
        <hr />

        <div
          ref={navigation}
          className="flex flex-col gap-y-[.3rem] text-center py-[1rem]"
        >
          {navItems.map((item) => {
            return (
              <Link key={item.name} className="text-lg" href={'/' + item.path}>
                {item.name}
              </Link>
            );
          })}
        </div>
        <hr />
        {user ? (
          <>
            <div className="absolute left-[1rem] top-[1rem]">
              <p className="font-semibold">
                {user.displayName
                  ?.split('_')
                  .map((str) => str.split('')[0].toUpperCase())
                  .join('')}
              </p>
            </div>

            <Link
              href="/user/settings"
              className="border-2 flex flex-row border-gray-800 font-semibold px-[2rem] py-[.5rem] rounded-lg mb-[.5rem]"
            >
              <Settings size="23px" /> Nastavenia
            </Link>
            <Link
              href="/auth/logout"
              className="border-2 flex flex-row text-red-500 border-red-400 font-semibold px-[2rem] py-[.5rem] rounded-lg mb-[.5rem]"
            >
              <Logout size="23px" /> Odhlásiť sa
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="border-2 border-gray-800 font-semibold px-[2rem] py-[.5rem] rounded-lg mb-[.5rem]"
            >
              Prihlásiť sa
            </Link>
            <Link
              href="/auth/register"
              className="bg-gray-800 text-white font-semibold px-[2rem] py-[.5rem] rounded-lg border-2 border-gray-800"
            >
              Registrovať sa
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default HamburgerNav;
