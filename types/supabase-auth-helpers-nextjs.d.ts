declare module '@supabase/auth-helpers-nextjs' {
  import type { NextRequest, NextResponse } from 'next/server';

  export function createMiddlewareClient(options: { req: NextRequest; res: NextResponse }): any;
}
