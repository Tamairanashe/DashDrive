import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { StyledIonicons } from '@/src/lib/interop';
import { CarCard } from '@/src/components/rentals/CarCard';
import { StatusBar } from 'expo-status-bar';

const MOCK_CARS = [
  {
    id: '1',
    brand: 'Nissan',
    model: 'Versa',
    category: 'Compact',
    seats: 5,
    bags: 3,
    pricePerDay: 49,
    totalPrice: 99,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    brand: 'Ford',
    model: 'Focus',
    category: 'Compact',
    seats: 5,
    bags: 3,
    pricePerDay: 49,
    totalPrice: 99,
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '3',
    brand: 'Toyota',
    model: 'RAV4',
    category: 'SUV',
    seats: 5,
    bags: 4,
    pricePerDay: 65,
    totalPrice: 130,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop',
  },
];

export default function RentalsSearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('The Westin St. Francis San Francisco');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="px-6 pt-4 pb-2 flex-row items-center justify-between border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <StyledIonicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-uber-bold text-secondary">Choose your car</Text>
        <TouchableOpacity>
          <StyledIonicons name="options-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search & Filters Bar */}
      <View className="px-6 py-4 flex-row gap-3">
        <TouchableOpacity className="flex-1 bg-gray-100 px-4 py-2 rounded-full flex-row items-center">
          <StyledIonicons name="calendar-outline" size={18} color="black" />
          <Text className="ml-2 font-uber-medium text-sm">02/8-02/9</Text>
          <StyledIonicons name="chevron-down" size={14} color="gray" className="ml-1" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-[2] bg-gray-100 px-4 py-2 rounded-full flex-row items-center">
          <StyledIonicons name="location-outline" size={18} color="black" />
          <Text className="ml-2 font-uber-medium text-sm" numberOfLines={1}>{searchQuery}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Promotion Banner */}
        <View className="mx-6 mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex-row items-center">
          <View className="mr-3">
            <StyledIonicons name="pricetag-outline" size={24} color="#10b981" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-uber-bold text-emerald-900">Get up to $10 in Dash ride credit</Text>
            <Text className="text-xs text-emerald-700 font-uber">Enjoy a discounted ride to pick up your rental car</Text>
          </View>
          <StyledIonicons name="information-circle-outline" size={16} color="#10b981" />
        </View>

        {/* Results List */}
        <View className="px-6">
          {MOCK_CARS.map((car) => (
            <CarCard 
              key={car.id}
              {...car}
              onPress={() => router.push(`/rentals/${car.id}` as any)}
            />
          ))}
        </View>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
