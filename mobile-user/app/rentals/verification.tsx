import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StyledIonicons } from '@/src/lib/interop';
import { StatusBar } from 'expo-status-bar';

export default function VerificationScreen() {
  const router = useRouter();
  const [scanComplete, setScanComplete] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View className="px-6 pt-4 pb-2 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <StyledIonicons name="close" size={28} color="black" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-uber-bold text-secondary">Verify Identity</Text>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
         {!scanComplete ? (
           <View>
              <Text className="text-2xl font-uber-bold text-secondary mb-2">Scan your license</Text>
              <Text className="text-gray-500 font-uber mb-8">We need to verify your driver's license before you can book a trip.</Text>
              
              <View className="h-64 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl items-center justify-center mb-8 overflow-hidden">
                 <View className="items-center">
                    <StyledIonicons name="scan-outline" size={64} color="#adadad" />
                    <Text className="text-gray-400 font-uber-medium mt-4">Place license in frame</Text>
                 </View>
              </View>

              <View className="space-y-6">
                 <View className="flex-row items-start">
                    <View className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center mr-4">
                       <Text className="text-blue-600 font-uber-bold">1</Text>
                    </View>
                    <View className="flex-1">
                       <Text className="font-uber-bold text-secondary">Front of license</Text>
                       <Text className="text-gray-500 text-sm font-uber">Make sure all details are clearly visible.</Text>
                    </View>
                 </View>
                 <View className="flex-row items-start mt-6">
                    <View className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center mr-4">
                       <Text className="text-blue-600 font-uber-bold">2</Text>
                    </View>
                    <View className="flex-1">
                       <Text className="font-uber-bold text-secondary">Back of license</Text>
                       <Text className="text-gray-500 text-sm font-uber">Scan the barcode on the back.</Text>
                    </View>
                 </View>
              </View>
           </View>
         ) : (
           <View className="items-center justify-center py-20">
              <View className="h-24 w-24 bg-emerald-100 rounded-full items-center justify-center mb-6">
                 <StyledIonicons name="checkmark-circle" size={64} color="#10b981" />
              </View>
              <Text className="text-2xl font-uber-bold text-secondary text-center mb-2">Verification Sent</Text>
              <Text className="text-gray-500 font-uber text-center">We're reviewing your license. This usually takes less than 2 minutes.</Text>
           </View>
         )}
      </ScrollView>

      <View className="px-6 py-6 border-t border-gray-100 bg-white">
        <TouchableOpacity 
          onPress={() => scanComplete ? router.back() : setScanComplete(true)}
          className="w-full bg-black py-4 rounded-xl items-center justify-center shadow-lg"
        >
          <Text className="text-white font-uber-bold text-lg">{scanComplete ? 'Done' : 'Start scanning'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
