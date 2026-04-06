'use client';

import ChatPhone from '../../../components/chat/ChatPhone';

// Sample animated chat logic array
const chatMessages = [
    { id: 1, sender: "them", text: "Hey! Tu as pu regarder les nouvelles maquettes ? 🎨", time: "10:42", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
    { id: 2, sender: "me", text: "Oui, c'est vraiment incroyable ! L'effet Glassmorphism rend l'application très pro. 🔥", time: "10:45" },
    { id: 3, sender: "them", text: "Génial ! Je voulais que ça fasse très 'Apple', avec des animations super fluides.", time: "10:46" },
    { id: 4, sender: "me", text: "Mission accomplie. Le scroll reveal est super naturel.", time: "10:47" },
    { id: 5, sender: "them", text: "Est-ce qu'on ajoute les ombres portées sur les boutons d'action du bas ?", time: "10:50" },
    { id: 6, sender: "me", text: "Je pense qu'il faut garder ça subtil. Un léger drop-shadow devrait suffire pour ne pas surcharger.", time: "10:52" },
    { id: 7, sender: "them", text: "D'accord, je vais modifier ça. Et pour les performances avec IntersectionObserver, tout va bien ?", time: "10:55" },
    { id: 8, sender: "me", text: "Oui, c'est du beurre 🧈 Aucun lag, et on a pû éviter des librairies externes lourdes.", time: "10:58" },
    { id: 9, sender: "me", text: "On met ça en prod demain matin ?", time: "10:58" },
    { id: 10, sender: "them", text: "C'est validé ! 🚀", time: "11:00" },
];

export default function ChatDemoPage() {
    return (
        <div className="relative min-h-screen bg-[#0d0d0f] flex items-center justify-center p-6 overflow-hidden">
            {/* Cinematic Animated Background Elements */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#007aff] rounded-full mix-blend-screen opacity-20 blur-[150px] animate-[pulse_6s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#90e0ef] rounded-full mix-blend-screen opacity-20 blur-[150px] animate-[pulse_8s_ease-in-out_infinite_reverse]"></div>
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">

                {/* Text Description Left Side */}
                <div className="flex-1 text-center md:text-left space-y-8 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#90e0ef] text-xs font-bold tracking-widest uppercase backdrop-blur-md">
                        Premium UI Experience
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-gray-500 tracking-tight leading-[1.1]">
                        Engage your users like never before.
                    </h1>
                    <p className="text-xl text-gray-400 font-medium leading-relaxed">
                        A seamless, intersection-triggered animated chat interface. Built strictly with React Hooks and Tailwind CSS for pure, uncompromised performance.
                    </p>

                    <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 hidden md:flex">
                        <div className="flex -space-x-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0d0d0f] overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 40}`} alt="avatar" />
                                </div>
                            ))}
                        </div>
                        <div className="text-left text-sm text-gray-400">
                            <span className="text-white font-bold block">Trusted by 10k+ users</span>
                            High-end conversational UX
                        </div>
                    </div>
                </div>

                {/* Phone Mockup Right Side */}
                <div className="flex-1 w-full flex justify-center perspective-[1000px]">
                    <div className="transform md:rotate-y-[-5deg] md:rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 ease-out">
                        <ChatPhone messages={chatMessages} />
                    </div>
                </div>

            </div>
        </div>
    );
}
