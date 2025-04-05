import React from 'react';
import { Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

export function Icon({ name, size = 24, color, className }: IconProps) {
  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color}
      style={className ? { color } : undefined}
    />
  );
}
