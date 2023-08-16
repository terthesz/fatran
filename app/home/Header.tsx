'use client';

import Image from 'next/image';
import header_bg_image from '../../imgs/header.png';

import {
  FaInstagram as IG,
  FaFacebookF as FB,
  FaYoutube as YTB,
} from 'react-icons/fa';
import { useEffect, useState } from 'react';

const Header = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <section>
      <Image
        className="object-cover object-center"
        src={header_bg_image}
        fill={true}
        alt="header bg image"
        priority={true}
      />
      <div className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-[42%]"></div>

      {/* TODO: animation */}
      <div className="w-full h-full absolute left-0 top-0 flex flex-col justify-center pl-[1.5rem] lg:items-center text-white">
        <p
          className={`uppercase mb-[1rem] text-2xl relative transition-all duration-25 ${
            animate ? 'opacity-100 bottom-0' : 'opacity-0 -bottom-[20rem]'
          }`}
        >
          Víta ťa
        </p>
        <h1
          className={`uppercase text-7xl font-bold relative transition-all duration-50 ${
            animate ? 'opacity-100 bottom-0' : 'opacity-0 -bottom-[20rem]'
          }`}
        >
          37. zbor Fatran Martin
        </h1>
      </div>

      <div className="header-icons">
        <a href="https://www.instagram.com/37ickafatran/" target="_blank">
          <IG size="30px" />
        </a>
        <a
          href="https://www.facebook.com/slovenskyskauting.37zborFatran/"
          target="_blank"
        >
          <FB size="30px" />
        </a>
        <a
          href="https://www.youtube.com/channel/UCnMyQH-9_G_qp98jfn5CuvA"
          target="_blank"
        >
          <YTB size="30px" />
        </a>
      </div>
    </section>
  );
};

export default Header;
