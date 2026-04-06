'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { Star } from 'lucide-react';

// 3D Brain/Abstract Medical Element
const FloatingAIElement = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
      <Sphere args={[1, 64, 64]} ref={meshRef} scale={2}>
        <MeshDistortMaterial
          color="#0077b6"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </Sphere>

      <Sphere args={[1.2, 32, 32]} scale={2}>
        <meshStandardMaterial
          color="#90e0ef"
          wireframe
          transparent
          opacity={0.2}
        />
      </Sphere>

      <ambientLight intensity={1} />
      <directionalLight position={[2, 5, 2]} intensity={2} color="#ffffff" />
      <pointLight position={[-2, -2, -2]} intensity={1} color="#90e0ef" />
    </Float>
  );
};

export const Hero = () => {
  const t = useTranslations('Hero');

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: any = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  };

  return (
    <section className="relative pt-40 pb-24 overflow-hidden min-h-[90vh] flex items-center bg-zinc-50/50">

      {/* 3D Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <Canvas camera={{ position: [0, 0, 8] }}>
          <FloatingAIElement />
        </Canvas>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md text-[#0077b6] text-sm font-bold mb-8 border border-[#90e0ef]/50 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#90e0ef] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0077b6]"></span>
            </span>
            DarijaDoc AI pour le secteur médical
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Ne perdez plus <br />
              <span className="text-[#0077b6]">aucun rendez-vous</span> <br />
              avec vos patients.
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl font-medium leading-relaxed">
            Notre IA médicale répond au téléphone en Darija, planifie les rendez-vous, et gère les urgences 24h/24 et 7j/7 sans perturber votre clinique.
          </motion.p>

          {/* Actions */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button className="w-full sm:w-auto bg-[#0077b6] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#0077b6]/90 transition-all shadow-[0_8px_30px_rgb(0,119,182,0.3)] hover:-translate-y-1 text-center">
              Commencer gratuitement
            </button>
            <button className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
              Voir la démo
            </button>
          </motion.div>

          {/* Social Proof / Tiny Stats */}
          <motion.div variants={itemVariants} className="mt-12 flex items-center gap-6 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden z-[${4 - i}]`}>
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="doctor" />
                  </div>
                ))}
              </div>
              <span className="ml-2">+120 médecins</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center gap-1 text-[#0077b6]">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              <span className="text-gray-600 ml-1">4.9/5 sur Google</span>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-[#90e0ef] rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
    </section>
  );
};