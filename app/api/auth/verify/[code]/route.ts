import verify from '@/app/api/controllers/verify/verify';
import jsonResponse '@/helpers/api/jsonResponse';
import '@/app/firebase/admin/admin';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const response = await verify(params.code);

  return jsonResponse(response);
}