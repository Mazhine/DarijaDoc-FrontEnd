import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // كيطبق على كاع المسارات من غير الملفات التقنية (static files)
  matcher: ['/', '/(ar|en|fr)/:path*']
};