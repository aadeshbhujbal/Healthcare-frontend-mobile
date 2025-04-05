import React from "react";
import { View } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Controller } from "react-hook-form";
import { resetPasswordSchema, ResetPasswordFormData } from "~/lib/validations";
import { useZodForm, useFormStatus, useAlertDialog } from "~/lib/hooks";
import { authService } from "~/lib/api";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { FormAlert } from "~/components/FormAlert";

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
    <View className="flex-1 bg-background p-6 justify-center">
      <FormAlert data={alertData} onClose={hideAlert} />

      <View className="bg-card rounded-lg p-6 shadow-sm border border-border">
        <Text className="text-2xl font-bold text-center mb-2">
          Reset Password
        </Text>

        <Text className="text-muted-foreground text-center mb-6">
          Enter your new password below
        </Text>

        <View className="space-y-4">
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
                  className="mb-1"
                />
                {errors.password && (
                  <Text className="text-destructive text-xs ml-1">
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
                  className="mb-1"
                />
                {errors.confirmPassword && (
                  <Text className="text-destructive text-xs ml-1">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>
            )}
          />

          {!token && (
            <Text className="text-destructive text-sm">
              Reset token is missing. Please use the link from the email.
            </Text>
          )}

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading || !token}
            className="w-full"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
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
