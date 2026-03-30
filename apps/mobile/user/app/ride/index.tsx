import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons } from "../../../src/lib/interop";
import { RouteInput } from "../../../src/components/CityToCity/RouteInput";

export default function LocalRideRequest() {
    const router = useRouter();
    const [pickup, setPickup] = useState("Borrowdale");
    const [dropoff, setDropoff] = useState("Avondale");
    const [price, setPrice] = useState("3.50");
    const [isLoading, setIsLoading] = useState(false);

    const handleRequest = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.push("/ride/negotiation" as any);
        }, 1500);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 flex-row items-center justify-between border-b border-zinc-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <StyledIonicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-uber-bold">Request a Ride</Text>
                <View className="w-6" />
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                <Text className="text-sm font-uber-bold text-zinc-400 uppercase mb-4">Route Details</Text>
                <RouteInput 
                    origin={pickup}
                    destination={dropoff}
                    onOriginChange={setPickup}
                    onDestinationChange={setDropoff}
                />

                <View className="mt-8 bg-secondary/5 p-6 rounded-[32px] border border-secondary/10">
                    <Text className="text-center text-zinc-600 font-uber-medium mb-2">Suggested Price Range</Text>
                    <Text className="text-center text-3xl font-uber-bold text-secondary mb-4">$3.00 – $5.00</Text>
                    
                    <View className="bg-white rounded-2xl p-4 flex-row items-center border border-zinc-100">
                        <Text className="text-2xl font-uber-bold mr-2">$</Text>
                        <TextInput 
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="decimal-pad"
                            className="flex-1 text-2xl font-uber-bold"
                            placeholder="Enter your offer"
                        />
                    </View>
                    <Text className="text-center text-xs text-zinc-400 mt-4 font-uber-medium italic">
                        Tip: Higher prices attract drivers faster ⚡
                    </Text>
                </View>

                <View className="mt-8">
                    <Text className="text-sm font-uber-bold text-zinc-400 uppercase mb-4">People</Text>
                    <View className="flex-row gap-4">
                        {[1, 2, 3, 4].map(num => (
                            <TouchableOpacity key={num} className="h-12 w-12 rounded-xl bg-zinc-100 items-center justify-center border border-zinc-200">
                                <Text className="font-uber-bold">{num}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <div className="p-6 border-t border-zinc-100">
                <TouchableOpacity 
                    onPress={handleRequest}
                    disabled={isLoading}
                    className="bg-primary h-16 rounded-2xl items-center justify-center shadow-lg shadow-primary/30"
                >
                    {isLoading ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text className="text-black font-uber-bold text-lg">Post Request</Text>
                    )}
                </TouchableOpacity>
            </div>
        </SafeAreaView>
    );
}
