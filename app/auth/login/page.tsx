'use client';

import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import {
  Dispatch,
  FormEvent,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import * as AuthManager from '@/app/firebase/auth';
import AuthField from '../components/AuthField';
import AuthCard from '../components/AuthCard';
import AuthForm from '../components/AuthForm';

const page: NextPage = () => {
  const router = useRouter();

  const [noFieldsEmpty, setNoFieldsEmpty] = useState(false);
  const [errorString, setErrorString] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const emailField = useRef<HTMLInputElement | null>(null);
  const passwdField = useRef<HTMLInputElement | null>(null);

  //

  function onChange() {
    if (!emailField.current?.value || !passwdField.current?.value)
      setNoFieldsEmpty(false);
    else setNoFieldsEmpty(true);

    setErrorString(null);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!noFieldsEmpty)
      return setErrorString('E-mail ani heslo nemôžu byť prázdne.');

    signIn();
  }

  function signIn() {
    setIsProcessing(true);

    const email = (emailField as MutableRefObject<HTMLInputElement>).current
      .value;
    const passwd = (passwdField as MutableRefObject<HTMLInputElement>).current
      .value;

    AuthManager.signIn(email, passwd)
      .then((user) => {
        if (!user.emailVerified) return router.replace('/auth/verify');
        router.replace('/home');
      })
      .catch((error) => {
        setIsProcessing(false);

        resolveError(error, setErrorString);
      });
  }

  return (
    <section
      id="auth-wrapper"
      className={`grid place-items-center w-full h-full ${
        errorString ? 'error' : ''
      }`}
    >
      <AuthCard>
        <h2 className="font-bold text-[1.4rem]">Prihlásenie</h2>
        <p className="text-sm text-gray-600">
          Prihláste sa pre prístup k uzamknutým
          <br />
          funkciam.
        </p>

        <AuthForm onSubmit={onSubmit}>
          <AuthField
            id="email"
            placeholder="palo.palicka@gmail.com"
            onChange={onChange}
            fieldRef={emailField}
          >
            E-mail
          </AuthField>

          <AuthField
            id="passwd"
            type="password"
            placeholder="SuperSilneHeslo14*"
            onChange={onChange}
            fieldRef={passwdField}
          >
            Heslo
          </AuthField>

          {errorString ? (
            <p className="text-sm text-red-500 font-semibold whitespace-pre-line text-center">
              {errorString}
            </p>
          ) : (
            <></>
          )}

          <p className="text-sm text-gray-600 mt-[1.5rem]">
            Ešte nemáte účet? Tak sa{' '}
            <a className="text-blue-600 font-medium" href="/auth/register">
              zaregistrujte.
            </a>
          </p>

          <button
            id="auth-form-submit"
            type="submit"
            className={`mt-[.5rem] rounded-lg bg-[rgb(114,177,253)] w-[10rem] py-[.5rem] font-semibold text-[.95rem] text-gray-700 tracking-wider transition-all duration-150 ${
              noFieldsEmpty ? 'good' : 'bad'
            } ${isProcessing ? 'disabled' : ''}`}
          >
            Prihlásiť sa
          </button>
        </AuthForm>
      </AuthCard>
    </section>
  );
};

function resolveError(error: string, setError: Dispatch<SetStateAction<any>>) {
  if (
    [
      'invalid-email',
      'invalid-password',
      'wrong-password',
      'user-not-found',
    ].includes(error)
  )
    return setError('E-mail alebo heslo sú nesprávne.');

  switch (error) {
    case 'user-disabled':
      setError('Účet je zablokovaný.');
      break;
    case 'too-many-attempts':
      setError('Príliš veľa pokusov. \nSkúste znovu o chvíľu.');
      break;
    case 'too-many-requests':
      setError('Príliš veľa pokusov. \nSkúste znovu o chvíľu.');
      break;
    default:
      setError('Niekde nastala chyba.\nSkúste to znovu neskôr.');
  }
}

export default page;
