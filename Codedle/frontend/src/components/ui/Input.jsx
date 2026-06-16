import { motion } from "framer-motion";

export const Input = ({ className = "", ...props }) => {
  return (
    <motion.input
      whileFocus={{ scale: 1.01 }}
      className={`w-full px-4 py-2 rounded-lg border border-surface-outline bg-surface-paper text-on-surface placeholder:text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 ${className}`}
      {...props}
    />
  );
};
