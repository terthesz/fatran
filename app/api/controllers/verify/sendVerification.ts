import { actionError, actionSuccess } from '@/helpers/api/actionHelpers';
import { actionReturnType } from '@/types/api/actionTypes';
import emailService from '../../services/emailService';
import { UserRecord } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { handleTokenError, validateToken } from '@/helpers/api/authTokenHelper';
import VerifyEmail from '@/emails/VerifyEmail';

const softTimeout = 10 * 60 * 1000;

export default async function sendVerification(
  force: boolean
): Promise<actionReturnType> {
  const authRes: any = await validateToken();

  if (authRes.isError)
    return authRes.message ? authRes : handleTokenError(authRes.error);

  const { uid, displayName, email, emailVerified } = authRes as UserRecord;
  if (emailVerified) return actionSuccess('Email aready verified.');

  if (!force && (await generatedWithinSoftTimeout(uid))) return actionSuccess();

  const code = generateVerification(uid);

  emailService.send(email as string, displayName as string, code);

  return actionSuccess();
}

async function generatedWithinSoftTimeout(uid: string) {
  const db = getDatabase();
  const ref = db.ref('verify/');

  const generated = (await ref.child(uid + '/generated').get()).toJSON();
  if (!generated) return false;

  const dateFromGenerated = new Date(generated as any);
  if (!dateFromGenerated) return false;

  return Date.now() - dateFromGenerated.getTime() <= softTimeout;
}

function generateVerification(uid: string) {
  const db = getDatabase();
  const ref = db.ref('verify/');

  const code = (
    Math.floor(Math.random() * (100_000 - 999_999 + 1)) + 999_999
  ).toString();

  ref.set({
    [uid]: {
      code,
      generated: new Date().toString(),
    },
  });

  return code;
}
