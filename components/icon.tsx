import {
  MapPin,
  Footprints,
  Snowflake,
  Bath,
  Wifi,
  Car,
  Users,
  Flower2,
  Sparkles,
  Droplets,
  HeartHandshake,
  Sun,
  ConciergeBell,
  CarTaxiFront,
  BedDouble,
  Landmark,
  Coffee,
  GlassWater,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the string icon names used in `lib/site-config.ts` to lucide
 * components, so the config file stays plain data (no JSX imports).
 */
const icons: Record<string, LucideIcon> = {
  MapPin,
  Footprints,
  Snowflake,
  Bath,
  Wifi,
  Car,
  Users,
  Flower2,
  Sparkles,
  Droplets,
  HeartHandshake,
  Sun,
  ConciergeBell,
  CarTaxiFront,
  BedDouble,
  Landmark,
  Coffee,
  GlassWater,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.6,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = icons[name] ?? Sparkles;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
