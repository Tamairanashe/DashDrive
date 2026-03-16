import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { StyledIonicons } from '../../lib/interop';

interface CarCardProps {
  id: string;
  image: string;
  brand: string;
  model: string;
  category: string;
  seats: number;
  bags: number;
  pricePerDay: number;
  totalPrice: number;
  distance?: string;
  onPress?: () => void;
}

export const CarCard: React.FC<CarCardProps> = ({
  image,
  brand,
  model,
  category,
  seats,
  bags,
  pricePerDay,
  totalPrice,
  distance = '0.16 mi',
  onPress,
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 overflow-hidden"
    >
      <View className="px-4 py-3 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-blue-600 items-center justify-center mr-2">
            <StyledIonicons name="car-sport" size={16} color="white" />
          </View>
          <Text className="text-gray-500 font-uber text-sm">{distance}</Text>
        </View>
        <StyledIonicons name="heart-outline" size={20} color="#adadad" />
      </View>

      <View className="h-40 w-full items-center justify-center px-4">
        <Image 
          source={{ uri: image }} 
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>

      <View className="p-4 pt-0">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-uber-bold text-secondary">{category}</Text>
            <Text className="text-gray-500 font-uber text-sm">{brand} {model} or similar</Text>
          </View>
          <View className="items-end">
            <Text className="text-lg font-uber-bold text-secondary">${pricePerDay}<Text className="text-sm font-uber text-gray-400">/day</Text></Text>
            <Text className="text-gray-400 font-uber text-xs">${totalPrice} total</Text>
          </View>
        </View>

        <View className="flex-row mt-3 items-center">
          <View className="flex-row items-center mr-4">
            <StyledIonicons name="person-outline" size={14} color="#52525b" />
            <Text className="ml-1 text-gray-600 font-uber-medium text-xs">{seats}</Text>
          </View>
          <View className="flex-row items-center">
            <StyledIonicons name="briefcase-outline" size={14} color="#52525b" />
            <Text className="ml-1 text-gray-600 font-uber-medium text-xs">{bags}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
