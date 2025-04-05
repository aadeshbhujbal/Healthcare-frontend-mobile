import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/providers/AuthProvider";

export default function PatientDashboardScreen() {
  const { user, logout } = useAuth();

  // Get patient name from API response with fallbacks
  const patientName = user?.name
    ? user.name
    : user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : "Patient";

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <Text className="text-2xl font-bold">Patient Dashboard</Text>
            <Text className="text-sm text-muted-foreground">
              Welcome back, {patientName}
            </Text>
          </CardHeader>
          <CardContent>
            <View className="space-y-4">
              <Text className="text-base">
                Here you can manage your appointments, medical records, and
                prescriptions.
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
                  Book Appointment
                </Text>
              </Button>
              <Button>
                <Text className="text-primary-foreground">
                  View Medical Records
                </Text>
              </Button>
              <Button>
                <Text className="text-primary-foreground">
                  My Prescriptions
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
