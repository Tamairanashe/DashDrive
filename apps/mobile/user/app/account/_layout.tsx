import { Stack } from "expo-router";

export default function AccountLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="wallet" />
            <Stack.Screen name="history" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="saved-places" />
        </Stack>
    );
}
