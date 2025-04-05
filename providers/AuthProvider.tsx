import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { authService, userService, User } from "../lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  loginWithOtp: (email: string, otp: string) => Promise<void>;
  requestOtp: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already logged in
    const checkAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          // Verify if the token is valid
          const isValid = await authService.verifyToken();
          if (isValid) {
            // Get user profile using the userService instead
            const userProfile = await userService.getUserProfile();
            setUser(userProfile);
            setToken(storedToken);
            // Navigate to the appropriate dashboard based on role
            navigateBasedOnRole(userProfile.role);
          } else {
            // Token is invalid, try to refresh
            try {
              const refreshResult = await authService.refreshToken();
              setUser(refreshResult.user);
              setToken(refreshResult.token);
              // Navigate to the appropriate dashboard based on role
              navigateBasedOnRole(refreshResult.user.role);
            } catch (refreshError) {
              // Refresh failed, clear storage
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("refreshToken");
              setUser(null);
              setToken(null);
            }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const navigateBasedOnRole = (role?: string) => {
    if (!role) return;

    switch (role.toLowerCase()) {
      case "patient":
        router.replace("/dashboard/(patient)");
        break;
      case "doctor":
        router.replace("/dashboard/(doctor)");
        break;
      case "admin":
      case "superadmin":
        router.replace("/dashboard/(super-admin)");
        break;
      default:
        router.replace("/dashboard");
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login({ email, password });
      setUser(result.user);
      setToken(result.token);
      navigateBasedOnRole(result.user.role);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const result = await authService.register(userData);
      setUser(result.user);
      setToken(result.token);
      navigateBasedOnRole(result.user.role);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOtp = async (email: string, otp: string) => {
    setIsLoading(true);
    try {
      const result = await authService.verifyOtp({ email, otp });
      setUser(result.user);
      setToken(result.token);
      navigateBasedOnRole(result.user.role);
    } catch (error) {
      console.error("OTP Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async (email: string) => {
    try {
      await authService.requestOtp({ email });
    } catch (error) {
      console.error("Request OTP error:", error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    loginWithOtp,
    requestOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
