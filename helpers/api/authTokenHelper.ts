import { cookies } from 'next/dist/client/components/headers';
import { actionError } from './actionHelpers';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { FirebaseError } from 'firebase-admin';
import { actionReturnType } from '@/types/api/actionTypes';

export async function validateToken() {
  const auth = cookies().get('auth');
  if (!auth) return actionError(400, 'Auth token undefined.');

  const fb_auth = getAuth();

  return await fb_auth
    .verifyIdToken(auth.value)
    .then(async (decodedToken: DecodedIdToken) => {
      const user = await fb_auth.getUser(decodedToken.uid);

      return user;
    })
    .catch((error) => {
      return { isError: true, error: error };
    });
}

export function handleTokenError(error: FirebaseError): actionReturnType {
  const { code } = error;
  const fb_error = code.split('/')[1];

  let status = [
    'argument-error',
    'id-token-expired',
    'missing-id-token',
  ].includes(fb_error)
    ? 401
    : ['invalid-id-token', 'user-token-expired'].includes(fb_error)
    ? 400
    : 500;

  return actionError(status, error.message);
}
