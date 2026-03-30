import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { StyledIonicons } from '../../src/lib/interop';
import { StatusBar } from 'expo-status-bar';

export default function RentHomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="auto" />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header Section */}
        <View className="px-6 pt-4 pb-2 flex-row justify-between items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <StyledIonicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center bg-gray-100 px-4 py-2 rounded-full shadow-sm">
            <StyledIonicons name="calendar-outline" size={18} color="black" />
            <Text className="ml-2 font-uber-medium text-sm">Reservations</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View className="px-6 mt-4">
          <Text className="text-4xl font-uber-bold tracking-tight text-secondary leading-tight">
            The road is yours{'\n'}with Dash Rent
          </Text>
        </View>

        {/* Illustration */}
        <View className="w-full h-48 mt-4 overflow-hidden">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop' }} 
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Selection Card */}
        <View className="mx-6 -mt-10 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-4">
          
          {/* Pick up location */}
          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
            <View className="mr-4">
              <StyledIonicons name="location-sharp" size={24} color="black" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 font-uber">Pick up & return near</Text>
              <Text className="text-lg font-uber-medium" numberOfLines={1}>
                The Westin St. Francis San Francis...
              </Text>
            </View>
            <StyledIonicons name="chevron-forward" size={20} color="#adadad" />
          </TouchableOpacity>

          {/* Start Date */}
          <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
            <View className="mr-4 relative items-center justify-center">
              <View className="w-2 h-2 rounded-full bg-black" />
              <View className="w-0.5 h-8 bg-black absolute top-2" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 font-uber">Reservation starts</Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-uber-medium">Fri, Feb 10</Text>
                <Text className="text-lg font-uber-medium">12:00 PM</Text>
              </View>
            </View>
            <StyledIonicons name="chevron-forward" size={20} color="#adadad" className="ml-2" />
          </TouchableOpacity>

          {/* End Date */}
          <TouchableOpacity className="flex-row items-center py-4">
            <View className="mr-4 items-center justify-center">
              <View className="w-2 h-2 bg-black" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 font-uber">Reservation ends</Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-uber-medium">Sun, Feb 12</Text>
                <Text className="text-lg font-uber-medium">12:00 PM</Text>
              </View>
            </View>
            <StyledIonicons name="chevron-forward" size={20} color="#adadad" className="ml-2" />
          </TouchableOpacity>

          {/* Action Button */}
          <TouchableOpacity 
            onPress={() => router.push('/rentals/search' as any)}
            className="bg-black py-4 mt-6 rounded-lg items-center justify-center shadow-lg"
          >
            <Text className="text-white font-uber-bold text-lg">Find cars</Text>
          </TouchableOpacity>
        </View>

        {/* Categories/Shortcuts */}
        <View className="px-6 mt-8">
          <Text className="text-xl font-uber-bold text-secondary mb-4">Browse by type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
            {['SUV', 'Electric', 'Luxury', 'Sedan', 'Van'].map((cat) => (
              <TouchableOpacity 
                key={cat}
                className="bg-gray-50 p-4 rounded-xl mr-3 border border-gray-100 w-28 items-center"
              >
                <StyledIonicons name="car-outline" size={32} color="black" />
                <Text className="mt-2 font-uber-medium">{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Links */}
        <View className="px-6 mt-10">
           <Text className="text-xl font-uber-bold text-secondary mb-4">Quick actions</Text>
           
           <TouchableOpacity 
             onPress={() => router.push('/rentals/trips' as any)}
             className="flex-row items-center py-4 border-b border-gray-100"
           >
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
                 <StyledIonicons name="time" size={20} color="#3b82f6" />
              </View>
              <Text className="flex-1 text-lg font-uber-medium text-secondary">View your trips</Text>
              <StyledIonicons name="chevron-forward" size={20} color="#adadad" />
           </TouchableOpacity>

           <TouchableOpacity 
             onPress={() => router.push('/rentals/host/onboarding' as any)}
             className="flex-row items-center py-4 border-b border-gray-100"
           >
              <View className="w-10 h-10 bg-emerald-50 rounded-full items-center justify-center mr-4">
                 <StyledIonicons name="key" size={20} color="#10b981" />
              </View>
              <Text className="flex-1 text-lg font-uber-medium text-secondary">Become a host</Text>
              <StyledIonicons name="chevron-forward" size={20} color="#adadad" />
           </TouchableOpacity>

           <TouchableOpacity 
             onPress={() => router.push('/rentals/verification' as any)}
             className="flex-row items-center py-4 border-b border-gray-100"
           >
              <View className="w-10 h-10 bg-indigo-50 rounded-full items-center justify-center mr-4">
                 <StyledIonicons name="shield-checkmark" size={20} color="#6366f1" />
              </View>
              <Text className="flex-1 text-lg font-uber-medium text-secondary">Verify your license</Text>
              <StyledIonicons name="chevron-forward" size={20} color="#adadad" />
           </TouchableOpacity>

           <TouchableOpacity 
             onPress={() => router.push('/rentals/settings' as any)}
             className="flex-row items-center py-4"
           >
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
                 <StyledIonicons name="settings" size={20} color="gray" />
              </View>
              <Text className="flex-1 text-lg font-uber-medium text-secondary">Rental settings</Text>
              <StyledIonicons name="chevron-forward" size={20} color="#adadad" />
           </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
