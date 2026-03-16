import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";
import { Card } from "../../src/components/ui/Card";

export default function SubscriptionSetupScreen() {
    const router = useRouter();
    const { studentId } = useLocalSearchParams();
    const { colorScheme } = useColorScheme();
    const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]); // Mon-Fri
    const [pickupTime, setPickupTime] = useState("07:30");
    const [dropoffTime, setDropoffTime] = useState("16:00");

    const days = [
        { label: "M", value: 1 },
        { label: "T", value: 2 },
        { label: "W", value: 3 },
        { label: "T", value: 4 },
        { label: "F", value: 5 },
        { label: "S", value: 6 },
        { label: "S", value: 0 },
    ];

    const toggleDay = (day: number) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleConfirm = () => {
        // Logic to save subscription to logistics-engine
        router.push("/school-run" as any);
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <View className="px-6 pt-4 pb-2 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full mr-4">
                    <Ionicons name="arrow-back" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text className="text-xl font-uber-bold dark:text-white">Setup Subscription</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                <Text className="text-secondary/60 dark:text-white/60 font-uber-medium mb-6">
                    Configure the recurring schedule for the student.
                </Text>

                <View className="mb-8">
                    <Text className="text-sm font-uber-bold text-zinc-500 mb-4 uppercase">Select Days</Text>
                    <View className="flex-row justify-between">
                        {days.map((day) => (
                            <TouchableOpacity 
                                key={day.value} 
                                onPress={() => toggleDay(day.value)}
                                className={`h-12 w-12 rounded-full items-center justify-center ${selectedDays.includes(day.value) ? 'bg-primary' : 'bg-zinc-100 dark:bg-zinc-800'}`}
                            >
                                <Text className={`font-uber-bold ${selectedDays.includes(day.value) ? 'text-black' : 'text-zinc-500'}`}>
                                    {day.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View className="flex-row gap-4 mb-8">
                    <View className="flex-1">
                        <Text className="text-sm font-uber-bold text-zinc-500 mb-4 uppercase">Morning Pickup</Text>
                        <TouchableOpacity className="bg-zinc-100 dark:bg-zinc-900 px-5 py-4 rounded-2xl flex-row items-center justify-between">
                            <Text className="text-lg font-uber-bold dark:text-white">{pickupTime}</Text>
                            <Ionicons name="time-outline" size={20} color="#adadad" />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-uber-bold text-zinc-500 mb-4 uppercase">Afternoon Dropoff</Text>
                        <TouchableOpacity className="bg-zinc-100 dark:bg-zinc-900 px-5 py-4 rounded-2xl flex-row items-center justify-between">
                            <Text className="text-lg font-uber-bold dark:text-white">{dropoffTime}</Text>
                            <Ionicons name="time-outline" size={20} color="#adadad" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Card className="p-6 mb-8 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800">
                    <Text className="font-uber-bold text-lg mb-4 dark:text-white">Price Estimate</Text>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-zinc-500 font-uber">Weekly (5 days)</Text>
                        <Text className="dark:text-white font-uber-bold">$45.00</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-zinc-500 font-uber">Service fee</Text>
                        <Text className="dark:text-white font-uber-bold">$5.00</Text>
                    </View>
                    <View className="h-[1px] bg-zinc-200 dark:bg-zinc-800 my-4" />
                    <View className="flex-row justify-between">
                        <Text className="font-uber-bold text-xl dark:text-white">Total / Weekly</Text>
                        <Text className="font-uber-bold text-xl text-primary">$50.00</Text>
                    </View>
                </Card>

                <Button 
                    label="Confirm Subscription" 
                    onPress={handleConfirm}
                    className="mb-10"
                />
            </ScrollView>
        </SafeAreaView>
    );
}
