import { motion } from "framer-motion";

export const FadeIn = ({ children, delay = 0, direction = "up", className = "" }) => {
  const variants = {
    up: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
    },
    down: {
      initial: { y: -20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
    },
    left: {
      initial: { x: 20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
    },
    right: {
      initial: { x: -20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants[direction] || variants.up}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
