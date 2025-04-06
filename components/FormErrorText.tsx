import React from "react";
import { Text, StyleSheet } from "react-native";

interface FormErrorTextProps {
  error: string | null;
}

const FormErrorText: React.FC<FormErrorTextProps> = ({ error }) => {
  if (!error) return null;

  return <Text style={styles.errorText}>{error}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "monospace",
  },
});

export default FormErrorText;
