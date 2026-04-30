import { redirect } from 'next/navigation';

export default async function DoctorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/auth`);
}
