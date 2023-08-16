import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/dist/client/components/headers';
import jsonResponse from './helpers/api/jsonResponse';
import { actionError } from './helpers/api/actionHelpers';

const redis = new Redis({
  url: 'https://still-turtle-46283.upstash.io',
  token: process.env.UPSTASH_TOKEN as string,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'),
});

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent
): Promise<Response | undefined> {
  const ip =
    request.ip ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forward-for') ||
    '127.0.0.1';

  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    ip
  );

  return success
    ? NextResponse.next()
    : jsonResponse(actionError(429, 'Rate limited.'));
}

export const config = {
  matcher: '/api/:route*',
};
