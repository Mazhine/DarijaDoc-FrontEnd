import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation'; // السمية الجديدة هنا

export const routing = defineRouting({
  locales: ['ar', 'en', 'fr'],
  defaultLocale: 'ar'
});

// استعملنا createNavigation في بلاصة السمية القديمة الطويلة
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);