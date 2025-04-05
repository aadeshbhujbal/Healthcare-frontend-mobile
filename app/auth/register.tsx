import React from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link } from "expo-router";
import { Controller } from "react-hook-form";
import { registerSchema, RegisterFormData } from "~/lib/validations";
import { useZodForm, useFormStatus, useAlertDialog } from "~/lib/hooks";
import { useAuth } from "~/providers/AuthProvider";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { FormAlert } from "~/components/FormAlert";
import { Checkbox } from "~/components/ui/checkbox";

export default function RegisterScreen() {
  const { register } = useAuth();
  const { isLoading, setLoading, setError } = useFormStatus();
  const { alertData, hideAlert, errorAlert } = useAlertDialog();

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
      password: "",
      confirmPassword: "",
      phone: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading();
    try {
      await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        acceptTerms: data.acceptTerms,
      });
      // Navigation handled in AuthProvider after successful registration
    } catch (error: any) {
      setError();
      errorAlert(
        "Registration Failed",
        error.message || "An error occurred during registration"
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
        contentContainerClassName="p-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-card rounded-lg p-6 shadow-sm border border-border">
          <Text className="text-2xl font-bold text-center mb-4">
            Create an account
          </Text>
          <Text className="text-muted-foreground text-center mb-6">
            Enter your information to create an account
          </Text>

          <View className="flex-row justify-center space-x-4 mb-6">
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

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-border" />
            <Text className="mx-4 text-muted-foreground">
              OR CONTINUE WITH EMAIL
            </Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          <View className="space-y-4">
            <View className="flex-row space-x-4">
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
                      className="mb-1"
                    />
                    {errors.firstName && (
                      <Text className="text-destructive text-xs ml-1">
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
                      className="mb-1"
                    />
                    {errors.lastName && (
                      <Text className="text-destructive text-xs ml-1">
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
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Input
                    placeholder="Phone number"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="phone-pad"
                    className="mb-1"
                  />
                  {errors.phone && (
                    <Text className="text-destructive text-xs ml-1">
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
                    placeholder="Confirm your password"
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

            <Controller
              control={control}
              name="acceptTerms"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row items-start">
                  <Checkbox
                    checked={value}
                    onCheckedChange={onChange}
                    className="mt-1 mr-2"
                  />
                  <Text className="flex-1 text-sm text-muted-foreground">
                    I accept the{" "}
                    <Text className="text-primary">terms and conditions</Text>
                  </Text>
                  {errors.acceptTerms && (
                    <Text className="text-destructive text-xs ml-1">
                      {errors.acceptTerms.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Button
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full mt-2"
            >
              <Text>Create account</Text>
            </Button>

            <View className="flex-row justify-center mt-4">
              <Text className="text-muted-foreground">
                Already have an account?
              </Text>
              <Link href="/auth/login" asChild>
                <Button variant="link" className="p-0">
                  <Text>Sign in</Text>
                </Button>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
