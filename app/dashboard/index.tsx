import React, { useEffect } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { useAuth } from "~/providers/AuthProvider";
import { router } from "expo-router";
import { useAlertDialog } from "~/lib/hooks";
import { FormAlert } from "~/components/FormAlert";

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const { alertData, hideAlert, showAlert } = useAlertDialog();

  useEffect(() => {
    // Redirect based on user role if it exists
    if (user?.role) {
      const role = user.role.toLowerCase();
      switch (role) {
        case "doctor":
          router.replace("/dashboard/(doctor)");
          break;
        case "patient":
          router.replace("/dashboard/(patient)");
          break;
        case "admin":
        case "super_admin":
        case "superadmin":
          router.replace("/dashboard/(super-admin)");
          break;
        default:
          // Stay on this page if role is unknown
          break;
      }
    }
  }, [user]);

  const handleLogout = () => {
    showAlert({
      title: "Logout Confirmation",
      description: "Are you sure you want to log out?",
      variant: "destructive",
      action: {
        label: "Logout",
        onClick: () => logout(),
      },
      cancelLabel: "Cancel",
    });
  };

  return (
    <View className="flex-1 p-6 bg-background">
      <FormAlert data={alertData} onClose={hideAlert} />

      <Card className="w-full">
        <CardHeader>
          <Text className="text-2xl font-bold">
            Welcome, {user?.firstName || "User"}!
          </Text>
          <Text className="text-sm text-muted-foreground">
            You are logged in as {user?.role ? user.role.toLowerCase() : "user"}
          </Text>
        </CardHeader>

        <CardContent>
          <View className="space-y-4">
            <Text className="text-base">
              Redirecting you to your dashboard...
            </Text>

            <Button onPress={handleLogout} variant="destructive">
              <Text className="text-primary-foreground">Logout</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
