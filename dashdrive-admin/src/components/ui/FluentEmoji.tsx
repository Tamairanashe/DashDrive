// ────────────────────────────────────────────────────────────────
// FluentEmoji Component — Microsoft Fluent 3D Emojis
// ────────────────────────────────────────────────────────────────

import React from 'react';

// Common mapping from human-friendly names to Fluent Emoji asset names
const EMOJI_MAP: Record<string, string> = {
  'activity': 'chart_increasing',
  'zap': 'high_voltage',
  'fire': 'fire',
  'alert': 'police_car_light',
  'car': 'taxi',
  'location': 'round_pushpin',
  'clock': 'alarm_clock',
  'check': 'check_mark_button',
  'x': 'cross_mark',
  'dollar': 'money_bag',
  'users': 'delivery_truck',
  'map': 'world_map',
  'flame': 'fire',
  'trending-up': 'chart_increasing',
  'trending-down': 'chart_decreasing',
  'users-group': 'people_holding_hands',
  'bell': 'bell',
  'eye': 'eye',
  'target': 'direct_hit',
  'send': 'cloud_with_lightning_and_rain', // example
  'shield-alert': 'shield',
  'alert-triangle': 'warning',
  'alert-circle': 'exclamation_mark',
  'info': 'information',
  'gift': 'wrapped_gift',
  'history': 'hourglass_done',
  'pause': 'pause_button',
  'utensils': 'bento_box',
  'cloud-rain': 'cloud_with_rain',
  'route': 'motorway',
  'calendar': 'calendar',
  'minus': 'minus',
  'zap-bolt': 'zap',
  'search': 'magnifying_glass_tilted_left',
};

interface FluentEmojiProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  emoji: string; // Key from mapping or raw name
  size?: number;
  style?: '3d' | 'flat' | 'color';
}

/**
 * Renders a Microsoft Fluent Emoji from a global CDN.
 * Uses 3D style by default for premium aesthetics.
 */
export const FluentEmoji: React.FC<FluentEmojiProps> = ({ 
  emoji, 
  size = 24, 
  style = '3d', 
  className,
  ...props 
}) => {
  const assetName = EMOJI_MAP[emoji] || emoji;
  
  // High-performance Vercel proxy for Microsoft Fluent Emoji assets
  const src = `https://fluent-emoji.vercel.app/api/emoji?name=${assetName}&style=${style}`;

  return (
    <img
      src={src}
      alt={emoji}
      width={size}
      height={size}
      className={`inline-block align-middle shrink-0 ${className}`}
      {...props}
    />
  );
};
