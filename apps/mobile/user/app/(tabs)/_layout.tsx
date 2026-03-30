import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'nativewind';
import { StyledIonicons } from '../../src/lib/interop';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const activeColor = '#00ff90'; // DashDrive Emerald
  const inactiveColor = colorScheme === 'dark' ? '#52525b' : '#a1a1aa';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000000' : '#ffffff',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'uber-medium',
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <StyledIonicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rent"
        options={{
          title: 'Rent',
          tabBarIcon: ({ color, size }) => (
            <StyledIonicons name="car" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size }) => (
            <StyledIonicons name="time" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => (
            <StyledIonicons name="wallet" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <StyledIonicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
