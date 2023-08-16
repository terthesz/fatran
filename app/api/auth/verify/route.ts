import sendVerification from '../../controllers/verify/sendVerification';
import jsonResponse, { corsResponse } from '@/helpers/api/jsonResponse';
import '@/app/firebase/admin/admin';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const force = searchParams.get('force') || false;

  const response = await sendVerification(force === 'true');

  return jsonResponse(response);
}

export function OPTIONS() {
  return corsResponse();
}
