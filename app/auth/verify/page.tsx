'use client';

import type { NextPage } from 'next';
import AuthCard from '../components/AuthCard';
import AuthForm from '../components/AuthForm';
import AuthCode from 'react-auth-code-input';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/firebase/authContext';

const page: NextPage = () => {
  const router = useRouter();
  const user = useUser();

  const codeInputRef = useRef(null);

  const [code, setCode] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorString, setErrorString] = useState<string | null>(null);

  const [canBeVerified, setCanBeVerified] = useState(false);

  useEffect(() => {
    if (user && !user.emailVerified) setCanBeVerified(true);
  }, [user]);

  useEffect(() => {
    if (canBeVerified) sendEmail();
  }, [canBeVerified]);

  function onChange(code: string) {
    setCode(code);
    setErrorString(null);
  }

  function onSubmit(e: any) {
    e.preventDefault();

    if (!code || code.length < 6)
      return setErrorString('Vpíšte celý 6-miestny číselný kód.');

    verify();
  }

  function sendEmail(force: boolean = false) {
    fetch(
      process.env.NEXT_PUBLIC_CURRENT_URL + `/api/auth/verify/?force=${force}`,
      {
        method: 'POST',
      }
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.isError)
          return resolveError(json.code, setErrorString, sendEmail);

        if (json.code == 'email-already-verified')
          return router.replace('/events');
      })
      .catch(() => {
        setErrorString('Niečo sa pokazilo. Skúste to znovu neskôr.');
      });
  }

  function verify() {
    setIsProcessing(true);

    fetch(
      (process.env.NEXT_PUBLIC_CURRENT_URL as string) +
        'api/auth/verify/' +
        code
    )
      .then((res) => res.json())
      .then((json) => {
        setIsProcessing(false);
        if (json.isError)
          return resolveError(json.code, setErrorString, sendEmail);

        (codeInputRef.current as any)?.clear();

        router.push('/events');
      })
      .catch(() => {
        setErrorString('Niečo sa pokazilo. Skúste to znovu neskôr.');
      });
  }

  return (
    <section className="grid place-items-center">
      <AuthCard>
        <h2 className="font-bold text-[1.4rem]">Overenie</h2>
        <p className="text-center text-sm text-gray-600">
          Poslali sme vám kód na e-mail. Zadajte
          <br />
          ho sem pre overenie.
        </p>

        <AuthForm onSubmit={onSubmit}>
          <AuthCode
            onChange={onChange}
            autoFocus={true}
            length={6}
            ref={codeInputRef}
            allowedCharacters="numeric"
            containerClassName="flex flex-row gap-[12px] verify-code !w-[20rem]"
          />

          {errorString ? (
            <p className="text-sm text-red-500 font-semibold whitespace-pre-line text-center mt-[.5rem]">
              {errorString}
            </p>
          ) : (
            <></>
          )}

          <button
            onClick={() => sendEmail(true)}
            type="button"
            className="mt-[2rem] text-blue-600 font-medium text-sm mb-[.3rem]"
          >
            Poslať znovu.
          </button>
          <button
            id="auth-form-submit"
            type="submit"
            className={`rounded-lg bg-[rgb(114,177,253)] w-[10rem] py-[.5rem] font-semibold text-[.95rem] text-gray-700 tracking-wider transition-all duration-150 ${
              code?.length == 6 ? 'good' : 'bad'
            } ${isProcessing ? 'disabled' : ''}`}
          >
            Ďalej
          </button>
        </AuthForm>
      </AuthCard>

      <div className="absolute right-0 bottom-0 w-full p-[1rem] flex justify-center sm:justify-end flex-row sm:gap-[1rem] text-xs md:text-sm font-medium text-gray-600">
        <p>
          Niečo nefunguje?<span className="sm:pr-[1rem]"> </span>Môžete nám
          napísať sem: <span className="text-blue-700">info@fatran.sk</span>
          <span className="sm:pr-[1rem]"> </span>alebo na sociálne sieťe
        </p>
      </div>
    </section>
  );
};

function resolveError(
  error: string,
  setError: Dispatch<SetStateAction<string | null>>,
  sendEmail: any
) {
  switch (error) {
    case 'invalid-verification-code':
      setError('Nesprávny kód. Skontrolujte ho a skúste znova.');
      break;
    case 'code-not-generated':
      setError('Kód sa nesprávne vygeneroval. Zaslali sme vám nový.');
      break;
    case 'code-expired':
      setError('Kód vypršal. Zaslali sme vám nový.');
      sendEmail();
      break;
    case 'rate-limited':
      setError('Príliš veľa žiadostí. Skúste to neskôr.');
      break;
    default:
      setError('Niečo sa pokazilo. Skúste to znovu neskôr.');
  }
}

export default page;
