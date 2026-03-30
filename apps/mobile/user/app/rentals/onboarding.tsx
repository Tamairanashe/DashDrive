import React, { useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { StyledIonicons } from '@/src/lib/interop';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Introducing\nDash Rent',
    description: 'Get great prices & selection from the best rental companies',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop',
    icon: 'key-outline'
  },
  {
    id: '2',
    title: 'Rent a car\nwith Dash',
    description: 'Rent a car for your weekend getaway or for as long as a month',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop',
    icon: 'car-outline'
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      router.replace('/(tabs)/rent' as any);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <TouchableOpacity 
        onPress={() => router.replace('/(tabs)/rent' as any)}
        className="absolute top-12 left-6 z-10 h-10 w-10 bg-black rounded-full items-center justify-center"
      >
        <StyledIonicons name="close" size={24} color="white" />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1">
            <View className="h-[50%] w-full bg-blue-50 items-center justify-center">
               <View className="h-48 w-48 rounded-full bg-blue-100 items-center justify-center">
                  <StyledIonicons name={item.icon as any} size={80} color="#2563eb" />
               </View>
            </View>
            
            <View className="p-10 flex-1 justify-center">
              <Text className="text-5xl font-uber-bold text-secondary mb-6 leading-tight">
                {item.title}
              </Text>
              <Text className="text-lg text-gray-500 font-uber leading-relaxed">
                {item.description}
              </Text>
            </View>
          </View>
        )}
      />

      <View className="px-10 pb-12 flex-row justify-between items-center">
        <View className="flex-row gap-2">
          {SLIDES.map((_, i) => (
            <View 
              key={i} 
              className={`h-2 rounded-full ${activeIndex === i ? 'w-8 bg-black' : 'w-2 bg-gray-300'}`} 
            />
          ))}
        </View>

        <TouchableOpacity 
          onPress={handleNext}
          className="bg-black px-8 py-4 rounded-full flex-row items-center"
        >
          <Text className="text-white font-uber-bold text-lg mr-2">
            {activeIndex === SLIDES.length - 1 ? 'Book now' : 'Next'}
          </Text>
          <StyledIonicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
