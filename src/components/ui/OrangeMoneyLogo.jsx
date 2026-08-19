import { ORANGE_MONEY_LOGO } from "../../constants/brand";

export default function OrangeMoneyLogo({ className = "h-8 w-auto", alt = "Orange Money" }) {
  return (
    <img
      src={ORANGE_MONEY_LOGO}
      alt={alt}
      className={`object-contain bg-black rounded-md ${className}`}
    />
  );
}
