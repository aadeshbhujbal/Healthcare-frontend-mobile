import React, { useState } from "react";
import { View } from "react-native";
import { Link, router } from "expo-router";
import { Controller } from "react-hook-form";
import { loginSchema, LoginFormData } from "~/lib/validations";
import { useZodForm, useFormStatus, useAlertDialog } from "~/lib/hooks";
import { useAuth } from "~/providers/AuthProvider";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { FormAlert } from "~/components/FormAlert";

export default function LoginScreen() {
  const { login, requestOtp } = useAuth();
  const { isLoading, setLoading, setError } = useFormStatus();
  const { alertData, showAlert, hideAlert, errorAlert, successAlert } =
    useAlertDialog();
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useZodForm<LoginFormData>({
    schema: loginSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading();
    try {
      await login(data.email, data.password);
      // Navigation is handled in the AuthProvider
    } catch (error: any) {
      setError();
      errorAlert(
        "Login Failed",
        error.message || "An error occurred during login"
      );
    }
  };

  const handleRequestOtp = async () => {
    const email = getValues("email");
    if (!email) {
      errorAlert("Error", "Please enter your email");
      return;
    }

    setLoading();
    try {
      await requestOtp(email);
      successAlert(
        "OTP Sent",
        "A verification code has been sent to your email",
        {
          label: "Verify OTP",
          onClick: () => {
            router.push({
              pathname: "/auth/verify-otp",
              params: { email },
            });
          },
        }
      );
    } catch (error: any) {
      setError();
      errorAlert(
        "Failed to Send OTP",
        error.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <View className="flex-1 bg-background p-6 justify-center">
      <FormAlert data={alertData} onClose={hideAlert} />

      <View className="bg-card rounded-lg p-6 shadow-sm border border-border">
        <Text className="text-2xl font-bold text-center mb-6">
          Welcome back
        </Text>
        <Text className="text-muted-foreground text-center mb-6">
          Sign in to access your account
        </Text>

        {/* Auth method toggle */}
        <View className="flex-row mb-6">
          <Button
            variant={authMethod === "password" ? "default" : "outline"}
            className="flex-1 rounded-r-none"
            onPress={() => setAuthMethod("password")}
          >
            <Text
              className={
                authMethod === "password" ? "text-primary-foreground" : ""
              }
            >
              Password
            </Text>
          </Button>
          <Button
            variant={authMethod === "otp" ? "default" : "outline"}
            className="flex-1 rounded-l-none"
            onPress={() => setAuthMethod("otp")}
          >
            <Text
              className={authMethod === "otp" ? "text-primary-foreground" : ""}
            >
              OTP
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
                  placeholder="Email"
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

          {authMethod === "password" ? (
            <>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Input
                      placeholder="Password"
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

              <Link href="/auth/forgot-password" asChild>
                <Button variant="link" className="p-0 self-end mb-4">
                  <Text>Forgot password?</Text>
                </Button>
              </Link>

              <Button
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="w-full"
              >
                <Text>Sign in</Text>
              </Button>
            </>
          ) : (
            <>
              <Button
                onPress={handleRequestOtp}
                disabled={isLoading}
                className="w-full"
              >
                <Text>Get OTP</Text>
              </Button>
            </>
          )}

          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-muted-foreground">
              Don't have an account?
            </Text>
            <Link href="/auth/register" asChild>
              <Button variant="link" className="p-0">
                <Text>Sign up</Text>
              </Button>
            </Link>
          </View>

          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-border" />
            <Text className="mx-4 text-muted-foreground">OR CONTINUE WITH</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          <View className="flex-row justify-center space-x-4">
            <Button
              variant="outline"
              className="flex-1"
              onPress={() => {}}
              disabled={isLoading}
            >
              <Text>Google</Text>
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onPress={() => {}}
              disabled={isLoading}
            >
              <Text>Apple</Text>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
