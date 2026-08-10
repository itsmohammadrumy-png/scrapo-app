import React from 'react';
import { Text } from 'react-native';

const ICON_MAP: { [key: string]: string } = {
  home: '🏠',
  cart: '🛒',
  'cart-outline': '🛒',
  'add-circle': '➕',
  chatbubbles: '💬',
  person: '👤',
  'person-outline': '👤',
  'settings-outline': '⚙️',
  camera: '📷',
  'checkmark-circle': '✅',
  'create-outline': '✏️',
  'document-text-outline': '📄',
  star: '⭐',
  'leaf-outline': '🌱',
  leaf: '🌱',
  'shield-checkmark-outline': '🛡️',
  'gift-outline': '🎁',
  'chevron-forward': '›',
  add: '➕',
  'location-outline': '📍',
  'receipt-outline': '🧾',
  'heart-outline': '🤍',
  heart: '❤️',
  'notifications-outline': '🔔',
  'notifications-off-outline': '🔕',
  'log-out-outline': '🚪',
  'cube-outline': '📦',
  'trash-outline': '🗑️',
  'language-outline': '🌐',
  'help-circle-outline': '❓',
  'information-circle-outline': 'ℹ️',
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export default function Icon({ name, size = 20, color = '#333', style }: IconProps) {
  const emoji = ICON_MAP[name] || '•';
  return <Text style={[{ fontSize: size, color }, style]}>{emoji}</Text>;
}
