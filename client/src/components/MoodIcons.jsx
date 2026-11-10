import React from "react";
import {
  BatteryLow,
  CircleHelp,
  CloudRain,
  Flame,
  Leaf,
  Meh,
  Smile,
  Sparkles,
  Waves,
  Zap,
} from "lucide-react";

const iconsByMood = {
  Angry: Flame,
  Sad: CloudRain,
  Anxious: Waves,
  Tired: BatteryLow,
  Stressed: Zap,
  Bored: CircleHelp,
  Happy: Smile,
  Good: Sparkles,
  Calm: Leaf,
  Okay: Meh,
};

export function MoodIcon({ mood, size = 24, ...props }) {
  const Icon = iconsByMood[mood] || CircleHelp;
  return <Icon size={size} strokeWidth={1.9} aria-hidden="true" {...props} />;
}

export default MoodIcon;
