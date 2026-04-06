import { Command } from 'lucide-react';
import { Link } from '@/src/i18n/routing';

export const Footer = () => {
  return (
    <footer className="w-full bg-white pt-24 pb-8 px-6 border-t border-gray-100" dir="ltr">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-16 mb-24">

        {/* Brand & Mission */}
        <div className="max-w-[240px]">
          <Command className="w-8 h-8 text-gray-900 mb-6" />
          <p className="text-[13.5px] text-gray-500 font-medium leading-relaxed">
            Notre mission est de transformer le marché avec l'IA.
          </p>
        </div>

        {/* Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-x-12 gap-y-10 flex-1 justify-end md:ml-auto md:max-w-md">
          <div>
            <h4 className="font-bold text-gray-900 mb-5 text-[15px]">Ressources</h4>
            <ul className="space-y-3.5 text-[14px] text-gray-500 font-medium">
              <li><Link href="/faq" className="hover:text-gray-900 transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-5 text-[15px]">À propos</h4>
            <ul className="space-y-3.5 text-[14px] text-gray-500 font-medium">
              <li><Link href="/join" className="hover:text-gray-900 transition-colors">Nous Rejoindre</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100/80 gap-6">
        <p className="text-[13px] text-gray-400 font-medium tracking-wide">
          © 2026 DarijaDoc AI. Tous droits réservés.
        </p>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-[13px] font-medium text-gray-500">
            <span className="text-gray-900 font-bold cursor-pointer">Français</span>
            <span className="cursor-pointer hover:text-gray-900 transition">English</span>
            <span className="cursor-pointer hover:text-gray-900 transition">العربية</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" aria-label="LinkedIn" className="hover:text-gray-900 transition">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-gray-900 transition">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-gray-900 transition">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};