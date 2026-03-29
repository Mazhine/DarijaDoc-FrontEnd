import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // ضروري نديرو await لهادي في النسخة الجديدة
  let locale = await requestLocale;

  // إلا مالقاش اللغة أو لقى لغة ماكيناش، كيدير default
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});