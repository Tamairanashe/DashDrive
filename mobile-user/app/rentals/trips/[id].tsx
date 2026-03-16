import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyledIonicons } from "@/src/lib/interop";
import { StatusBar } from 'expo-status-bar';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="h-64 relative bg-gray-100">
           <Image 
             source={{ uri: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop' }} 
             className="w-full h-full" 
             resizeMode="cover" 
           />
           <TouchableOpacity 
             onPress={() => router.back()}
             className="absolute top-4 left-6 h-10 w-10 bg-white rounded-full items-center justify-center shadow-md"
           >
             <StyledIonicons name="arrow-back" size={24} color="black" />
           </TouchableOpacity>
        </View>

        <View className="px-6 py-8">
           <View className="flex-row justify-between items-center mb-6">
              <View>
                 <Text className="text-3xl font-uber-bold text-secondary">Trip detail</Text>
                 <Text className="text-lg text-emerald-600 font-uber-bold">Confirmed</Text>
              </View>
              <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
                 <StyledIonicons name="chatbubble-outline" size={24} color="black" />
              </TouchableOpacity>
           </View>

           {/* Quick Actions */}
           <View className="flex-row gap-4 mb-8">
              <TouchableOpacity className="flex-1 bg-black py-4 rounded-xl items-center">
                 <StyledIonicons name="camera-outline" size={24} color="white" />
                 <Text className="text-white font-uber-medium mt-2">Check-in</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-gray-100 py-4 rounded-xl items-center">
                 <StyledIonicons name="receipt-outline" size={24} color="black" />
                 <Text className="text-secondary font-uber-medium mt-2">Receipt</Text>
              </TouchableOpacity>
           </View>

           {/* Details */}
           <View className="space-y-6">
              <View className="border-b border-gray-100 pb-6 mb-6">
                 <Text className="text-sm font-uber-bold text-gray-400 uppercase tracking-widest mb-4">Dates</Text>
                 <Text className="text-lg font-uber-medium text-secondary">Feb 10, 10:00 AM – Feb 12, 11:00 AM</Text>
              </View>

              <View className="border-b border-gray-100 pb-6 mb-6">
                 <Text className="text-sm font-uber-bold text-gray-400 uppercase tracking-widest mb-4">Location</Text>
                 <Text className="text-lg font-uber-medium text-secondary">The Westin St. Francis San Francisco on Union Square</Text>
                 <TouchableOpacity className="mt-2 flex-row items-center">
                    <Text className="text-blue-600 font-uber-bold">Get directions</Text>
                    <StyledIonicons name="navigate-outline" size={16} color="#2563eb" className="ml-1" />
                 </TouchableOpacity>
              </View>

              <View className="border-b border-gray-100 pb-6 mb-6">
                 <Text className="text-sm font-uber-bold text-gray-400 uppercase tracking-widest mb-4">Host</Text>
                 <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-gray-100 rounded-full mr-3" />
                    <Text className="text-lg font-uber-medium text-secondary">Alex R.</Text>
                 </View>
              </View>

              <View className="mt-4">
                 <TouchableOpacity className="flex-row items-center">
                    <StyledIonicons name="close-circle-outline" size={20} color="#ef4444" />
                    <Text className="ml-2 text-red-500 font-uber-bold">Cancel trip</Text>
                 </TouchableOpacity>
              </View>
           </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
