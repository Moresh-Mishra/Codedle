import { motion } from "framer-motion";

export const Badge = ({ children, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-primary-container text-on-primary-container",
    secondary: "bg-secondary-container text-on-secondary-container",
    error: "bg-red-100 text-red-700 border border-red-200",
    outline: "border border-surface-outline text-secondary",
  };

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`px-2 py-0.5 rounded-full text-[10px] font-label-caps tracking-wider ${variants[variant]} ${className}`}
    >
      {children}
    </motion.span>
  );
};
