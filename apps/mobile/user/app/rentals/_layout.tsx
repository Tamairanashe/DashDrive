import { Stack } from 'expo-router';
import React from 'react';

export default function RentalsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="search" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_bottom'
        }} 
      />
      <Stack.Screen 
        name="onboarding" 
        options={{ 
          headerShown: false,
          presentation: 'fullScreenModal'
        }} 
      />
      <Stack.Screen 
        name="book" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_bottom'
        }} 
      />
      <Stack.Screen 
        name="trips/index" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }} 
      />
      <Stack.Screen 
        name="trips/[id]" 
        options={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }} 
      />
    </Stack>
  );
}
