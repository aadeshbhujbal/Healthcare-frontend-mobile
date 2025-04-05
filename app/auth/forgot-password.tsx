import React, { useState } from "react";
import { View } from "react-native";
import { Link, router } from "expo-router";
import { Controller } from "react-hook-form";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "~/lib/validations";
import { useZodForm, useFormStatus, useAlertDialog } from "~/lib/hooks";
import { authService } from "~/lib/api";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { FormAlert } from "~/components/FormAlert";

export default function ForgotPasswordScreen() {
  const { isLoading, setLoading, setError, setSuccess } = useFormStatus();
  const { alertData, hideAlert, successAlert, errorAlert } = useAlertDialog();
  const [resetMethod, setResetMethod] = useState<"email" | "otp">("email");

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
    try {
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
      errorAlert(
        "Request Failed",
        error.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <View className="flex-1 bg-background p-6 justify-center">
      <FormAlert data={alertData} onClose={hideAlert} />

      <View className="bg-card rounded-lg p-6 shadow-sm border border-border">
        <Text className="text-2xl font-bold text-center mb-4">
          Reset your password
        </Text>

        <Text className="text-muted-foreground text-center mb-6">
          Choose how you want to reset your password
        </Text>

        {/* Reset method toggle */}
        <View className="flex-row mb-6">
          <Button
            variant={resetMethod === "email" ? "default" : "outline"}
            className="flex-1 rounded-r-none"
            onPress={() => setResetMethod("email")}
          >
            <Text
              className={
                resetMethod === "email" ? "text-primary-foreground" : ""
              }
            >
              Reset via Email
            </Text>
          </Button>
          <Button
            variant={resetMethod === "otp" ? "default" : "outline"}
            className="flex-1 rounded-l-none"
            onPress={() => setResetMethod("otp")}
          >
            <Text
              className={resetMethod === "otp" ? "text-primary-foreground" : ""}
            >
              Reset via OTP
            </Text>
          </Button>
        </View>

        <View className="space-y-4">
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
                  className="mb-1"
                />
                {errors.email && (
                  <Text className="text-destructive text-xs ml-1">
                    {errors.email.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="w-full"
          >
            <Text>
              {resetMethod === "email" ? "Send Reset Link" : "Send OTP"}
            </Text>
          </Button>

          <View className="items-center mt-4">
            <Link href="/auth/login" asChild>
              <Button variant="link" className="p-0">
                <Text>Back to Login</Text>
              </Button>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}
