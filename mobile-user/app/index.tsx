import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { Animated, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      // Navigate to Home Tab
      router.replace("/(tabs)" as any);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-primary">
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Animated.View style={{ opacity: fadeAnim }} className="items-center">
        <Text className="text-6xl font-uber-bold text-secondary dark:text-zinc-900 tracking-tighter">
          DashDrive
        </Text>
        <View className="h-2 w-12 bg-secondary dark:bg-zinc-900 self-end mr-2" />
      </Animated.View>
    </View>
  );
}
