import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons, StyledMaterialCommunityIcons } from "../../src/lib/interop";
import { RouteInput } from "../../src/components/city-to-city/RouteInput";

export default function CityToCityHome() {
    const router = useRouter();
    const [from, setFrom] = useState("Harare");
    const [to, setTo] = useState("Bulawayo");

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <StyledIonicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl font-uber-bold">City-to-City</Text>
            </View>

            <ScrollView className="flex-1 px-6">
                {/* Search Box */}
                <View className="mt-8 mb-8">
                    <RouteInput 
                        from={from} 
                        to={to} 
                        onFromChange={setFrom} 
                        onToChange={setTo} 
                    />

                    <View className="flex-row gap-4 mt-6">
                        <TouchableOpacity 
                            onPress={() => router.push({
                                pathname: "/city-to-city/listings",
                                params: { from, to }
                            } as any)}
                            className="flex-1 bg-secondary h-14 rounded-2xl items-center justify-center"
                        >
                            <Text className="text-white font-uber-bold">Find a Ride</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => router.push("/city-to-city/request" as any)}
                            className="flex-1 bg-primary h-14 rounded-2xl items-center justify-center"
                        >
                            <Text className="text-black font-uber-bold">Request Ride</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Popular Routes */}
                <Text className="text-xl font-uber-bold mb-4">Popular Routes</Text>
                <RouteCard from="Harare" to="Bulawayo" price="$15" />
                <RouteCard from="Harare" to="Mutare" price="$12" />
                <RouteCard from="Bulawayo" to="Vic Falls" price="$25" />
                <RouteCard from="Harare" to="Gweru" price="$8" />
            </ScrollView>
        </SafeAreaView>
    );
}

function RouteCard({ from, to, price }: any) {
    return (
        <TouchableOpacity className="flex-row items-center bg-white border border-zinc-100 p-5 rounded-2xl mb-4 shadow-sm">
            <View className="h-12 w-12 bg-blue-50 rounded-xl items-center justify-center mr-4">
                <StyledMaterialCommunityIcons name="map-marker-distance" size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
                <Text className="font-uber-bold text-lg">{from} → {to}</Text>
                <Text className="text-zinc-500 font-uber-medium">Daily departures from {price}</Text>
            </View>
            <StyledIonicons name="chevron-forward" size={20} color="#d1d1d6" />
        </TouchableOpacity>
    );
}
