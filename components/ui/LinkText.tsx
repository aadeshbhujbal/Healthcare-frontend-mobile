import React from "react";
import { Text, StyleSheet, TextProps, useColorScheme } from "react-native";

interface LinkTextProps extends TextProps {
  size?: "sm" | "base" | "lg";
  bold?: boolean;
}

const LinkText: React.FC<LinkTextProps> = ({
  children,
  size = "base",
  bold = false,
  style,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Use the same colors as defined in your theme.ts
  const linkColor = isDark ? "#3b82f6" : "#2563eb";

  return (
    <Text
      {...props}
      style={[
        getSizeStyle(size),
        bold && styles.bold,
        { color: linkColor },
        style, // Allow style prop to override defaults
      ]}
    >
      {children}
    </Text>
  );
};

const getSizeStyle = (size: "sm" | "base" | "lg") => {
  switch (size) {
    case "sm":
      return styles.sm;
    case "lg":
      return styles.lg;
    default:
      return styles.base;
  }
};

const styles = StyleSheet.create({
  sm: {
    fontSize: 14,
  },
  base: {
    fontSize: 16,
  },
  lg: {
    fontSize: 18,
  },
  bold: {
    fontWeight: "500",
  },
});

export default LinkText;
