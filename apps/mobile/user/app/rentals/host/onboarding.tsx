import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StyledIonicons } from '@/src/lib/interop';
import { StatusBar } from 'expo-status-bar';

export default function HostOnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <TouchableOpacity 
        onPress={() => router.back()}
        className="px-6 pt-4 pb-2"
      >
        <StyledIonicons name="close" size={28} color="black" />
      </TouchableOpacity>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          <Text className="text-4xl font-uber-bold text-secondary mb-4 leading-tight">
            Become a host{'\n'}and start earning
          </Text>
          <Text className="text-lg text-gray-500 font-uber mb-10">
            Share your car and earn money when you aren't using it. It's simple, secure, and rewarding.
          </Text>

          <View className="space-y-8 mb-10">
            <View className="flex-row items-start mb-8">
              <View className="w-12 h-12 bg-emerald-50 rounded-2xl items-center justify-center mr-4">
                 <StyledIonicons name="cash-outline" size={24} color="#10b981" />
              </View>
              <View className="flex-1">
                 <Text className="text-lg font-uber-bold text-secondary">Earn extra income</Text>
                 <Text className="text-gray-500 font-uber">The average host earns over $500/month per car.</Text>
              </View>
            </View>

            <View className="flex-row items-start mb-8">
              <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mr-4">
                 <StyledIonicons name="shield-outline" size={24} color="#3b82f6" />
              </View>
              <View className="flex-1">
                 <Text className="text-lg font-uber-bold text-secondary">You're protected</Text>
                 <Text className="text-gray-500 font-uber">We provide insurance and 24/7 roadside assistance.</Text>
              </View>
            </View>

            <View className="flex-row items-start mb-8">
              <View className="w-12 h-12 bg-indigo-50 rounded-2xl items-center justify-center mr-4">
                 <StyledIonicons name="calendar-clear-outline" size={24} color="#6366f1" />
              </View>
              <View className="flex-1">
                 <Text className="text-lg font-uber-bold text-secondary">Flexibility</Text>
                 <Text className="text-gray-500 font-uber">You choose when and how often you'd like to share.</Text>
              </View>
            </View>
          </View>

          <View className="h-64 rounded-3xl overflow-hidden bg-gray-100 mb-6">
            <Image 
               source={{ uri: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop' }} 
               className="w-full h-full" 
               resizeMode="cover" 
            />
          </View>
        </View>
      </ScrollView>

      <View className="px-6 py-6 border-t border-gray-100 bg-white">
        <TouchableOpacity 
          onPress={() => router.push('/rentals/host/list-car' as any)}
          className="w-full bg-black py-4 rounded-xl items-center justify-center shadow-lg"
        >
          <Text className="text-white font-uber-bold text-lg">List your car</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
