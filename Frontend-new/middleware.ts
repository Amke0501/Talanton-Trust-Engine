import { NextResponse, type NextRequest } from 'next/server'
import { ROLE_COOKIE_NAME, normalizeRole, resolveRole } from '@/lib/role-access'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  const pathRole = normalizeRole(pathname.split('/')[2])
  const cookieRole = request.cookies.get(ROLE_COOKIE_NAME)?.value ?? null
  const queryRole = searchParams.get('role')
  const effectiveRole = resolveRole({ cookieRole, queryRole })

  const redirectToRole = (role: string) => {
    const url = request.nextUrl.clone()
    url.pathname = `/dashboard/${role}`
    url.searchParams.delete('role')
    const response = NextResponse.redirect(url)
    response.cookies.set(ROLE_COOKIE_NAME, role, {
      path: '/',
      sameSite: 'lax',
    })
    return response
  }

  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    return redirectToRole(effectiveRole)
  }

  if (!pathRole) {
    return redirectToRole(effectiveRole)
  }

  if (pathRole !== effectiveRole) {
    return redirectToRole(effectiveRole)
  }

  const response = NextResponse.next()
  if (cookieRole !== effectiveRole || queryRole) {
    response.cookies.set(ROLE_COOKIE_NAME, effectiveRole, {
      path: '/',
      sameSite: 'lax',
    })
  }
  return response
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
