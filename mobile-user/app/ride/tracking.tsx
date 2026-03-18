import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons } from "../../../src/lib/interop";

export default function LiveTracking() {
    const router = useRouter();
    const [status, setStatus] = useState("Arriving soon");

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Mock Map Placeholder */}
            <View className="flex-1 bg-zinc-200 items-center justify-center">
                <Text className="font-uber-bold text-zinc-400">Map with Real-time Car Tracking</Text>
            </View>

            <View className="bg-white p-8 rounded-t-[48px] shadow-2xl -mt-12 border-t border-zinc-100">
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-zinc-400 font-uber-bold text-xs uppercase mb-1">{status}</Text>
                        <Text className="text-2xl font-uber-bold">Honda Fit • ABC-1234</Text>
                    </View>
                    <TouchableOpacity className="h-14 w-14 bg-zinc-100 rounded-full items-center justify-center">
                        <StyledIonicons name="call" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center bg-zinc-50 p-6 rounded-[32px] mb-8">
                    <View className="h-16 w-16 rounded-full bg-zinc-200 items-center justify-center mr-4">
                        <StyledIonicons name="person" size={32} color="#71717a" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-xl font-uber-bold">Driver Sarah</Text>
                        <Text className="text-zinc-500 font-uber-medium">★ 4.9 • 850 trips</Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-2xl font-uber-bold text-secondary">$3.50</Text>
                        <Text className="text-zinc-400 font-uber-bold text-[10px] uppercase">Fixed Price</Text>
                    </View>
                </View>

                <View className="flex-row gap-4 mb-4">
                    <TouchableOpacity className="flex-1 h-16 bg-zinc-100 rounded-2xl items-center justify-center">
                        <Text className="text-zinc-600 font-uber-bold">Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 h-16 bg-red-100 rounded-2xl flex-row items-center justify-center">
                        <StyledIonicons name="warning" size={20} color="#ef4444" />
                        <Text className="text-red-500 font-uber-bold ml-2">SOS</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    onPress={() => router.push("/" as any)}
                    className="h-14 items-center justify-center"
                >
                    <Text className="text-zinc-400 font-uber-bold">Cancel Trip</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
