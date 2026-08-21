import { WAVE_LOGO } from "../../constants/brand";

export default function WaveLogo({ className = "h-8 w-auto", alt = "Wave" }) {
  return (
    <img
      src={WAVE_LOGO}
      alt={alt}
      className={`object-contain rounded-md ${className}`}
    />
  );
}
