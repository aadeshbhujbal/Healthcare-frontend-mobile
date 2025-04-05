import React from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "~/lib/useColorScheme";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Icon } from "~/components/ui/icon";

export default function AuthLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const router = useRouter();

  const HeaderLeft = () => (
    <TouchableOpacity onPress={() => router.back()} className="p-2">
      <Icon
        name="arrow-left"
        size={24}
        color={isDarkColorScheme ? "#fff" : "#000"}
      />
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: true,
          headerLeft: HeaderLeft,
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: isDarkColorScheme ? "#121212" : "#F5F7FA",
          },
          contentStyle: {
            backgroundColor: isDarkColorScheme ? "#121212" : "#F5F7FA",
          },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            headerTitle: "Login",
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerTitle: "Create an account",
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            headerTitle: "Reset Password",
          }}
        />
        <Stack.Screen
          name="reset-password"
          options={{
            headerTitle: "Set New Password",
          }}
        />
        <Stack.Screen
          name="verify-otp"
          options={{
            headerTitle: "Verify OTP",
          }}
        />
      </Stack>
    </>
  );
}
