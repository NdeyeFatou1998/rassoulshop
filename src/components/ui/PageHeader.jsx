/**
 * PageHeader — En-tête premium (titres noirs, filet doré)
 */

import { motion } from "framer-motion";

export default function PageHeader({
  title,
  subtitle,
  breadcrumb,
  className = "",
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`text-center pt-20 md:pt-24 pb-4 md:pb-6 ${className}`}
    >
      {breadcrumb && (
        <p className="text-[10px] uppercase tracking-[0.32em] text-neutral-400 font-semibold mb-3">
          {breadcrumb}
        </p>
      )}
      <h1 className="font-serif text-[1.75rem] sm:text-3xl md:text-4xl font-semibold text-[#0a0a0a] tracking-tight leading-tight">
        {title}
      </h1>
      <div
        className="mx-auto mt-3 h-px w-20"
        style={{ background: "linear-gradient(90deg, transparent, #D7A12B, transparent)" }}
      />
      {subtitle && (
        <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-neutral-400 font-medium max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.header>
  );
}
