import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';

export default function App() {
  const [phase, setPhase] = useState<'initial' | 'countdown' | 'celebration'>('initial');
  const [countdown, setCountdown] = useState(3);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleHeartClick = () => {
    setPhase('countdown');
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Hafif bir ses seviyesi
      audioRef.current.play().catch(e => console.log("Otomatik oynatma tarayıcı tarafından engellendi:", e));
    }
  };

  useEffect(() => {
    if (phase === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(prev => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase('celebration');
      }
    }
  }, [phase, countdown]);

  useEffect(() => {
    if (phase === 'celebration') {
      triggerConfetti();
    }
  }, [phase]);

  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#ff4081', '#ff80ab', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#ff4081', '#ff80ab', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <div className="min-h-[100dvh] bg-pink-50 flex items-center justify-center overflow-hidden font-sans select-none touch-manipulation">
      <audio ref={audioRef} src="/fettah_can_sen_en_cok_asksin.mp3" loop preload="auto" />
      <AnimatePresence mode="wait">
        {phase === 'initial' && (
          <motion.div
            key="initial"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-8 cursor-pointer p-8 rounded-full"
            onClick={handleHeartClick}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-red-400 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <Heart className="relative w-48 h-48 sm:w-64 sm:h-64 text-red-500 drop-shadow-2xl fill-red-500" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-medium text-red-500 tracking-widest uppercase mt-4"
            >
              kalbe tıkla
            </motion.p>
          </motion.div>
        )}

        {phase === 'countdown' && (
          <motion.div
            key="countdown"
            className="flex items-center justify-center absolute inset-0"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={countdown}
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 1.5, filter: "blur(5px)" }}
                transition={{ duration: 0.4 }}
                className="text-[12rem] sm:text-[18rem] font-bold text-red-500 tabular-nums drop-shadow-2xl leading-none"
              >
                {countdown}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}

        {phase === 'celebration' && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 1,
              type: "spring",
              bounce: 0.5
            }}
            className="flex flex-col items-center justify-center text-center px-4 w-full"
          >
             <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.6, duration: 1 }}
             >
                <Heart className="w-24 h-24 sm:w-32 sm:h-32 text-red-500 fill-red-500 mx-auto mb-8 drop-shadow-2xl" />
             </motion.div>
            <h1 className="text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 pb-4 drop-shadow-sm leading-tight max-w-2xl mx-auto">
              İyi ki varsın Duru
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
