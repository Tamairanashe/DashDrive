import { Stack } from "expo-router";

export default function PilotLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="request-detail" />
            <Stack.Screen name="pickup-navigation" />
            <Stack.Screen name="trip-active" />
            <Stack.Screen name="trip-completed" />
            <Stack.Screen name="chat" />
            <Stack.Screen name="call" />
            <Stack.Screen name="video-call" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="promotions" />
            <Stack.Screen name="earnings" />
        </Stack>
    );
}
