import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyledIonicons } from '@/src/lib/interop';
import { StatusBar } from 'expo-status-bar';

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock data for the specific car
  const car = {
    brand: 'Nissan',
    model: 'Versa',
    year: 2024,
    category: 'Compact',
    seats: 5,
    bags: 3,
    fuel: 'Gasoline',
    transmission: 'Automatic',
    pricePerDay: 49,
    host: {
      name: 'Alex R.',
      rating: 4.9,
      trips: 156,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop'
    },
    features: ['Bluetooth', 'USB Input', 'Backup Camera', 'Apple CarPlay'],
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop'
    ]
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View className="relative h-64 bg-gray-100">
          <Image 
            source={{ uri: car.images[0] }} 
            className="w-full h-full"
            resizeMode="cover"
          />
          <TouchableOpacity 
            onPress={() => router.back()}
            className="absolute top-4 left-6 h-10 w-10 bg-white rounded-full items-center justify-center shadow-md"
          >
            <StyledIonicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View className="absolute top-4 right-6 flex-row gap-3">
             <TouchableOpacity className="h-10 w-10 bg-white rounded-full items-center justify-center shadow-md">
                <StyledIonicons name="share-outline" size={22} color="black" />
             </TouchableOpacity>
             <TouchableOpacity className="h-10 w-10 bg-white rounded-full items-center justify-center shadow-md">
                <StyledIonicons name="heart-outline" size={22} color="black" />
             </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 py-6">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-3xl font-uber-bold text-secondary">{car.category}</Text>
              <Text className="text-lg text-gray-500 font-uber">{car.brand} {car.model} {car.year}</Text>
            </View>
            <View className="items-end">
               <Text className="text-2xl font-uber-bold text-secondary">${car.pricePerDay}</Text>
               <Text className="text-sm font-uber text-gray-500">per day</Text>
            </View>
          </View>

          {/* Specs Row */}
          <View className="flex-row mt-8 border-y border-gray-100 py-4 justify-between">
            <View className="items-center">
              <StyledIonicons name="people-outline" size={24} color="#52525b" />
              <Text className="mt-1 text-xs font-uber-medium text-gray-600">{car.seats} Seats</Text>
            </View>
            <View className="items-center">
              <StyledIonicons name="briefcase-outline" size={24} color="#52525b" />
              <Text className="mt-1 text-xs font-uber-medium text-gray-600">{car.bags} Bags</Text>
            </View>
            <View className="items-center">
              <StyledIonicons name="settings-outline" size={24} color="#52525b" />
              <Text className="mt-1 text-xs font-uber-medium text-gray-600">{car.transmission}</Text>
            </View>
            <View className="items-center">
              <StyledIonicons name="water-outline" size={24} color="#52525b" />
              <Text className="mt-1 text-xs font-uber-medium text-gray-600">{car.fuel}</Text>
            </View>
          </View>

          {/* Host Info */}
          <View className="mt-8">
            <Text className="text-xl font-uber-bold text-secondary mb-4">Hosted by</Text>
            <View className="flex-row items-center">
              <Image source={{ uri: car.host.avatar }} className="w-14 h-14 rounded-full mr-4" />
              <View className="flex-1">
                <Text className="text-lg font-uber-bold text-secondary">{car.host.name}</Text>
                <View className="flex-row items-center mt-1">
                  <StyledIonicons name="star" size={14} color="#fbbf24" />
                  <Text className="ml-1 text-sm font-uber-medium text-gray-600">{car.host.rating} • {car.host.trips} trips</Text>
                </View>
              </View>
              <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
                <StyledIonicons name="chatbubble-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Features */}
          <View className="mt-8">
            <Text className="text-xl font-uber-bold text-secondary mb-4">Features</Text>
            <View className="flex-row flex-wrap gap-2">
              {car.features.map((f) => (
                <View key={f} className="bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                  <Text className="font-uber-medium text-gray-700 text-sm">{f}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Policies */}
          <View className="mt-8 mb-10">
            <Text className="text-xl font-uber-bold text-secondary mb-4">Policies</Text>
            <View className="space-y-4">
              <View className="flex-row items-start mb-4">
                <StyledIonicons name="calendar-outline" size={24} color="black" className="mr-4" />
                <View className="flex-1 ml-4">
                  <Text className="font-uber-bold text-secondary">Free cancellation</Text>
                  <Text className="text-gray-500 text-sm font-uber">Up to 24 hours before your trip starts.</Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <StyledIonicons name="shield-checkmark-outline" size={24} color="black" className="mr-4" />
                <View className="flex-1 ml-4">
                  <Text className="font-uber-bold text-secondary">Insurance & Protection</Text>
                  <Text className="text-gray-500 text-sm font-uber">Standard protection included in the price.</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Footer Button */}
      <View className="px-6 py-6 border-t border-gray-100 bg-white">
        <TouchableOpacity className="w-full bg-black py-4 rounded-xl items-center justify-center shadow-lg">
          <Text className="text-white font-uber-bold text-lg">Continue to booking</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
