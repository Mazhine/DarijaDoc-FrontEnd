'use client';

import { useLocale } from 'next-intl';
import { Hero } from '../../components/home/Hero';
import { Problems } from '../../components/home/Problems';
import { Stats } from '../../components/home/Stats';
import SuccessStory from '../../components/home/SuccessStory';
import { FAQSection } from '../../components/home/FAQSection';
import { CallToAction } from '../../components/home/CallToAction';
import { Footer } from '../../components/home/Footer';
import WhatsAppChat from '../../components/chat/WhatsAppChat';
import { HeroCarousel } from '../../components/home/HeroCarousel';

export default function HomePage() {
  const locale = useLocale();

  return (
    <div
      className="min-h-screen font-sans bg-white"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <main>
        {/* Full Image Carousel at the top */}
        <HeroCarousel />

        {/* WhatsApp Interaction Section */}
        <WhatsAppChat />

        {/* The beautiful smooth transition rounding into the original site */}
        <div className="relative z-30 w-full bg-white rounded-t-[60px] -mt-12 shadow-[0_-30px_60px_rgba(0,0,0,0.6)] overflow-hidden transition-all pt-12">
          {/* Site Content */}
          <Problems />
          <Stats />
          <SuccessStory />
          <FAQSection />
          <CallToAction />
        </div>
      </main>
      <Footer />
    </div>
  );
}