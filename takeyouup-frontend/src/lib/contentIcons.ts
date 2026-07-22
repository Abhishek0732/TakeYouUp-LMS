import {
  Award, BookOpen, Brain, Code, Code2, Eye, FileText, GraduationCap, Heart,
  Lightbulb, Mail, MapPin, Phone, Rocket, Shield, Sparkles, Target, Terminal,
  TrendingUp, Trophy, Users, Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Icons an admin may attach to a content row.
 *
 * An explicit allow-list rather than a lookup into the whole lucide package:
 * the icon name arrives from the database as a free-text string, and importing
 * by dynamic name would both defeat tree-shaking — pulling the entire icon set
 * into the bundle — and turn a typo into a crash. Anything unrecognised falls
 * back to a sensible default instead.
 *
 * To offer another icon, import it and add it here; the admin dropdown reads
 * its options from this map, so it stays in step automatically.
 */
export const CONTENT_ICONS: Record<string, LucideIcon> = {
  Award, BookOpen, Brain, Code, Code2, Eye, FileText, GraduationCap, Heart,
  Lightbulb, Mail, MapPin, Phone, Rocket, Shield, Sparkles, Target, Terminal,
  TrendingUp, Trophy, Users, Zap,
};

/** Names for the admin picker, alphabetical. */
export const CONTENT_ICON_NAMES = Object.keys(CONTENT_ICONS).sort();

/**
 * Resolve a stored icon name to a component.
 * Never throws: an unknown or missing name yields `fallback`.
 */
export function contentIcon(name?: string | null, fallback: LucideIcon = Sparkles): LucideIcon {
  if (!name) return fallback;
  return CONTENT_ICONS[name] ?? fallback;
}
