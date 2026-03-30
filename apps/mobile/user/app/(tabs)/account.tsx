import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyledIonicons } from '../../src/lib/interop';

export default function AccountScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1 px-6">
        <View className="flex-row items-center justify-between py-6">
          <View>
            <Text className="text-4xl font-uber-bold text-secondary dark:text-white">Jothum</Text>
            <View className="flex-row items-center bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full mt-2 self-start">
              <StyledIonicons name="star" size={12} color="#00ff90" />
              <Text className="text-secondary dark:text-white font-uber-bold text-xs ml-1">5.00</Text>
            </View>
          </View>
          <View className="h-20 w-20 rounded-full bg-primary items-center justify-center overflow-hidden">
             <StyledIonicons name="person" size={40} color="black" />
          </View>
        </View>

        <View className="mt-8 space-y-6">
          <AccountItem icon="mail" label="Messages" />
          <AccountItem icon="heart" label="Favorites" />
          <AccountItem icon="settings" label="Settings" />
          <AccountItem icon="help-circle" label="Help" />
          <AccountItem icon="shield-checkmark" label="Legal" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AccountItem({ icon, label }: { icon: any, label: string }) {
  return (
    <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800">
      <View className="flex-row items-center gap-4">
        <StyledIonicons name={icon} size={22} color="gray" />
        <Text className="text-secondary dark:text-white font-uber-medium text-lg">{label}</Text>
      </View>
      <StyledIonicons name="chevron-forward" size={20} color="gray" />
    </TouchableOpacity>
  );
}
