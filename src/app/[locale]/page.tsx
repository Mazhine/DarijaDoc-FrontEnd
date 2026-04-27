import LandingPage from '../../components/home/LandingPage';
import { isLocale, type LocaleKey } from '../../content/landing';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: LocaleKey = isLocale(locale) ? locale : 'fr';

  return <LandingPage locale={safeLocale} />;
}
