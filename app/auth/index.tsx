import React from "react";
import { View, Image } from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function AuthScreen() {
  return (
    <View className="flex-1 bg-primary">
      <StatusBar style="light" />

      <View className="flex-1 justify-center items-center px-6 pt-12">
        <Image
          source={require("../../assets/images/icon.png")}
          className="h-32 w-32 mb-8"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-white text-center mb-2">
          Health Care App
        </Text>
        <Text className="text-xl text-white/80 text-center mb-12">
          Your personal healthcare companion
        </Text>
      </View>

      <View className="px-6 mb-8 space-y-4">
        <Link href="/auth/login" asChild>
          <Button className="w-full h-14 bg-white" variant="default">
            <Text className="text-primary font-bold text-lg">Sign In</Text>
          </Button>
        </Link>

        <Link href="/auth/register" asChild>
          <Button
            className="w-full h-14 border-2 border-white"
            variant="outline"
          >
            <Text className="text-white font-bold text-lg">Create Account</Text>
          </Button>
        </Link>
      </View>

      <View className="items-center mb-8">
        <Text className="text-white/70 text-sm mb-2">
          By continuing, you agree to our
        </Text>
        <View className="flex-row justify-center">
          <Button variant="link" className="p-0 h-auto">
            <Text className="text-white font-medium text-sm">
              Terms of Service
            </Text>
          </Button>
          <Text className="text-white/70 mx-1"> and </Text>
          <Button variant="link" className="p-0 h-auto">
            <Text className="text-white font-medium text-sm">
              Privacy Policy
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
