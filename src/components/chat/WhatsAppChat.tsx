'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { getLandingContent, type LocaleKey } from '../../content/landing';

type WhatsAppBubbleProps = {
  message: {
    id: number;
    sender: 'them' | 'me';
    text: string;
    time: string;
  };
  index: number;
  startAnimation: boolean;
  isArabic: boolean;
};

function WhatsAppBubble({ message, index, startAnimation, isArabic }: WhatsAppBubbleProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!startAnimation) return;

    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, index * 700 + 300);

    return () => clearTimeout(timeout);
  }, [index, startAnimation]);

  const isSender = message.sender === 'me';

  return (
    <div
      className={`relative mb-3 flex w-full transform transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
        isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-5 scale-95 opacity-0'
      } ${isSender ? 'justify-end' : 'justify-start'}`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className={`relative flex max-w-[88%] flex-col ${isSender ? 'items-end' : 'items-start'}`}>
        <div
          className={`flex flex-col gap-1 rounded-[14px] px-3 pb-1.5 pt-2 shadow-sm ${
            isSender
              ? 'items-end rounded-tr-[4px] bg-[#0b7ec2] text-white'
              : 'items-start rounded-tl-[4px] bg-[#202c33] text-[#e9edef]'
          }`}
        >
          <span
            className="text-[14px] font-medium leading-[20px]"
            style={{ wordBreak: 'break-word', textAlign: isArabic ? 'right' : 'left' }}
          >
            {message.text}
          </span>
          <div className="mt-0.5 flex items-center gap-1 opacity-80" style={{ direction: 'ltr' }}>
            <span className="text-[10px] font-semibold text-gray-300">{message.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WhatsAppChat() {
  const locale = useLocale() as LocaleKey;
  const copy = getLandingContent(locale).chat;
  const isArabic = locale === 'ar';
  const [startPhoneAnim, setStartPhoneAnim] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStartPhoneAnim(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className={`relative flex w-full flex-col items-center justify-center gap-10 overflow-hidden bg-[linear-gradient(180deg,#f8fffc_0%,#f2faf7_48%,#f4f8ff_100%)] px-5 pb-12 pt-12 md:px-6 md:pb-16 md:pt-16 lg:min-h-[72vh] lg:flex-row lg:gap-14 ${
        isArabic ? 'lg:flex-row-reverse' : ''
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,211,102,0.09),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(125,196,255,0.16),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.65),transparent_42%)]" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[420px] w-[420px] rounded-full bg-[#25d366]/10 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[360px] w-[360px] rounded-full bg-[#7cc7ff]/14 blur-[100px]" />

      <div className="relative z-20 max-w-xl flex-1 text-center lg:text-left" style={{ textAlign: isArabic ? 'right' : undefined }}>
        <div
          className={`inline-flex translate-y-6 transform items-center gap-2 rounded-full border border-[#9fe7d4]/20 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9fe7d4] backdrop-blur-md transition-all duration-1000 ${
            startPhoneAnim ? 'translate-y-0 opacity-100' : 'opacity-0'
          }`}
        >
          {copy.tag}
        </div>
        <h2
          className={`mb-5 mt-6 translate-y-6 transform text-3xl font-black leading-[1.05] tracking-tight text-slate-950 transition-all delay-150 duration-1000 md:text-5xl ${
            startPhoneAnim ? 'translate-y-0 opacity-100' : 'opacity-0'
          }`}
        >
          {copy.title}
        </h2>
        <p
          className={`translate-y-6 transform text-base font-medium leading-8 text-slate-600 transition-all delay-250 duration-1000 md:text-lg ${
            startPhoneAnim ? 'translate-y-0 opacity-100' : 'opacity-0'
          }`}
        >
          {copy.subtitle}
        </p>
      </div>

      <div className="relative z-20 w-full max-w-[360px] flex-1 perspective-[1000px]" dir="ltr">
        <div
          className={`relative mx-auto w-full transform rounded-[42px] border border-slate-300/40 p-[7px] transition-all duration-[1.35s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            startPhoneAnim ? 'translate-y-0 scale-100 opacity-100 lg:rotate-y-[-8deg] lg:rotate-x-[4deg]' : 'translate-y-16 scale-95 opacity-0'
          }`}
          style={{
            background: 'linear-gradient(145deg, #f8fafc, #dbe7f3)',
            boxShadow: 'inset 0 0 4px rgba(255,255,255,0.65), 0 50px 100px -30px rgba(15,23,42,0.25)',
          }}
        >
          <div className="absolute left-1/2 top-0 z-40 flex h-5 w-28 -translate-x-1/2 items-center justify-center rounded-b-3xl border-b border-slate-400 bg-slate-300">
            <div className="mt-1 h-1.5 w-11 rounded-full bg-slate-500" />
          </div>

          <div className="relative flex h-[580px] w-full flex-col overflow-hidden rounded-[34px] border border-gray-200 bg-[#efeae2] shadow-inner sm:h-[620px]">
            <div
              className="pointer-events-none absolute inset-0 z-0 opacity-[0.16]"
              style={{
                backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                backgroundRepeat: 'repeat',
                backgroundSize: '280px',
              }}
            />

            <div className="relative z-20 flex h-[62px] w-full items-center bg-[#0b7ec2] px-4 pt-4 shadow-md" dir={isArabic ? 'rtl' : 'ltr'}>
              <div className={`flex flex-1 items-center gap-3 ${isArabic ? 'mr-2' : 'ml-2'}`}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-black text-[#0b7ec2] shadow-sm">
                  DD
                </div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold leading-tight text-white">DarijaDoc</h3>
                  <span className="text-[11px] font-medium text-[#c9f2ff]">{copy.online}</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex w-full flex-1 flex-col overflow-y-auto px-4 py-4 hide-scrollbar">
              <div className="mb-5 mt-1 flex justify-center">
                <div className="max-w-[92%] rounded-[10px] bg-[#fefce8] px-3 py-1.5 text-center shadow-sm">
                  <p className="text-[11px] font-medium leading-tight text-yellow-700">{copy.secure}</p>
                </div>
              </div>

              {copy.messages.map((message, index) => (
                <WhatsAppBubble key={message.id} message={message} index={index} startAnimation={startPhoneAnim} isArabic={isArabic} />
              ))}
            </div>

            <div className="relative z-20 flex w-full items-center gap-2 bg-[#f0f2f5] p-2 pb-4" dir={isArabic ? 'rtl' : 'ltr'}>
              <div className="flex min-h-[40px] flex-1 items-center rounded-full border border-gray-200 bg-white px-4 shadow-sm">
                <span className="text-[14px] text-gray-400">{copy.input}</span>
              </div>
              <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#0b7ec2] shadow-md">
                <svg viewBox="0 0 24 24" width="20" height="20" className="text-white" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2.002z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
