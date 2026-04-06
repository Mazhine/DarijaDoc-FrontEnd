'use client';

import { useEffect, useRef, useState } from 'react';

export default function MessageBubble({ message, index }) {
    const [isVisible, setIsVisible] = useState(false);
    const bubbleRef = useRef(null);

    useEffect(() => {
        // Intersection Observer to trigger reveal animations when scrolled into view
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Slight staggered delay for smoothness when scrolling fast
                        setTimeout(() => {
                            setIsVisible(true);
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (bubbleRef.current) {
            observer.observe(bubbleRef.current);
        }

        return () => {
            if (bubbleRef.current) observer.unobserve(bubbleRef.current);
        };
    }, [index]);

    const isSender = message.sender === 'me';

    return (
        <div
            ref={bubbleRef}
            className={`flex w-full mb-6 relative transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${isSender ? 'justify-end' : 'justify-start'}`}
        >
            {/* Receiver Avatar */}
            {!isSender && (
                <div className="w-8 h-8 rounded-full overflow-hidden mr-3 shadow-md border border-white/50 shrink-0 self-end mb-1">
                    <img src={message.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026024d"} alt="User" />
                </div>
            )}

            {/* Bubble Container */}
            <div
                className={`relative max-w-[70%] group ${isSender ? 'items-end' : 'items-start'
                    } flex flex-col`}
            >
                <div
                    className={`px-5 py-3 rounded-[20px] shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md ${isSender
                            ? 'bg-[#007aff] text-white rounded-br-[5px]' // iMessage Blue
                            : 'bg-white/80 text-gray-800 rounded-bl-[5px] border border-white' // Glassy Light
                        }`}
                >
                    <p className="text-[15px] leading-relaxed break-words">{message.text}</p>
                </div>

                {/* Timestamp */}
                <span className={`text-[11px] text-gray-400 font-medium mt-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${isSender ? 'text-right' : 'text-left'
                    }`}>
                    {message.time}
                </span>
            </div>

            {/* Sender Avatar Optional (Uncomment if needed) */}
            {/* {isSender && (
        <div className="w-8 h-8 rounded-full overflow-hidden ml-3 shadow-md border border-white/50 shrink-0 self-end mb-1">
          <img src={message.avatar || "https://i.pravatar.cc/150?u=me"} alt="Me" />
        </div>
      )} */}
        </div>
    );
}
