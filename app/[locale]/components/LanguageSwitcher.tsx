"use client";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex bg-slate-100 p-1 rounded-full border">
      {['ar', 'fr', 'en'].map((l) => (
        <button
          key={l}
          onClick={() => switchLanguage(l)}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            locale === l ? "bg-white shadow text-blue-600" : "text-slate-400 hover:text-blue-500"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}