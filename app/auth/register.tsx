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
import { registerSchema, RegisterFormData } from "~/lib/validations";
import { useZodForm, useFormStatus, useAlertDialog } from "~/lib/hooks";
import { useAuth } from "~/providers/AuthProvider";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { FormAlert } from "~/components/FormAlert";
import { Checkbox } from "~/components/ui/checkbox";
import SocialLoginButtons from "~/components/SocialLoginButtons";
import FormErrorText from "~/components/FormErrorText";
import LinkText from "~/components/ui/LinkText";
import { apiClient } from "~/lib/api";
import { testBackendConnectionV2 } from "~/lib/utils/connection-test-v2";

export default function RegisterScreen() {
  const { register, loginWithSocial } = useAuth();
  const { isLoading, setLoading, setError } = useFormStatus();
  const { alertData, showAlert, hideAlert, errorAlert } = useAlertDialog();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useZodForm<RegisterFormData>({
    schema: registerSchema,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading();
    setFormError(null);

    // Log the data being sent
    console.log("Attempting to register with data:", JSON.stringify(data));

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

      // We need to structure the data to match what the API expects
      const registerData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        acceptTerms: data.acceptTerms,
      };

      console.log("Sending to API:", JSON.stringify(registerData));
      console.log("Current API URL:", apiClient?.defaults?.baseURL);

      await register(registerData);
      // Navigation is handled by the AuthProvider
    } catch (error: any) {
      setError();
      console.error("Registration failed:", error);
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
        `Register error: ${error?.message || "[AxiosError: Network Error]"}`
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
            Create an account
          </Text>

          <Text className="text-muted-foreground text-center mb-6">
            Enter your information to create an account
          </Text>

          <View className="flex-row items-center my-5">
            <View className="flex-1 h-px bg-border" />
            <Text className="mx-4 text-muted-foreground text-sm">
              SIGN UP WITH
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

          <View className="flex-row items-center my-5">
            <View className="flex-1 h-px bg-border" />
            <Text className="mx-4 text-muted-foreground text-sm">
              OR CONTINUE WITH EMAIL
            </Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          <FormErrorText error={formError} />

          <View className="space-y-4 flex-col gap-3">
            <View className="flex-row space-x-3 gap-3">
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex-1">
                    <Input
                      placeholder="First name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      className="bg-muted h-14 px-4 text-base"
                    />
                    {errors.firstName && (
                      <Text className="text-destructive text-xs ml-1 mt-1">
                        {errors.firstName.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="flex-1">
                    <Input
                      placeholder="Last name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      className="bg-muted h-14 px-4 text-base"
                    />
                    {errors.lastName && (
                      <Text className="text-destructive text-xs ml-1 mt-1">
                        {errors.lastName.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    placeholder="name@example.com"
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

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    placeholder="Phone number"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="phone-pad"
                    className="bg-muted h-14 px-4 text-base"
                  />
                  {errors.phone && (
                    <Text className="text-destructive text-xs ml-1 mt-1">
                      {errors.phone.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    placeholder="Create a password"
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
                    placeholder="Confirm your password"
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

            <Controller
              control={control}
              name="acceptTerms"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row items-start self-center justify-center mt-3">
                  <Checkbox
                    checked={value}
                    onCheckedChange={onChange}
                    className="mt-1 mr-2"
                  />
                  <Text className="flex-1 text-base mt-0.5 text-muted-foreground">
                    I accept the{" "}
                    <Text className="text-link font-medium">
                      terms and conditions
                    </Text>
                  </Text>
                  {errors.acceptTerms && (
                    <Text className="text-destructive text-xs ml-1 mt-1">
                      {errors.acceptTerms.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Button
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full mt-5 bg-primary h-14"
            >
              <Text className="text-primary-foreground font-semibold text-base">
                Create account
              </Text>
            </Button>

            <View className="flex-row items-center justify-center mt-5">
              <Text className="text-muted-foreground text-base mr-1">
                Already have an account?
              </Text>
              <Link href="/auth/login" asChild>
                <Button variant="link" className="p-0 h-auto min-h-0">
                  <LinkText size="base" bold>
                    Sign in
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
