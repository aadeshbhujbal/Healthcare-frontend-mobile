import React from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Controller } from "react-hook-form";
import { resetPasswordSchema, ResetPasswordFormData } from "~/lib/validations";
import { useZodForm, useFormStatus, useAlertDialog } from "~/lib/hooks";
import { authService } from "~/lib/api";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { FormAlert } from "~/components/FormAlert";
import LinkText from "~/components/ui/LinkText";

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { isLoading, setLoading, setError, setSuccess } = useFormStatus();
  const { alertData, hideAlert, successAlert, errorAlert } = useAlertDialog();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useZodForm<ResetPasswordFormData>({
    schema: resetPasswordSchema,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      errorAlert(
        "Error",
        "Reset token is missing. Please use the link from the email."
      );
      return;
    }

    setLoading();
    try {
      await authService.resetPassword({ token, password: data.password });
      setSuccess();
      successAlert(
        "Password Reset Successful",
        "Your password has been reset successfully.",
        {
          label: "Login Now",
          onClick: () => router.replace("/auth/login"),
        }
      );
    } catch (error: any) {
      setError();
      errorAlert(
        "Password Reset Failed",
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
            Reset Password
          </Text>

          <Text className="text-muted-foreground text-center mb-8">
            Enter your new password below
          </Text>

          <View className="space-y-5">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    placeholder="New Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    className="bg-muted h-14 px-4 text-base"
                  />
                  {errors.password && (
                    <Text className="text-destructive text-xs ml-1 mt-1">
                      {errors.password.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    placeholder="Confirm New Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    className="bg-muted h-14 px-4 text-base"
                  />
                  {errors.confirmPassword && (
                    <Text className="text-destructive text-xs ml-1 mt-1">
                      {errors.confirmPassword.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {!token && (
              <View className="bg-destructive/10 p-4 rounded-md mb-3">
                <Text className="text-destructive text-base">
                  Reset token is missing. Please use the link from the email.
                </Text>
              </View>
            )}

            <Button
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading || !token}
              className="w-full bg-primary h-14 mt-2"
            >
              <Text className="text-primary-foreground font-semibold text-base">
                {isLoading ? "Resetting..." : "Reset Password"}
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
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
