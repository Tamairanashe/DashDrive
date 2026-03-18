import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons } from "../../src/lib/interop";
import { RouteInput } from "../../src/components/city-to-city/RouteInput";
import { PriceInput } from "../../src/components/city-to-city/PriceInput";
import { CityApiService } from "../../src/services/city-to-city/api";

export default function RequestRide() {
    const router = useRouter();
    const [paxCount, setPaxCount] = useState(1);
    const [from, setFrom] = useState("Harare");
    const [to, setTo] = useState("Bulawayo");
    const [price, setPrice] = useState("45");
    const [loading, setLoading] = useState(false);

    const handlePostRequest = async () => {
        setLoading(true);
        try {
            await CityApiService.postRideRequest({
                from, to, passengerCount: paxCount, proposedPrice: parseFloat(price)
            });
            router.push("/city-to-city/offers" as any);
        } catch (error) {
            console.error("Post request failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <StyledIonicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-uber-bold">Request a Ride</Text>
            </View>

            <ScrollView className="flex-1 px-6">
                <View className="mt-4 mb-8">
                    <Text className="text-zinc-400 font-uber-bold text-xs uppercase mb-2">Route Selection</Text>
                    <RouteInput 
                        from={from} to={to} 
                        onFromChange={setFrom} onToChange={setTo} 
                    />
                </View>

                {/* Pax Count */}
                <Text className="text-lg font-uber-bold mb-4">Passengers</Text>
                <View className="flex-row gap-4 mb-8">
                    {[1, 2, 3, 4].map((num) => (
                        <TouchableOpacity 
                            key={num}
                            onPress={() => setPaxCount(num)}
                            className={`flex-1 h-14 rounded-2xl items-center justify-center border ${paxCount === num ? 'bg-secondary border-secondary' : 'bg-white border-zinc-200'}`}
                        >
                            <Text className={`font-uber-bold text-lg ${paxCount === num ? 'text-white' : 'text-black'}`}>{num}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Proposed Price */}
                <Text className="text-lg font-uber-bold mb-4">Your Offer</Text>
                <PriceInput 
                    value={price} 
                    onChangeText={setPrice} 
                    recommendedRange="$45 - $60" 
                />

                {/* Luggage / Notes */}
                <Text className="text-lg font-uber-bold mt-8 mb-4">Add Notes</Text>
                <TextInput 
                    placeholder="Large luggage, traveling with pets, etc."
                    multiline
                    className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 font-uber-medium text-lg mb-8"
                    textAlignVertical="top"
                />
            </ScrollView>

            <View className="p-6">
                <TouchableOpacity 
                    onPress={handlePostRequest}
                    disabled={loading}
                    className={`h-16 rounded-[24px] items-center justify-center ${loading ? 'bg-zinc-200' : 'bg-primary'}`}
                >
                    <Text className="text-black font-uber-bold text-lg">{loading ? 'Posting...' : 'Post Request'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
