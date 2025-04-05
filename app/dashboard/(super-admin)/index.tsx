import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/providers/AuthProvider";

export default function SuperAdminDashboardScreen() {
  const { user, logout } = useAuth();

  // Get admin name from API response with fallbacks
  const adminName = user?.name
    ? user.name
    : user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : "Admin";

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <Text className="text-2xl font-bold">Super Admin Dashboard</Text>
            <Text className="text-sm text-muted-foreground">
              Welcome back, {adminName}
            </Text>
          </CardHeader>
          <CardContent>
            <View className="space-y-4">
              <Text className="text-base">
                Here you can manage doctors, patients, and system settings.
              </Text>
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Text className="text-xl font-semibold">Quick Actions</Text>
          </CardHeader>
          <CardContent>
            <View className="space-y-4">
              <Button>
                <Text className="text-primary-foreground">Manage Doctors</Text>
              </Button>
              <Button>
                <Text className="text-primary-foreground">Manage Patients</Text>
              </Button>
              <Button>
                <Text className="text-primary-foreground">System Settings</Text>
              </Button>
            </View>
          </CardContent>
        </Card>

        <Button onPress={logout} variant="destructive">
          <Text className="text-primary-foreground">Sign Out</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
