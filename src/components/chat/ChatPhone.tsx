'use client';

import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatPhone({ messages }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const scrollRef = useRef(null);

    // Entrance phone animation configuration
    useEffect(() => {
        setIsLoaded(true);

        // Bonus Feature: Auto Scroll slightly to show there is content
        setTimeout(() => {
            if (scrollRef.current) {
                // Optional gentle scroll effect for demonstration, otherwise user scrolls manually
            }
        }, 1500);
    }, []);

    return (
        <div
            className={`relative mx-auto w-full max-w-[380px] h-[750px] rounded-[55px] p-[10px] transform transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ${isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'
                }`}
            style={{
                background: 'linear-gradient(145deg, #e6e6e6, #ffffff)',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1), 0 50px 100px -20px rgba(0,0,0,0.4)',
            }}
        >
            {/* Outer Phone Frame Details */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#212121] rounded-b-3xl z-30 shadow-inner flex items-center justify-center">
                {/* Dynamic Island / Camera Notch */}
                <div className="w-16 h-2 bg-black rounded-full mb-1"></div>
            </div>
            <div className="absolute -left-[3px] top-32 w-[3px] h-10 bg-gray-300 rounded-l-md shadow-inner"></div> {/* Volume Switch */}
            <div className="absolute -left-[3px] top-48 w-[3px] h-16 bg-gray-300 rounded-l-md shadow-inner"></div> {/* Vol Up */}
            <div className="absolute -left-[3px] top-68 w-[3px] h-16 bg-gray-300 rounded-l-md shadow-inner"></div> {/* Vol Down */}
            <div className="absolute -right-[3px] top-52 w-[3px] h-24 bg-gray-300 rounded-r-md shadow-inner"></div> {/* Power Button */}

            {/* Screen Container */}
            <div className="relative w-full h-full bg-[#f4f4f5] rounded-[45px] overflow-hidden flex flex-col shadow-inner">

                {/* Dynamic Glassmorphism Background Pattern behind messages */}
                <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-20 -left-10 w-48 h-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute top-96 -right-10 w-48 h-48 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* Chat Header */}
                <div className="relative z-20 w-full pt-12 pb-4 px-6 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-sm flex items-center gap-3">
                    <svg className="w-6 h-6 text-[#007aff] cursor-pointer" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M15 19l-7-7 7-7" />
                    </svg>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Contact" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-gray-900 font-semibold text-sm leading-none">Sarah Allen</h3>
                            <span className="text-gray-400 text-[10px] font-medium mt-1">iMessage</span>
                        </div>
                    </div>
                </div>

                {/* Scrollable Chat View */}
                <div
                    ref={scrollRef}
                    className="relative z-10 flex-1 overflow-y-auto px-4 py-6 hide-scrollbar"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <div className="text-center text-[10px] text-gray-400 font-semibold mb-6 uppercase tracking-wider">Aujourd'hui 10:42</div>
                    {messages.map((msg, index) => (
                        <MessageBubble key={msg.id} message={msg} index={index} />
                    ))}
                </div>

                {/* Chat Input Footer */}
                <div className="relative z-20 w-full pt-3 pb-8 px-4 bg-white/70 backdrop-blur-lg border-t border-white/40">
                    <div className="flex items-center gap-3">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        </button>
                        <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-2.5 flex items-center justify-between">
                            <span className="text-gray-400 text-sm">iMessage</span>
                            <svg className="w-5 h-5 text-[#007aff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
