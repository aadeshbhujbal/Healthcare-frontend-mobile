import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Controller } from "react-hook-form";
import { otpSchema, OtpFormData } from "~/lib/validations";
import { useZodForm, useFormStatus, useAlertDialog } from "~/lib/hooks";
import { useAuth } from "~/providers/AuthProvider";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { FormAlert } from "~/components/FormAlert";

export default function VerifyOtpScreen() {
  const params = useLocalSearchParams<{ email: string }>();
  const { loginWithOtp, requestOtp } = useAuth();
  const { isLoading, setLoading, setError } = useFormStatus();
  const { alertData, hideAlert, successAlert, errorAlert } = useAlertDialog();
  const [email, setEmail] = useState(params.email || "");

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
    const currentEmail = email || control._formValues.email;
    if (!currentEmail) {
      errorAlert("Error", "Please enter your email first");
      return;
    }

    setLoading();
    try {
      await requestOtp(currentEmail);
      setEmail(currentEmail);
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
    <View className="flex-1 bg-background p-6 justify-center">
      <FormAlert data={alertData} onClose={hideAlert} />

      <View className="bg-card rounded-lg p-6 shadow-sm border border-border">
        <Text className="text-2xl font-bold text-center mb-2">Verify OTP</Text>

        <Text className="text-muted-foreground text-center mb-6">
          Enter the verification code sent to your email
        </Text>

        <View className="space-y-4">
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
                  className="mb-1"
                />
                {errors.otp && (
                  <Text className="text-destructive text-xs ml-1">
                    {errors.otp.message}
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
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>

          <Button
            variant="outline"
            onPress={handleResendOtp}
            disabled={isLoading}
            className="w-full"
          >
            Resend Code
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
