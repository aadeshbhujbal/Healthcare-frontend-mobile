import React, { useState, useEffect } from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Controller } from "react-hook-form";
import { otpSchema, OtpFormData } from "~/lib/validations";
import { useZodForm, useFormStatus, useAlertDialog } from "~/lib/hooks";
import { useAuth } from "~/providers/AuthProvider";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { FormAlert } from "~/components/FormAlert";
import LinkText from "~/components/ui/LinkText";

export default function VerifyOtpScreen() {
  const params = useLocalSearchParams<{ email: string }>();
  const { loginWithOtp, requestOtp } = useAuth();
  const { isLoading, setLoading, setError } = useFormStatus();
  const { alertData, hideAlert, successAlert, errorAlert } = useAlertDialog();
  const [email, setEmail] = useState(params.email || "");
  const [countdown, setCountdown] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useZodForm<OtpFormData>({
    schema: otpSchema,
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  // Set email from URL params if available
  useEffect(() => {
    if (params.email) {
      setValue("email", params.email);
      setEmail(params.email);
    }
  }, [params.email, setValue]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data: OtpFormData) => {
    setLoading();
    try {
      await loginWithOtp(data.email, data.otp);
      // Navigation is handled in the AuthProvider after successful login
    } catch (error: any) {
      setError();
      errorAlert(
        "Verification Failed",
        error.message || "Invalid OTP. Please try again."
      );
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    const currentEmail = email || control._formValues.email;
    if (!currentEmail) {
      errorAlert("Error", "Please enter your email first");
      return;
    }

    setLoading();
    try {
      await requestOtp(currentEmail);
      setEmail(currentEmail);
      setCountdown(60); // Set 60 seconds countdown
      successAlert("Success", "A new OTP has been sent to your email");
    } catch (error: any) {
      setError();
      errorAlert(
        "Failed to send OTP",
        error.message || "An error occurred. Please try again."
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
            Verify OTP
          </Text>

          <Text className="text-muted-foreground text-center mb-8">
            Enter the verification code sent to your email
          </Text>

          <View className="space-y-5">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    placeholder="Email"
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      setEmail(text);
                    }}
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

            <Controller
              control={control}
              name="otp"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    placeholder="Verification code"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="number-pad"
                    maxLength={6}
                    className="bg-muted h-14 px-4 text-base"
                  />
                  {errors.otp && (
                    <Text className="text-destructive text-xs ml-1 mt-1">
                      {errors.otp.message}
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
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Text>
            </Button>

            <View className="flex-row items-center justify-center mt-6">
              {countdown > 0 ? (
                <Button
                  variant="link"
                  className="p-0 h-auto min-h-0"
                  onPress={handleResendOtp}
                  disabled={isLoading}
                >
                  <LinkText size="base" bold>
                    Resend Code
                  </LinkText>
                </Button>
              ) : (
                <Text className="text-muted-foreground">
                  Resend code in{" "}
                  <Text className="font-semibold">{countdown}s</Text>
                </Text>
              )}
            </View>

            <View className="flex-row items-center justify-center mt-4">
              <Link href="/auth/login" asChild>
                <Button variant="link" className="p-0 h-auto min-h-0">
                  <LinkText size="base" bold>
                    Back to Login
                  </LinkText>
                </Button>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
