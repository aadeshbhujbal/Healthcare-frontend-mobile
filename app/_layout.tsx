import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, View } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { AuthProvider } from "~/providers/AuthProvider";
import { QueryProvider } from "~/providers/QueryProvider";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isAppReady, setIsAppReady] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    async function prepareApp() {
      try {
        if (Platform.OS === "web") {
          // Adds the background color to the html element to prevent white background on overscroll.
          document.documentElement.classList.add("bg-background");
        }
        setAndroidNavigationBar(colorScheme);

        // Here you could add any initialization like pre-loading fonts, etc.
        // await Font.loadAsync({...});

        // Wait a moment for everything to be properly set up
        await new Promise((resolve) => setTimeout(resolve, 50));
      } catch (e) {
        console.warn("Error loading app resources:", e);
      } finally {
        setIsAppReady(true);
        hasMounted.current = true;
      }
    }

    prepareApp();
  }, [colorScheme]);

  React.useEffect(() => {
    if (isAppReady) {
      // Hide the splash screen once the app is ready
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <QueryProvider>
        <AuthProvider>
          <PortalHost name="root" />
          <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
          <Stack
            screenOptions={{
              headerShown: true,
              headerRight: () => (
                <View className="mr-4">
                  <ThemeToggle />
                </View>
              ),
              // Add animation and gesture handling
              animation: "slide_from_right",
              animationDuration: 200,
              gestureEnabled: true,
              // Optimize header rendering
              headerTitleAlign: "center",
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                title: "Welcome",
              }}
            />
            <Stack.Screen
              name="auth"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="dashboard"
              options={{
                title: "Dashboard",
                headerShown: false,
              }}
            />
          </Stack>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
