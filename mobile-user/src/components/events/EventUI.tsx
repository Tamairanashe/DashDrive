import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyledIonicons } from '../../lib/interop';

interface CategoryChipProps {
  label: string;
  icon?: string;
  isSelected: boolean;
  onPress: () => void;
}

export const CategoryChip = ({ label, icon, isSelected, onPress }: CategoryChipProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-3 px-5 py-2.5 rounded-full flex-row items-center border ${
        isSelected
          ? 'bg-primary border-primary'
          : 'bg-transparent border-primary'
      }`}
    >
      {icon && (
        <StyledIonicons
          name={icon as any}
          size={18}
          color={isSelected ? 'black' : '#FFD700'}
        />
      )}
      <Text
        className={`ml-2 font-uber-bold text-[15px] ${
          isSelected ? 'text-black' : 'text-primary'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
};

import { Image, TouchableOpacity } from 'react-native';

interface EventCardProps {
  event: any;
  onPress: () => void;
}

export const FeaturedEventCard = ({ event, onPress }: EventCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="mr-6 rounded-[32px] overflow-hidden bg-white dark:bg-zinc-900 shadow-xl border border-zinc-100 dark:border-zinc-800"
      style={{ width: 280 }}
    >
      <Image source={{ uri: event.image }} className="w-full h-44" />
      <Pressable className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20 backdrop-blur-md items-center justify-center">
        <StyledIonicons name="heart-outline" size={18} color="white" />
      </Pressable>
      <View className="p-5">
        <Text className="text-xl font-uber-bold text-secondary dark:text-white mb-2" numberOfLines={1}>
          {event.title}
        </Text>
        <Text className="text-primary font-uber-bold text-xs mb-3">
          {event.date} • {event.time}
        </Text>
        <View className="flex-row items-center">
          <StyledIonicons name="location" size={14} color="#adadad" />
          <Text className="ml-1 text-secondary/40 dark:text-white/40 font-uber-medium text-xs" numberOfLines={1}>
            {event.venue}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const EventCard = ({ event, onPress }: EventCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="flex-row items-center p-4 mb-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm"
    >
      <Image source={{ uri: event.image }} className="h-24 w-24 rounded-2xl" />
      <View className="flex-1 ml-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-[10px] font-uber-bold text-primary uppercase">{event.category}</Text>
          <StyledIonicons name="heart-outline" size={16} color="#adadad" />
        </View>
        <Text className="text-lg font-uber-bold text-secondary dark:text-white mb-1" numberOfLines={1}>
          {event.title}
        </Text>
        <Text className="text-secondary/40 dark:text-white/40 font-uber-bold text-xs mb-2">
          {event.date} • {event.time}
        </Text>
        <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
                <StyledIonicons name="location" size={12} color="#adadad" />
                <Text className="ml-1 text-[10px] font-uber-medium text-secondary/40 dark:text-white/40" numberOfLines={1}>
                    {event.venue}
                </Text>
            </View>
            <Text className="text-primary font-uber-bold text-sm ml-2">{event.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
