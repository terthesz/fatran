import { actionError, actionSuccess } from '@/helpers/api/actionHelpers';
import { handleTokenError, validateToken } from '@/helpers/api/authTokenHelper';
import { actionReturnType } from '@/types/api/actionTypes';
import { UserRecord, getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';

const codeTTL = 30 * 60 * 1000;

export default async function verify(
  passed_code: string
): Promise<actionReturnType> {
  if (!passed_code) return actionError('400', 'Verification code undefined.');

  const authRes: any = await validateToken();

  if (authRes.isError)
    return authRes.message ? authRes : handleTokenError(authRes.error);

  const { uid, emailVerified } = authRes as UserRecord;
  if (emailVerified) return actionSuccess('Email already verified.');

  const entry = await retrieveCode(uid);
  if (!entry) return actionError(401, 'Code not generated.');

  const { code, generated } = entry;
  if (new Date().getTime() - new Date(generated).getTime() > codeTTL) {
    deleteCode(uid);
    return actionError(401, 'Code expired.');
  }

  if (code.toString() !== passed_code)
    return actionError(401, 'Invalid verification code');

  await getAuth()
    .updateUser(uid, {
      emailVerified: true,
    })
    .catch((error) => {
      return actionError(500, 'Something went wrong.');
    });

  deleteCode(uid);

  return actionSuccess();
}

async function retrieveCode(uid: string) {
  const db = getDatabase();
  const ref = db.ref('verify/');

  const entry = (await ref.child(uid).get()).toJSON() as {
    code: number;
    generated: string;
  };

  return entry;
}

function deleteCode(uid: string) {
  const db = getDatabase();
  const ref = db.ref('verify/');

  ref.child(uid).set(null);
}
