import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StyledIonicons } from '@/src/lib/interop';
import { StatusBar } from 'expo-status-bar';

const STEPS = [
  'Location',
  'Vehicle Info',
  'Photos',
  'Availability'
];

export default function ListCarScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      router.replace('/rentals' as any);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-2">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : router.back()}>
              <StyledIonicons name={step > 0 ? "arrow-back" : "close"} size={28} color="black" />
            </TouchableOpacity>
            <Text className="text-lg font-uber-bold text-secondary">Step {step + 1} of {STEPS.length}</Text>
            <View className="w-8" />
          </View>
          
          {/* Progress Bar */}
          <View className="h-1.5 bg-gray-100 rounded-full w-full">
            <View 
               className="h-full bg-emerald-500 rounded-full" 
               style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} 
            />
          </View>
        </View>

        <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
          {step === 0 && (
            <View>
              <Text className="text-2xl font-uber-bold text-secondary mb-2">Where is your car located?</Text>
              <Text className="text-gray-500 font-uber mb-8">Enter the address where guests will pick up your car.</Text>
              
              <View className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex-row items-center">
                 <StyledIonicons name="location-sharp" size={24} color="#10b981" />
                 <TextInput 
                   placeholder="Enter address" 
                   className="flex-1 ml-3 font-uber text-lg text-secondary" 
                 />
              </View>

              <View className="mt-8">
                 <Text className="text-sm font-uber-bold text-gray-400 uppercase tracking-widest mb-4">Saved Locations</Text>
                 <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-50">
                    <StyledIonicons name="home-outline" size={20} color="gray" />
                    <Text className="ml-4 font-uber text-secondary">Add home address</Text>
                 </TouchableOpacity>
              </View>
            </View>
          )}

          {step === 1 && (
            <View>
              <Text className="text-2xl font-uber-bold text-secondary mb-2">Tell us about your vehicle</Text>
              <Text className="text-gray-500 font-uber mb-8">Guests love knowing all the details.</Text>
              
              <View className="space-y-6">
                 <View className="border-b border-gray-100 pb-2 mb-6">
                    <Text className="text-xs font-uber-bold text-gray-400 uppercase mb-2">VIN (Optional)</Text>
                    <TextInput placeholder="Enter VIN" className="font-uber text-lg" />
                 </View>
                 <View className="border-b border-gray-100 pb-2 mb-6">
                    <Text className="text-xs font-uber-bold text-gray-400 uppercase mb-2">License Plate</Text>
                    <TextInput placeholder="Enter plate number" className="font-uber text-lg" />
                 </View>
                 <View className="border-b border-gray-100 pb-2 mb-6">
                    <Text className="text-xs font-uber-bold text-gray-400 uppercase mb-2">Model Year</Text>
                    <TextInput placeholder="e.g. 2024" className="font-uber text-lg" keyboardType="numeric" />
                 </View>
              </View>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text className="text-2xl font-uber-bold text-secondary mb-2">Add some photos</Text>
              <Text className="text-gray-500 font-uber mb-8">High-quality photos get 3x more bookings.</Text>
              
              <View className="flex-row flex-wrap gap-4">
                 <TouchableOpacity className="w-[47%] h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl items-center justify-center">
                    <StyledIonicons name="camera" size={32} color="#adadad" />
                    <Text className="text-xs font-uber-medium text-gray-400 mt-2">Front Left</Text>
                 </TouchableOpacity>
                 <TouchableOpacity className="w-[47%] h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl items-center justify-center">
                    <StyledIonicons name="camera" size={32} color="#adadad" />
                    <Text className="text-xs font-uber-medium text-gray-400 mt-2">Front Right</Text>
                 </TouchableOpacity>
                 <TouchableOpacity className="w-full h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl items-center justify-center">
                    <StyledIonicons name="add-circle" size={48} color="#adadad" />
                    <Text className="text-sm font-uber-medium text-gray-400 mt-2">Add more</Text>
                 </TouchableOpacity>
              </View>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text className="text-2xl font-uber-bold text-secondary mb-2">Set availability</Text>
              <Text className="text-gray-500 font-uber mb-8">How often is your car available for guests?</Text>
              
              <View className="space-y-4">
                 {['Daily', 'Weekends only', 'Custom schedule'].map((option) => (
                   <TouchableOpacity 
                     key={option}
                     className="p-5 rounded-2xl border border-gray-100 bg-gray-50 flex-row justify-between mb-4"
                   >
                      <Text className="text-lg font-uber-bold text-secondary">{option}</Text>
                      <StyledIonicons name="radio-button-off" size={24} color="#adadad" />
                   </TouchableOpacity>
                 ))}
              </View>
            </View>
          )}
        </ScrollView>

        <View className="px-6 py-6 border-t border-gray-100 bg-white">
          <TouchableOpacity 
            onPress={handleNext}
            className="w-full bg-emerald-500 py-4 rounded-xl items-center justify-center shadow-lg"
          >
            <Text className="text-white font-uber-bold text-lg">{step === STEPS.length - 1 ? 'Publish Listing' : 'Continue'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
