import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StyledIonicons } from "@/src/lib/interop";
import { StatusBar } from 'expo-status-bar';

const MOCK_TRIPS = [
  {
    id: 't1',
    status: 'Upcoming',
    car: 'Nissan Versa',
    dates: 'Feb 10 - Feb 12',
    location: 'Westin St. Francis',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 't2',
    status: 'Active',
    car: 'Toyota RAV4',
    dates: 'Jan 20 - Jan 25',
    location: 'SFO Airport',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop'
  }
];

export default function TripsListScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View className="px-6 pt-4 pb-2 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <StyledIonicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-uber-bold text-secondary">Your Trips</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {MOCK_TRIPS.map((trip) => (
            <TouchableOpacity 
              key={trip.id}
              onPress={() => router.push(`/rentals/trips/${trip.id}` as any)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden"
            >
              <View className="h-40 w-full relative">
                <Image source={{ uri: trip.image }} className="w-full h-full" resizeMode="cover" />
                <View className={`absolute top-4 right-4 px-3 py-1 rounded-full ${trip.status === 'Active' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                   <Text className="text-white font-uber-bold text-xs">{trip.status}</Text>
                </View>
              </View>
              <View className="p-4">
                 <Text className="text-lg font-uber-bold text-secondary">{trip.car}</Text>
                 <View className="flex-row items-center mt-1">
                    <StyledIonicons name="calendar-outline" size={14} color="gray" />
                    <Text className="ml-2 text-sm text-gray-500 font-uber">{trip.dates}</Text>
                 </View>
                 <View className="flex-row items-center mt-1">
                    <StyledIonicons name="location-outline" size={14} color="gray" />
                    <Text className="ml-2 text-sm text-gray-500 font-uber">{trip.location}</Text>
                 </View>
              </View>
            </TouchableOpacity>
          ))}

          {MOCK_TRIPS.length === 0 && (
            <View className="items-center justify-center py-20">
               <StyledIonicons name="car-outline" size={80} color="#e5e7eb" />
               <Text className="text-xl font-uber-bold text-gray-400 mt-4">No trips yet</Text>
               <TouchableOpacity 
                 onPress={() => router.push('/rentals' as any)}
                 className="mt-6 bg-black px-8 py-3 rounded-full"
               >
                  <Text className="text-white font-uber-bold">Book a trip</Text>
               </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
