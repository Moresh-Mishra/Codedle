import { motion } from "framer-motion";

export const Card = ({ children, className = "", title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`bg-surface-paper border border-surface-outline rounded-xl p-6 glass-card transition-colors hover:border-primary/50 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="font-headline-md text-headline-md text-primary">{title}</h3>}
          {subtitle && <p className="font-label-sm text-label-sm text-secondary">{subtitle}</p>}
        </div>
      )}
      {children}
    </motion.div>
  );
};
