import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Navbar from './components/Navbar';
import "./../globals.css";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // تأكد من اللغات المدعومة
  if (!['ar', 'en', 'fr'].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} className="scroll-smooth">
      <body className="antialiased bg-white text-slate-900 font-sans">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navbar />
          {/* زدنا pt-24 باش Content ما يجيش مخبي تحت الـ Fixed Navbar */}
          <main className="pt-24 min-h-screen">
            {children}
          </main>
          
          {/* تقدر تزيد Footer هنا لتحت */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}