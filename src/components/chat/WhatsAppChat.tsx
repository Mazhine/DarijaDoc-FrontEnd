'use client';

import { useEffect, useState } from 'react';
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
    }, index * 550 + 180);

    return () => clearTimeout(timeout);
  }, [index, startAnimation]);

  const isSender = message.sender === 'me';

  return (
    <div
      className={`relative mb-3 flex w-full transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } ${isSender ? 'justify-end' : 'justify-start'}`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className={`max-w-[88%] rounded-[18px] px-3.5 py-2.5 shadow-sm ${isSender ? 'bg-[#dff4ee] text-slate-900' : 'bg-white text-slate-700'}`}>
        <p className="text-[13px] leading-6" style={{ wordBreak: 'break-word', textAlign: isArabic ? 'right' : 'left' }}>
          {message.text}
        </p>
        <div className="mt-1 text-[10px] font-medium text-slate-400" style={{ direction: 'ltr' }}>
          {message.time}
        </div>
      </div>
    </div>
  );
}

export default function WhatsAppChat({ heroOnly = false }: { heroOnly?: boolean }) {
  const locale = useLocale() as LocaleKey;
  const copy = getLandingContent(locale).chat;
  const isArabic = locale === 'ar';
  const [startPhoneAnim, setStartPhoneAnim] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStartPhoneAnim(true);
    }, 220);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`relative ${heroOnly ? 'mx-auto w-full max-w-[360px]' : 'mx-auto w-full max-w-[420px]'}`} dir="ltr">
      <div
        className={`relative rounded-[40px] border border-slate-200 bg-white p-[8px] shadow-[0_35px_80px_-42px_rgba(15,23,42,0.35)] transition-all duration-[1200ms] ${
          startPhoneAnim ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="absolute left-1/2 top-0 z-30 flex h-5 w-28 -translate-x-1/2 items-center justify-center rounded-b-3xl bg-slate-200">
          <div className="h-1.5 w-12 rounded-full bg-slate-400" />
        </div>

        <div className="relative flex h-[560px] w-full flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-[#eef4f1]">
          <div className="flex h-[62px] items-center bg-[#12695b] px-4 pt-4" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className={`flex flex-1 items-center gap-3 ${isArabic ? 'mr-2' : 'ml-2'}`}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#12695b]">
                DD
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-white">DarijaDoc</div>
                <div className="text-[11px] text-[#d9f1ec]">{copy.online}</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="mb-5 flex justify-center">
              <div className="rounded-xl bg-[#fef7df] px-3 py-1.5 text-center text-[11px] font-medium text-[#8a6a16]">
                {copy.secure}
              </div>
            </div>

            {copy.messages.map((message, index) => (
              <WhatsAppBubble
                key={message.id}
                message={message}
                index={index}
                startAnimation={startPhoneAnim}
                isArabic={isArabic}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-3" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="flex min-h-[42px] flex-1 items-center rounded-full border border-slate-200 bg-slate-50 px-4 text-[14px] text-slate-400">
              {copy.input}
            </div>
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#12695b] text-white">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2.002z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {!heroOnly ? <p className="mt-4 text-center text-sm text-slate-500">WhatsApp flow preview</p> : null}
    </div>
  );
}
