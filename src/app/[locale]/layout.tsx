import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Navbar } from '../../components/home/Navbar';
import "../globals.css"; 

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!['ar', 'en', 'fr'].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className="antialiased bg-white">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}