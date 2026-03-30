import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ActivityScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="px-6 py-4">
        <Text className="text-3xl font-uber-bold text-secondary dark:text-white">Activity</Text>
      </View>
      <ScrollView className="flex-1 px-6">
        <View className="items-center justify-center py-20">
          <Text className="text-secondary/50 dark:text-white/50 font-uber-medium text-center">
            You have no recent activity.{"\n"}Rides and orders will appear here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
