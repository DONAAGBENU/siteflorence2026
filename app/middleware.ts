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
      const adminPhone = req.cookies.get('admin_phone')?.value || '';
      
      // Numéro admin autorisé
      const allowedAdmins = ['+22897852652'];

      if (isAdminCookie && allowedAdmins.includes(decodeURIComponent(adminPhone))) {
        return res; // laisser passer
      }

      // Rediriger vers la page de connexion
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Vérifier si l'utilisateur est admin via profile (pour les vrais utilisateurs Supabase)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/products', req.url));
    }
  }

  // Routes protégées pour clients connectés
  const clientRoutes = ['/profile', '/cart', '/checkout', '/orders'];
  const isClientRoute = clientRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  if (isClientRoute) {
    if (!session) {
      // Vérifier les cookies pour les clients simulés
      const isClientCookie = req.cookies.get('is_client')?.value === '1';
      const clientPhone = req.cookies.get('client_phone')?.value;

      if (!isClientCookie || !clientPhone) {
        // Rediriger vers la page de connexion
        const redirectUrl = new URL('/auth/login', req.url);
        redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/orders/:path*'
  ]
};