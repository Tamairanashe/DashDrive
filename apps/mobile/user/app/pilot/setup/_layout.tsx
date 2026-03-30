import { Stack } from "expo-router";
import React from "react";

export default function PilotSetupLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="welcome" />
            <Stack.Screen name="terms" />
            <Stack.Screen name="preferences" />
            <Stack.Screen name="vehicle-info" />
            <Stack.Screen name="documents" />
            <Stack.Screen name="doc-upload" />
            <Stack.Screen name="completion" />
        </Stack>
    );
}
