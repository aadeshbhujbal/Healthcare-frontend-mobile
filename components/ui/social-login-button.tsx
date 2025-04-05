import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from './text';
import { Icon } from './icon';

interface SocialLoginButtonProps {
  provider: 'google' | 'facebook' | 'apple';
  onPress: () => void;
  disabled?: boolean;
}

export function SocialLoginButton({
  provider,
  onPress,
  disabled = false,
}: SocialLoginButtonProps) {
  const getProviderIcon = () => {
    switch (provider) {
      case 'google':
        return 'google';
      case 'facebook':
        return 'facebook';
      case 'apple':
        return 'apple';
      default:
        return 'help-circle';
    }
  };

  const getProviderColor = () => {
    switch (provider) {
      case 'google':
        return 'bg-white border-gray-300';
      case 'facebook':
        return 'bg-[#1877F2] border-[#1877F2]';
      case 'apple':
        return 'bg-black border-black';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getTextColor = () => {
    switch (provider) {
      case 'google':
        return 'text-gray-700';
      case 'facebook':
      case 'apple':
        return 'text-white';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`w-12 h-12 rounded-full border items-center justify-center ${getProviderColor()} ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      {disabled ? (
        <ActivityIndicator color={provider === 'apple' ? '#fff' : '#000'} />
      ) : (
        <Icon name={getProviderIcon()} size={24} className={getTextColor()} />
      )}
    </TouchableOpacity>
  );
}
