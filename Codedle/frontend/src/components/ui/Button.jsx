import { motion } from "framer-motion";

export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:brightness-110 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:brightness-110 shadow-sm",
    outline: "bg-transparent border border-surface-outline text-on-surface hover:bg-surface-muted",
    ghost: "bg-transparent text-secondary hover:bg-surface-muted hover:text-primary",
    danger: "bg-error text-white hover:brightness-110 shadow-sm",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all duration-200 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
