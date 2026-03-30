import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useDeviceType } from '@/src/hooks/useDeviceType';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint;
  const { isTablet } = useDeviceType();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        headerShown: useClientOnlyValue(false, true),
      }}>
      {isTablet ? [
        <Tabs.Screen
          key="orders"
          name="orders"
          options={{
            title: 'Orders',
            tabBarIcon: ({ color }) => <TabBarIcon name="receipt-outline" color={color} />,
          }}
        />,
        <Tabs.Screen
          key="home"
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <TabBarIcon name="home-outline" color={color} />,
          }}
        />,
        <Tabs.Screen
          key="issues"
          name="issues"
          options={{
            title: 'Issues',
            tabBarIcon: ({ color }) => <TabBarIcon name="alert-circle-outline" color={color} />,
          }}
        />,
        <Tabs.Screen
          key="stores"
          name="stores"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <TabBarIcon name="settings-outline" color={color} />,
          }}
        />,
        <Tabs.Screen
          key="account"
          name="account"
          options={{
            href: null, // Hide Account on Tablet per mission-critical minimal UI
          }}
        />
      ] : [
        <Tabs.Screen
          key="home"
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <TabBarIcon name="home-outline" color={color} />,
          }}
        />,
        <Tabs.Screen
          key="orders"
          name="orders"
          options={{
            title: 'Orders',
            tabBarIcon: ({ color }) => <TabBarIcon name="receipt-outline" color={color} />,
          }}
        />,
        <Tabs.Screen
          key="issues"
          name="issues"
          options={{
            title: 'Issues',
            tabBarIcon: ({ color }) => <TabBarIcon name="alert-circle-outline" color={color} />,
          }}
        />,
        <Tabs.Screen
          key="stores"
          name="stores"
          options={{
            title: 'Stores',
            tabBarIcon: ({ color }) => <TabBarIcon name="business-outline" color={color} />,
          }}
        />,
        <Tabs.Screen
          key="account"
          name="account"
          options={{
            title: 'Account',
            tabBarIcon: ({ color }) => <TabBarIcon name="person-outline" color={color} />,
          }}
        />
      ]}
    </Tabs>
  );
}
