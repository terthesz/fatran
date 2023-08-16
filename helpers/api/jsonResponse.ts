import { NextResponse } from 'next/server';

export default function jsonResponse(json: any, status?: number) {
  return NextResponse.json(json, {
    status: status || json.status || 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
