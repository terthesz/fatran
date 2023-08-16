'use client';

import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import * as AuthManager from '@/app/firebase/auth';
import AuthField from '../components/AuthField';
import AuthCard from '../components/AuthCard';
import AuthForm from '../components/AuthForm';

const page: NextPage = () => {
  const router = useRouter();

  const [noFieldsEmpty, setNoFieldsEmpty] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showUnknownError, setShowUnknownError] = useState(false);
  const unknownErrorElement = useRef<HTMLParagraphElement | null>(null);

  // #region Refs

  const nameFieldWrapper = useRef<HTMLDivElement | null>(null);
  const surnameFieldWrapper = useRef<HTMLDivElement | null>(null);
  const emailFieldWrapper = useRef<HTMLDivElement | null>(null);
  const passwdFieldWrapper = useRef<HTMLDivElement | null>(null);

  const nameField = useRef<HTMLInputElement | null>(null);
  const surnameField = useRef<HTMLInputElement | null>(null);
  const emailField = useRef<HTMLInputElement | null>(null);
  const passwdField = useRef<HTMLInputElement | null>(null);
  // #endregion

  const onChange = (e: ChangeEvent) => {
    const fieldWrapper = e.target.parentElement;

    if (fieldWrapper?.classList.contains('error'))
      fieldWrapper.classList.remove('error');

    if (showUnknownError) setShowUnknownError(false);

    if (
      !nameField.current?.value ||
      !surnameField.current?.value ||
      !emailField.current?.value ||
      !passwdField.current?.value
    )
      return setNoFieldsEmpty(false);
    setNoFieldsEmpty(true);
  };

  const setFieldError = (wrapper: any, error: string) => {
    wrapper.style.setProperty('--error', `"${error}"`);
    wrapper.classList.add('error');
  };

  const resolveError = (error: string) => {
    switch (error) {
      case 'invalid-email':
        setFieldError(emailFieldWrapper.current, 'Neplatný email.');
        break;
      case 'email-already-in-use':
        setFieldError(
          emailFieldWrapper.current,
          'Email už je obsadený. Ak to je váš email, skúste sa prihlásiť.'
        );
        break;
      default:
        setShowUnknownError(true);
    }
  };

  const onSubmit = (e: any) => {
    e.preventDefault();

    if (!noFieldsEmpty) {
      [nameField, emailField, passwdField, surnameField].map((field, index) => {
        if (field.current?.value) return;

        const wrapper = [
          nameFieldWrapper,
          emailFieldWrapper,
          passwdFieldWrapper,
          surnameFieldWrapper,
        ][index].current as HTMLInputElement;

        setFieldError(wrapper, 'Pole nesmie byť prázdne.');
      });

      return;
    }

    // #region Validation
    const passwd = passwdField.current?.value as string;
    const name = nameField.current?.value as string;
    const surname = surnameField.current?.value as string;

    if (passwd.length < 8)
      return setFieldError(
        passwdFieldWrapper.current,
        'Slabé heslo. Heslo musí mať aspoň 8 znakov.'
      );

    if (name.length > 30 || /[0-9\s]/g.test(name))
      return setFieldError(
        nameFieldWrapper.current,
        'Neplatné meno. Meno nemôže obsahovať čísla ani mezdery a nesmie byť dlhšie ako 30 znakov.'
      );

    if (surname.length > 30 || /[0-9\s]/g.test(surname))
      return setFieldError(
        surnameFieldWrapper.current,
        'Neplatné priezvisko. Priezvisko nemôže obsahovať čísla ani mezdery a nesmie byť dlhšie ako 30 znakov.'
      );
    // #endregion

    setIsProcessing(true);

    AuthManager.register(
      emailField.current?.value as string,
      passwdField.current?.value as string,
      nameField.current?.value as string,
      surnameField.current?.value as string
    )
      .then(() => {
        router.replace('/auth/verify');
      })
      .catch((error) => {
        setIsProcessing(false);

        resolveError(error);
      });
  };

  return (
    <section id="auth-wrapper" className={`grid place-items-center`}>
      <AuthCard>
        <h2 className="font-bold text-[1.4rem]">Registrácia</h2>
        <p className="text-sm text-gray-600 whitespace-pre-line">
          Registrujte sa pre prístup k uzamknutým <br />
          funkciam.
        </p>

        <AuthForm onSubmit={onSubmit}>
          <AuthField
            id="name"
            placeholder="Brad"
            wrapRef={nameFieldWrapper}
            fieldRef={nameField}
            onChange={onChange}
          >
            Meno
          </AuthField>

          <AuthField
            id="surname"
            placeholder="Pitt"
            wrapRef={surnameFieldWrapper}
            fieldRef={surnameField}
            onChange={onChange}
          >
            Priezvisko
          </AuthField>

          <AuthField
            id="email"
            placeholder="palo.palicka@gmail.com"
            wrapRef={emailFieldWrapper}
            fieldRef={emailField}
            onChange={onChange}
          >
            E-mail
          </AuthField>

          <AuthField
            type="password"
            id="passwd"
            placeholder="SuperSilneHeslo14*"
            wrapRef={passwdFieldWrapper}
            fieldRef={passwdField}
            onChange={onChange}
          >
            Heslo
          </AuthField>

          <p
            ref={unknownErrorElement}
            style={{ display: showUnknownError ? 'block' : 'none' }}
            className="my-[1rem] text-sm text-red-500 font-semibold whitespace-pre-line text-center"
          >
            Niečo sa pokazilo. Skúste to znovu neskôr.
          </p>

          <p className="text-sm text-gray-600 mt-[1.5rem]">
            Už máte založený účet? Tak sa{' '}
            <a className="text-blue-600 font-medium" href="/auth/login">
              prihláste.
            </a>
          </p>

          <button
            id="auth-form-submit"
            type="submit"
            className={`mt-[.5rem] rounded-lg bg-[rgb(114,177,253)] w-[12rem] py-[.5rem] font-semibold text-[.95rem] text-gray-700 tracking-wider transition-all duration-150 ${
              noFieldsEmpty ? 'good' : 'bad'
            } ${isProcessing ? 'disabled' : ''}`}
          >
            Zaregistrovať sa
          </button>
        </AuthForm>
      </AuthCard>
    </section>
  );
};

export default page;
