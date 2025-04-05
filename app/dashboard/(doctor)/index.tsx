import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/providers/AuthProvider";

export default function DoctorDashboardScreen() {
  const { user, logout } = useAuth();

  // Get doctor name from API response with fallbacks
  const doctorName = user?.name
    ? `Dr. ${user.name}`
    : user?.firstName && user?.lastName
    ? `Dr. ${user.firstName} ${user.lastName}`
    : "Doctor";

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <Text className="text-2xl font-bold">Doctor Dashboard</Text>
            <Text className="text-sm text-muted-foreground">
              Welcome back, {doctorName}
            </Text>
          </CardHeader>
          <CardContent>
            <View className="space-y-4">
              <Text className="text-base">
                Here you can manage your appointments, patients, and medical
                records.
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
                <Text className="text-primary-foreground">
                  View Appointments
                </Text>
              </Button>
              <Button>
                <Text className="text-primary-foreground">Patient Records</Text>
              </Button>
              <Button>
                <Text className="text-primary-foreground">
                  Write Prescriptions
                </Text>
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
