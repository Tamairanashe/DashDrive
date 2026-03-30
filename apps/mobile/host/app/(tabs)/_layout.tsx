import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Supply Hub',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'bus.fill',
                android: 'local_shipping',
                web: 'local_shipping',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'clock.fill',
                android: 'history',
                web: 'history',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
    </Tabs>
  );
}
