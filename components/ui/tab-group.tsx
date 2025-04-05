import React from 'react';
import { View } from 'react-native';
import { Button } from './button';
import { Text } from './text';

interface TabGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  items: Array<{
    value: string;
    label: string;
  }>;
}

export function TabGroup({ value, onValueChange, items }: TabGroupProps) {
  return (
    <View className="flex-row space-x-2">
      {items.map((item) => (
        <Button
          key={item.value}
          variant={value === item.value ? 'default' : 'outline'}
          className="flex-1"
          onPress={() => onValueChange(item.value)}
        >
          <Text
            className={value === item.value ? 'text-primary-foreground' : ''}
          >
            {item.label}
          </Text>
        </Button>
      ))}
    </View>
  );
}
