import { 
  Star, 
  Heart, 
  Award, 
  Lightbulb, 
  MessageSquare, 
  Zap, 
  Shield, 
  Flame, 
  UserCheck, 
  HeartHandshake, 
  Trophy, 
  Users,
  Target
} from "lucide-react";

export const RECOGNITION_VALUES = {
  "Smart": {
    icon: Lightbulb,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    label: "Smart"
  },
  "Communication": {
    icon: MessageSquare,
    color: "text-cyan-500",
    bg: "bg-cyan-50",
    border: "border-cyan-100",
    label: "Communication"
  },
  "Impact": {
    icon: Target,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-100",
    label: "Impact"
  },
  "Transforming": {
    icon: Zap,
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-100",
    label: "Transforming"
  },
  "Innovation": {
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    label: "Innovation"
  },
  "Courage": {
    icon: Shield,
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
    label: "Courage"
  },
  "Passion": {
    icon: Flame,
    color: "text-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-100",
    label: "Passion"
  },
  "Authentic": {
    icon: UserCheck,
    color: "text-teal-500",
    bg: "bg-teal-50",
    border: "border-teal-100",
    label: "Authentic"
  },
  "Selflessness": {
    icon: HeartHandshake,
    color: "text-pink-500",
    bg: "bg-pink-50",
    border: "border-pink-100",
    label: "Selflessness"
  },
  "Heart": {
    icon: Heart,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    label: "Heart"
  },
  "Excellence": {
    icon: Trophy,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    label: "Excellence"
  },
  "Teamwork": {
    icon: Users,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    label: "Teamwork"
  }
};

export const getRecognitionValue = (value) => {
  return RECOGNITION_VALUES[value] || {
    icon: Award,
    color: "text-stone-500",
    bg: "bg-stone-50",
    border: "border-stone-100",
    label: value
  };
};
