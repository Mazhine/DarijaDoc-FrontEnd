'use client';
import { useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/src/i18n/routing';
import { CallToAction as TopCallToAction } from '../../components/home/CallToAction';

const content = {
    fr: {
        title: "Prêt à transformer l'expérience de vos patients ?",
        btn: "Rejoignez-nous"
    },
    ar: {
        title: "واجد باش تبدل تجربة المرضى ديالك لأحسن؟",
        btn: "انضم إلينا الآن"
    },
    en: {
        title: "Ready to transform your patients' experience?",
        btn: "Join us now"
    }
};

export const CallToAction = () => {
    const locale = useLocale();
    const t = content[locale as keyof typeof content] || content.en;

    return (
        <section className="py-24 bg-white text-center px-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-[3.5rem] font-black tracking-tight leading-tight text-gray-900 mb-10">
                    {t.title.split(' ').map((word, i) => (
                        <span key={i} className={i > t.title.split(' ').length - 3 ? "text-[#0077b6]" : ""}>{word} </span>
                    ))}
                </h2>
                <Link href="/join" className="inline-flex items-center justify-center bg-[#0077b6] text-white px-8 py-4 rounded-xl font-bold text-[17px] hover:bg-[#00b4d8] transition-all shadow-[0_8px_20px_rgba(0,119,182,0.25)] hover:-translate-y-0.5">
                    {t.btn}
                </Link>
            </div>
        </section>
    );
};
