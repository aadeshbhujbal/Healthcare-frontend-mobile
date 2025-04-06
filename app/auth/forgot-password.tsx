import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text as RNText,
} from "react-native";
import { Link, router } from "expo-router";
import { Controller } from "react-hook-form";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "~/lib/validations";
import { useZodForm, useFormStatus, useAlertDialog } from "~/lib/hooks";
import { authService } from "~/lib/api";
import { useAuth } from "~/providers/AuthProvider";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { FormAlert } from "~/components/FormAlert";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import FormErrorText from "~/components/FormErrorText";
import LinkText from "~/components/ui/LinkText";
import { apiClient } from "~/lib/api";
import { testBackendConnectionV2 } from "~/lib/utils/connection-test-v2";

export default function ForgotPasswordScreen() {
  const { loginWithSocial } = useAuth();
  const { isLoading, setLoading, setError, setSuccess } = useFormStatus();
  const { alertData, hideAlert, successAlert, errorAlert } = useAlertDialog();
  const [resetMethod, setResetMethod] = useState<"email" | "otp">("email");
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useZodForm<ForgotPasswordFormData>({
    schema: forgotPasswordSchema,
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading();
    setFormError(null);
    try {
      // Test the backend connection first with our improved utility
      const connectionTest = await testBackendConnectionV2();
      console.log("Connection test result:", connectionTest);

      if (!connectionTest.success) {
        setError();
        setFormError(
          `Server connection error: ${connectionTest.error}. Make sure your backend is running and accessible.`
        );
        return;
      }

      console.log("Current API URL:", apiClient?.defaults?.baseURL);
      await authService.forgotPassword(data.email);
      setSuccess();
      successAlert(
        "Reset Email Sent",
        "Check your email for password reset instructions",
        {
          label: "Back to Login",
          onClick: () => router.replace("/auth/login"),
        }
      );
    } catch (error: any) {
      setError();
      // More detailed error logging
      if (error.response) {
        console.error(
          "Server response error:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("Network error details:", JSON.stringify(error.request));
      } else {
        console.error("Error details:", error.message);
      }

      setFormError(
        `Password reset error: ${
          error?.message || "[AxiosError: Network Error]"
        }`
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      <FormAlert data={alertData} onClose={hideAlert} />

      <ScrollView
        contentContainerClassName="p-6 flex-1 justify-center"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-card rounded-xl p-6 shadow-md border border-border">
          <Text className="text-2xl font-bold text-center mb-3">
            Reset your password
          </Text>

          <Text className="text-muted-foreground text-center mb-8">
            Choose how you want to reset your password
          </Text>

          {/* Reset method toggle */}
          <View className="flex-row mb-8">
            <Button
              variant={resetMethod === "email" ? "default" : "outline"}
              className={`flex-1 rounded-r-none ${
                resetMethod === "email" ? "bg-primary" : "bg-transparent"
              }`}
              onPress={() => setResetMethod("email")}
            >
              <Text
                className={
                  resetMethod === "email"
                    ? "text-primary-foreground font-medium text-base"
                    : "text-foreground text-base"
                }
              >
                Reset via Email
              </Text>
            </Button>
            <Button
              variant={resetMethod === "otp" ? "default" : "outline"}
              className={`flex-1 rounded-l-none ${
                resetMethod === "otp" ? "bg-primary" : "bg-transparent"
              }`}
              onPress={() => setResetMethod("otp")}
            >
              <Text
                className={
                  resetMethod === "otp"
                    ? "text-primary-foreground font-medium text-base"
                    : "text-foreground text-base"
                }
              >
                Reset via OTP
              </Text>
            </Button>
          </View>

          <FormErrorText error={formError} />

          <View className="space-y-5">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    placeholder="Enter your email address"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="bg-muted h-14 px-4 text-base"
                  />
                  {errors.email && (
                    <Text className="text-destructive text-xs ml-1 mt-1">
                      {errors.email.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Button
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full bg-primary h-14 mt-2"
            >
              <Text className="text-primary-foreground font-semibold text-base">
                {resetMethod === "email" ? "Send Reset Link" : "Send OTP"}
              </Text>
            </Button>

            <View className="flex-row items-center justify-center mt-6">
              <Link href="/auth/login" asChild>
                <Button variant="link" className="p-0 h-auto min-h-0">
                  <LinkText size="base" bold>
                    Back to Login
                  </LinkText>
                </Button>
              </Link>
            </View>

            <View className="flex-row items-center my-5">
              <View className="flex-1 h-px bg-border" />
              <Text className="mx-4 text-muted-foreground text-sm">
                OR LOGIN WITH
              </Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            <SocialLoginButtons
              onSocialLogin={(provider, token) => {
                setLoading();
                loginWithSocial(provider, token)
                  .then(() => {
                    // Navigation is handled in the AuthProvider
                  })
                  .catch((error) => {
                    setError();
                    // Use the SocialLoginButtons component's internal error handling
                    // The component will display the error message
                    throw error; // Re-throw to let the component handle the display
                  });
              }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
