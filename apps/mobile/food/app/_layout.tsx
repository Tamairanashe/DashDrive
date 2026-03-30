import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/components/useColorScheme';
import { supabase } from '../src/lib/supabase';
import { useAuthStore } from '../src/store/useAuthStore';
import { useRouter, useSegments } from 'expo-router';
import { notificationService } from '../src/services/notificationService';
import '../src/services/notificationHandler';
import * as Notifications from 'expo-notifications';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { PaperProvider } from "react-native-paper";
import { DashFoodDarkTheme } from "@/src/theme/theme";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootLayoutNav />
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading, setUser, setLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 0. Handle Notification Taps (Deep Linking)
    const notificationSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as { orderId?: string };
      if (data?.orderId) {
        // Deep link to orders tab
        router.push('/(tabs)/orders');
      }
    });

    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 2. Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      notificationSubscription.remove();
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('id, role, name')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Profile fetch error:', error.message);
    } else if (data) {
      setUser(data as any);
    } else {
      console.warn('No profile record found in public.users');
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [user, loading, segments]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={DashFoodDarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
