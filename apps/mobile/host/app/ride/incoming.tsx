import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons } from "../../../src/lib/interop";

export default function DriverIncomingRide() {
    const router = useRouter();
    const [price, setPrice] = useState("4.00");
    const [showCounter, setShowCounter] = useState(false);

    const ride = {
        pickup: "Borrowdale",
        dropoff: "Avondale",
        distance: "6.2 km",
        passengerOffer: "$3.50",
        pax: 2
    };

    return (
        <SafeAreaView className="flex-1 bg-zinc-50">
            <View className="px-6 py-8 bg-white border-b border-zinc-100 rounded-b-[40px] shadow-sm">
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-2xl font-uber-bold">New Ride Request</Text>
                    <View className="bg-primary/20 px-3 py-1 rounded-full">
                        <Text className="text-primary font-uber-bold text-xs uppercase">Negotiable</Text>
                    </View>
                </View>

                <View className="flex-row items-start mb-6">
                    <View className="items-center mr-4">
                        <View className="h-3 w-3 rounded-full bg-zinc-300" />
                        <View className="w-[2px] h-10 bg-zinc-200 my-1" />
                        <StyledIonicons name="location" size={20} color="#000" />
                    </View>
                    <View className="flex-1 gap-4">
                        <View>
                            <Text className="text-zinc-400 font-uber-bold text-xs uppercase">Pickup</Text>
                            <Text className="text-lg font-uber-bold">{ride.pickup}</Text>
                        </View>
                        <View>
                            <Text className="text-zinc-400 font-uber-bold text-xs uppercase">Dropoff</Text>
                            <Text className="text-lg font-uber-bold">{ride.dropoff}</Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row justify-between bg-zinc-50 p-4 rounded-2xl">
                    <View>
                        <Text className="text-zinc-400 font-uber-bold text-[10px] uppercase">Distance</Text>
                        <Text className="font-uber-bold text-lg">{ride.distance}</Text>
                    </View>
                    <View>
                        <Text className="text-zinc-400 font-uber-bold text-[10px] uppercase">Passengers</Text>
                        <Text className="font-uber-bold text-lg text-right">{ride.pax}</Text>
                    </View>
                </View>
            </View>

            <View className="flex-1 px-6 pt-10 items-center">
                <Text className="text-zinc-400 font-uber-medium mb-2">Passenger is offering</Text>
                <Text className="text-6xl font-uber-bold mb-8">{ride.passengerOffer}</Text>

                {showCounter ? (
                    <View className="w-full bg-white p-6 rounded-[32px] border border-zinc-100 shadow-xl">
                        <Text className="text-center font-uber-bold text-zinc-400 uppercase text-xs mb-4">Your Counter Offer</Text>
                        <View className="flex-row items-center justify-center bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
                            <Text className="text-4xl font-uber-bold mr-2">$</Text>
                            <TextInput 
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="decimal-pad"
                                autoFocus
                                className="text-4xl font-uber-bold"
                            />
                        </View>
                        <TouchableOpacity 
                            onPress={() => router.back()}
                            className="bg-black h-16 rounded-2xl items-center justify-center mt-6"
                        >
                            <Text className="text-white font-uber-bold text-lg">Send Counter</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="w-full gap-4">
                        <TouchableOpacity 
                            onPress={() => router.back()}
                            className="bg-primary h-20 rounded-2xl items-center justify-center shadow-lg shadow-primary/30"
                        >
                            <Text className="text-black font-uber-bold text-xl uppercase tracking-widest">Accept $3.50</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => setShowCounter(true)}
                            className="bg-zinc-900 h-20 rounded-2xl items-center justify-center"
                        >
                            <Text className="text-white font-uber-bold text-lg">Counter Offer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => router.back()}
                            className="h-16 items-center justify-center"
                        >
                            <Text className="text-zinc-400 font-uber-bold">Ignore Request</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
