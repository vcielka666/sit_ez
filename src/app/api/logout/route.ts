import { NextResponse } from 'next/server';

export async function POST() {
  // Clear the SitEz cookie by setting an expired cookie
  return NextResponse.json(
    { message: 'Logout successful' },
    {
      headers: {
        'Set-Cookie': 'SitEz=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure',
      },
    }
  );
}
