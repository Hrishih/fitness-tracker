import { motion } from 'motion/react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loading;
