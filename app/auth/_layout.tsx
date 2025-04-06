import React from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "~/lib/useColorScheme";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Icon } from "~/components/ui/icon";
import { ThemeToggle } from "~/components/ThemeToggle";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";

export default function AuthLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const router = useRouter();

  // Set Android navigation bar on component mount
  React.useEffect(() => {
    setAndroidNavigationBar(isDarkColorScheme ? "dark" : "light");
  }, [isDarkColorScheme]);

  const HeaderLeft = () => (
    <TouchableOpacity onPress={() => router.back()} className="p-2">
      <Icon
        name="arrow-left"
        size={24}
        color={isDarkColorScheme ? "#fff" : "#000"}
      />
    </TouchableOpacity>
  );

  const HeaderRight = () => (
    <View className="mr-4">
      <ThemeToggle />
    </View>
  );

  return (
    <>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: true,
          headerLeft: HeaderLeft,
          headerRight: HeaderRight,
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
