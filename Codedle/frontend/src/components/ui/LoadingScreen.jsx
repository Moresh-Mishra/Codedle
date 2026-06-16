import { motion } from "framer-motion";

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
        className="font-mono text-xs uppercase tracking-[0.3em] text-primary-dim"
      >
        Initializing System...
      </motion.div>
    </div>
  );
};
