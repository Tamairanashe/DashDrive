import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { StyledIonicons } from '@/src/lib/interop';
import { StatusBar } from 'expo-status-bar';

export default function RentalSettingsScreen() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View className="px-6 pt-4 pb-2 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <StyledIonicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-uber-bold text-secondary">Rental Settings</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          <Text className="text-sm font-uber-bold text-gray-400 uppercase tracking-widest mb-6">Notifications</Text>
          
          <View className="flex-row items-center justify-between mb-8">
             <View className="flex-1">
                <Text className="text-lg font-uber-medium text-secondary">Push Notifications</Text>
                <Text className="text-sm text-gray-500 font-uber">Get trip updates and host messages</Text>
             </View>
             <Switch 
               value={pushEnabled} 
               onValueChange={setPushEnabled} 
               trackColor={{ false: '#e5e7eb', true: '#10b981' }}
             />
          </View>

          <View className="flex-row items-center justify-between mb-8">
             <View className="flex-1">
                <Text className="text-lg font-uber-medium text-secondary">Email Updates</Text>
                <Text className="text-sm text-gray-500 font-uber">Receive receipts and promotional offers</Text>
             </View>
             <Switch 
               value={emailEnabled} 
               onValueChange={setEmailEnabled} 
               trackColor={{ false: '#e5e7eb', true: '#10b981' }}
             />
          </View>

          <Text className="text-sm font-uber-bold text-gray-400 uppercase tracking-widest mb-6 mt-4">Vehicle Requirements</Text>

          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-50">
             <View className="flex-1">
                <Text className="text-lg font-uber-medium text-secondary">Driver's License</Text>
                <Text className="text-sm text-emerald-600 font-uber-bold">Verified</Text>
             </View>
             <StyledIonicons name="chevron-forward" size={20} color="#adadad" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-50">
             <View className="flex-1">
                <Text className="text-lg font-uber-medium text-secondary">Insurance Protection</Text>
                <Text className="text-sm text-gray-500 font-uber">Standard plan selected</Text>
             </View>
             <StyledIonicons name="chevron-forward" size={20} color="#adadad" />
          </TouchableOpacity>

          <TouchableOpacity className="mt-10 bg-red-50 p-4 rounded-xl flex-row items-center">
             <StyledIonicons name="trash-outline" size={20} color="#ef4444" />
             <Text className="ml-3 text-red-500 font-uber-bold">Delete rental profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
