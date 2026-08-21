/** Badge texte Wave (pas de logo asset fourni) */
export default function WaveLogo({ className = "h-8", alt = "Wave" }) {
  return (
    <span
      role="img"
      aria-label={alt}
      className={`inline-flex items-center justify-center px-3 rounded-md bg-[#1DC8FF] text-white font-bold tracking-wide ${className}`}
      style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.85em" }}
    >
      Wave
    </span>
  );
}
