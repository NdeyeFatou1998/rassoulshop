/**
 * Composant AnimatedSection - Wrapper d'animation au scroll
 * 
 * Utilise Framer Motion pour animer les sections au moment
 * où elles entrent dans le viewport (intersection observer).
 * 
 * Props :
 * - children   : contenu à animer
 * - className  : classes CSS additionnelles
 * - delay      : délai avant l'animation (défaut: 0)
 * - direction  : direction de l'animation ("up", "left", "right", "none")
 * 
 * Toutes les sections principales du site utilisent ce wrapper
 * pour un effet de révélation progressif premium.
 */

import { motion } from "framer-motion";

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
}) {
  /* Calcul du décalage initial selon la direction */
  const offsets = {
    up: { y: 40, x: 0 },
    left: { y: 0, x: -40 },
    right: { y: 0, x: 40 },
    none: { y: 0, x: 0 },
  };

  const offset = offsets[direction] || offsets.up;

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
