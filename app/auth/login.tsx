import React, { useState } from "react";
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text as RNText,
} from "react-native";
import { Link, router } from "expo-router";
import { Controller } from "react-hook-form";
import { loginSchema, LoginFormData } from "~/lib/validations";
import { useZodForm, useFormStatus, useAlertDialog } from "~/lib/hooks";
import { useAuth } from "~/providers/AuthProvider";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { FormAlert } from "~/components/FormAlert";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import FormErrorText from "~/components/FormErrorText";
import LinkText from "~/components/ui/LinkText";

export default function LoginScreen() {
  const { login, requestOtp, loginWithSocial } = useAuth();
  const { isLoading, setLoading, setError } = useFormStatus();
  const { alertData, showAlert, hideAlert, errorAlert, successAlert } =
    useAlertDialog();
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [formError, setFormError] = useState<string | null>(null);

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
    setFormError(null);
    try {
      await login(data.email, data.password);
      // Navigation is handled in the AuthProvider
    } catch (error: any) {
      setError();
      setFormError(
        `Login error: ${error?.message || "[AxiosError: Network Error]"}`
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
    setFormError(null);
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
      setFormError(
        `OTP error: ${error?.message || "[AxiosError: Network Error]"}`
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
          <Text className="text-2xl font-bold text-center mb-2">
            Welcome back
          </Text>
          <Text className="text-muted-foreground text-center mb-8">
            Sign in to access your account
          </Text>

          {/* Auth method toggle */}
          <View className="flex-row mb-8 gap-2">
            <Button
              variant={authMethod === "password" ? "default" : "outline"}
              className={`flex-1 rounded ${
                authMethod === "password" ? "bg-primary" : "bg-transparent"
              }`}
              onPress={() => setAuthMethod("password")}
            >
              <Text
                className={
                  authMethod === "password"
                    ? "text-primary-foreground font-medium text-base"
                    : "text-foreground text-base"
                }
              >
                Password
              </Text>
            </Button>
            <Button
              variant={authMethod === "otp" ? "default" : "outline"}
              className={`flex-1 rounded ${
                authMethod === "otp" ? "bg-primary" : "bg-transparent"
              }`}
              onPress={() => setAuthMethod("otp")}
            >
              <Text
                className={
                  authMethod === "otp"
                    ? "text-primary-foreground font-medium text-base"
                    : "text-foreground text-base"
                }
              >
                OTP
              </Text>
            </Button>
          </View>

          <FormErrorText error={formError} />

          <View className="space-y-5 ">
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
                    className="bg-muted mb-0 h-14 px-4 text-base my-2"
                  />
                  {errors.email && (
                    <Text className="text-destructive text-xs ml-1 mt-1">
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
                        className="bg-muted mt-2 mb-0 h-14 px-4 text-base"
                      />
                      {errors.password && (
                        <Text className="text-destructive text-xs ml-1 mt-1">
                          {errors.password.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Link href="/auth/forgot-password" asChild>
                  <Button variant="link" className="p-0 self-end mb-2">
                    <LinkText size="sm">Forgot password?</LinkText>
                  </Button>
                </Link>

                <Button
                  onPress={handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className="w-full bg-primary h-14 mt-2"
                >
                  <Text className="text-primary-foreground font-semibold text-base">
                    Sign in
                  </Text>
                </Button>
                <View className="flex-row items-center my-5">
                  <View className="flex-1 h-px bg-border" />
                  <Text className="mx-4 text-muted-foreground text-sm">
                    OR CONTINUE WITH
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
              </>
            ) : (
              <>
                <Button
                  onPress={handleRequestOtp}
                  disabled={isLoading}
                  className="w-full bg-primary mt-4 h-14"
                >
                  <Text className="text-primary-foreground font-semibold text-base">
                    Get OTP
                  </Text>
                </Button>
              </>
            )}

            <View className="flex-row items-center justify-center mt-6">
              <Text className="text-muted-foreground text-base mr-1">
                Don't have an account?
              </Text>
              <Link href="/auth/register" asChild>
                <Button variant="link" className="p-0 h-auto min-h-0">
                  <LinkText size="base" bold>
                    Sign up
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
