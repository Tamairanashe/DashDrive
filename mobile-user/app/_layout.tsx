import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/phone-login" />
            <Stack.Screen name="auth/otp" />
            <Stack.Screen name="auth/register-options" />
            <Stack.Screen name="auth/email" />
            <Stack.Screen name="auth/name" />
            <Stack.Screen name="setup/payment-method" />
            <Stack.Screen name="setup/add-card" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="search" />
            <Stack.Screen name="negotiation/fare-input" />
            <Stack.Screen name="negotiation/broadcasting" />
            <Stack.Screen name="negotiation/tracking" />
            <Stack.Screen name="negotiation/completed" />
            <Stack.Screen name="pilot" />
            <Stack.Screen name="food/index" />
            <Stack.Screen name="mart/index" />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
