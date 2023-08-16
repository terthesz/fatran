import jsonResponse from '@/helpers/api/jsonResponse';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/dist/client/components/headers';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const auth = cookies().get('auth');

  return jsonResponse(
    await getAuth().getUser(
      (
        await getAuth().verifyIdToken(auth?.value as string)
      ).uid
    )
  );
}
