import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "~/providers/AuthProvider";
import { useColorScheme } from "~/lib/useColorScheme";
import { View, ActivityIndicator } from "react-native";
import { Text } from "~/components/ui/text";

export default function DashboardLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isDarkColorScheme } = useColorScheme();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text className="mt-4 text-foreground">Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    // Redirect happens in AuthProvider, this is just a fallback
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-foreground text-center">
          You need to be logged in to access this section.
        </Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: true,
          contentStyle: {
            backgroundColor: isDarkColorScheme ? "#121212" : "#F5F7FA",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Dashboard",
          }}
        />
        <Stack.Screen
          name="(patient)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(doctor)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(super-admin)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
