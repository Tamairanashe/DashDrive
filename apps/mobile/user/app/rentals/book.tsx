import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { StyledIonicons } from '@/src/lib/interop';
import { StatusBar } from 'expo-status-bar';

export default function BookingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View className="px-6 pt-4 pb-2 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <StyledIonicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-uber-bold text-secondary">Confirm booking</Text>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        
        {/* Car Summary */}
        <View className="flex-row border-b border-gray-100 pb-6">
          <View className="flex-1">
            <Text className="text-xl font-uber-bold text-secondary">Nissan Versa</Text>
            <Text className="text-gray-500 font-uber">Compact • 2024</Text>
          </View>
          <View className="w-24 h-16 bg-gray-100 rounded-lg" />
        </View>

        {/* Schedule */}
        <View className="mt-6 border-b border-gray-100 pb-6">
          <Text className="text-sm font-uber-bold text-gray-400 uppercase tracking-widest mb-4">Dates & Location</Text>
          
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-4">
               <StyledIonicons name="calendar" size={20} color="black" />
            </View>
            <View>
              <Text className="font-uber-bold text-secondary">Feb 10 - Feb 12</Text>
              <Text className="text-xs text-gray-500 font-uber">2 days duration</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-4">
               <StyledIonicons name="location" size={20} color="black" />
            </View>
            <View>
              <Text className="font-uber-bold text-secondary">The Westin St. Francis</Text>
              <Text className="text-xs text-gray-500 font-uber">Pick up & Return</Text>
            </View>
          </View>
        </View>

        {/* Price Breakdown */}
        <View className="mt-6">
           <Text className="text-sm font-uber-bold text-gray-400 uppercase tracking-widest mb-4">Price details</Text>
           <View className="flex-row justify-between mb-2">
              <Text className="font-uber text-gray-600">$49.00 x 2 days</Text>
              <Text className="font-uber-medium text-secondary">$98.00</Text>
           </View>
           <View className="flex-row justify-between mb-2">
              <Text className="font-uber text-gray-600">Insurance (Standard)</Text>
              <Text className="font-uber-medium text-emerald-600">Included</Text>
           </View>
           <View className="flex-row justify-between mb-2">
              <Text className="font-uber text-gray-600">Platform fee</Text>
              <Text className="font-uber-medium text-secondary">$1.00</Text>
           </View>
           <View className="flex-row justify-between mt-4 border-t border-gray-100 pt-4">
              <Text className="font-uber-bold text-lg text-secondary">Total price</Text>
              <Text className="font-uber-bold text-lg text-secondary">$99.00</Text>
           </View>
        </View>

        <View className="mt-10 bg-zinc-900 p-4 rounded-xl">
           <View className="flex-row items-center mb-2">
              <StyledIonicons name="card" size={20} color="white" />
              <Text className="ml-2 font-uber-bold text-white">Payment Method</Text>
           </View>
           <Text className="text-gray-400 font-uber text-sm">Visa ending in 4242</Text>
        </View>

        <View className="h-20" />
      </ScrollView>

      <View className="px-6 py-6 border-t border-gray-100 bg-white">
        <TouchableOpacity className="w-full bg-emerald-500 py-4 rounded-xl items-center justify-center shadow-lg">
          <Text className="text-white font-uber-bold text-lg">Confirm booking</Text>
        </TouchableOpacity>
        <Text className="text-center text-[10px] text-gray-400 mt-4 px-4 font-uber">
            By tapping confirm, you agree to our Terms of Service and Rental Agreement.
        </Text>
      </View>
    </SafeAreaView>
  );
}
