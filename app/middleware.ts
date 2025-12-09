import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Routes protégées pour admins seulement
  const adminRoutes = ['/dashboard', '/dashboard/products/add', '/dashboard/products/upload'];
  const isAdminRoute = adminRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  if (isAdminRoute) {
    if (!session) {
      // Pas de session Supabase : vérifier un cookie admin mis par la connexion simulée
      const isAdminCookie = req.cookies.get('is_admin')?.value === '1';
      const adminEmail = req.cookies.get('admin_email')?.value || '';
      const allowedAdmins = ['donaagbenu2000@gmail.com', 'agbagnof@gmail.com'];

      if (isAdminCookie && allowedAdmins.includes(decodeURIComponent(adminEmail))) {
        return res; // laisser passer
      }

      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Vérifier si l'utilisateur est admin via profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/products', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*']
};