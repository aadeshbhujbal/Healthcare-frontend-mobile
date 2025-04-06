import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { AppleIcon, GoogleIcon } from "../components/Icons";
import socialAuthService from "../lib/api/social-auth";

interface SocialButtonProps {
  provider: "google" | "apple";
  onPress: () => void;
  loading?: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onPress,
  loading,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <TouchableOpacity
      style={[
        styles.socialButton,
        { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" },
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isDark ? "#F8FAFC" : "#0F172A"}
        />
      ) : (
        <>
          {provider === "google" ? (
            <GoogleIcon width={24} height={24} />
          ) : (
            <AppleIcon width={24} height={24} />
          )}
          <Text
            style={[
              styles.socialButtonText,
              { color: isDark ? "#F8FAFC" : "#0F172A" },
            ]}
          >
            {provider === "google"
              ? "Continue with Google"
              : "Continue with Apple"}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

interface SocialLoginButtonsProps {
  onSocialLogin: (provider: "google" | "apple", token: string) => void;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onSocialLogin,
}) => {
  const [configuration, setConfiguration] = useState<{
    google: { enabled: boolean };
    apple: { enabled: boolean };
  } | null>(null);
  const [loading, setLoading] = useState<{ google: boolean; apple: boolean }>({
    google: false,
    apple: false,
  });
  const [checkingConfig, setCheckingConfig] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    const checkSocialConfig = async () => {
      try {
        const config = await socialAuthService.checkConfiguration();
        setConfiguration(config);
      } catch (error) {
        // Only show error in UI, not in console
        setConfiguration({
          google: { enabled: true },
          apple: { enabled: true },
        });
      } finally {
        setCheckingConfig(false);
      }
    };

    checkSocialConfig();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading((prev) => ({ ...prev, google: true }));
    setError(null);

    try {
      // For testing purposes - set a fake error
      setError("Network error or timeout: Network Error");
      // Comment this line for production

      // Implement Google Sign-In logic here
      // You would typically use a library like @react-native-google-signin/google-signin
      // This is a placeholder - implement the actual Google login flow
      // const token = "google-token"; // Replace with actual token
      // onSocialLogin("google", token);

      // For testing - simulate loading and error
      await new Promise((resolve) => setTimeout(resolve, 1000));
      throw new Error("Network Error");
    } catch (error: any) {
      // Display error in the component
      setError(
        `Network error or timeout: ${error?.message || "Network Error"}`
      );
    } finally {
      setLoading((prev) => ({ ...prev, google: false }));
    }
  };

  const handleAppleLogin = async () => {
    setLoading((prev) => ({ ...prev, apple: true }));
    setError(null);
    try {
      // For testing purposes - set a fake error
      setError("Register error: [AxiosError: Network Error]");
      // Comment this line for production

      // Implement Apple Sign-In logic here
      // You would typically use a library like @invertase/react-native-apple-authentication
      // This is a placeholder - implement the actual Apple login flow
      // const token = "apple-token"; // Replace with actual token
      // onSocialLogin("apple", token);

      // For testing - simulate loading and error
      await new Promise((resolve) => setTimeout(resolve, 1000));
      throw new Error("[AxiosError: Network Error]");
    } catch (error: any) {
      // Display error in the component
      setError(
        `Register error: ${error?.message || "[AxiosError: Network Error]"}`
      );
    } finally {
      setLoading((prev) => ({ ...prev, apple: false }));
    }
  };

  if (checkingConfig) {
    return null; // Or a loading spinner
  }

  // If no social logins are enabled, don't render anything
  if (!configuration?.google.enabled && !configuration?.apple.enabled) {
    return null;
  }

  return (
    <View style={styles.container}>
      {error && (
        <Text style={[styles.errorText, { color: "#EF4444" }]}>{error}</Text>
      )}

      {configuration?.google.enabled && (
        <SocialButton
          provider="google"
          onPress={handleGoogleLogin}
          loading={loading.google}
        />
      )}

      {configuration?.apple.enabled && (
        <SocialButton
          provider="apple"
          onPress={handleAppleLogin}
          loading={loading.apple}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 16,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: "100%",
    gap: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "monospace",
  },
});

export default SocialLoginButtons;
