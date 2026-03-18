import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons, StyledMaterialCommunityIcons } from "../../src/lib/interop";
import { RouteInput } from "../../src/components/city-to-city/RouteInput";
import { CityApiService } from "../../src/services/city-to-city/api";

export default function BookTrips() {
    const router = useRouter();
    const { tripId, driver, price } = useLocalSearchParams();
    const [seatCount, setSeatCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const unitPrice = parseFloat(price as string) || 15;

    const handleConfirmBooking = async () => {
        setLoading(true);
        try {
            await CityApiService.bookTrip(tripId as string, seatCount);
            router.push({
                pathname: "/negotiation/completed",
                params: { type: 'c2c_booking' }
            } as any);
        } catch (error) {
            console.error("Booking failed:", error);
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
                <Text className="text-xl font-uber-bold">Confirm Booking</Text>
            </View>

            <ScrollView className="flex-1 px-6">
                <View className="mt-4 mb-8">
                    <Text className="text-zinc-400 font-uber-bold text-xs uppercase mb-2">Trip Summary</Text>
                    <RouteInput from="Harare" to="Bulawayo" editable={false} />
                </View>

                {/* Driver Summary */}
                <View className="bg-zinc-900 rounded-[32px] p-6 mb-8">
                    <Text className="text-white/60 font-uber-medium mb-1">Driver</Text>
                    <Text className="text-white font-uber-bold text-2xl mb-4">{driver}</Text>
                    <View className="flex-row items-center">
                        <View className="h-10 w-10 bg-zinc-800 rounded-xl items-center justify-center mr-3">
                            <StyledIonicons name="car" size={20} color="white" />
                        </View>
                        <Text className="text-white font-uber-medium text-lg">Toyota Wish (Silver)</Text>
                    </View>
                </View>

                {/* Seat Selector */}
                <Text className="text-xl font-uber-bold mb-4">How many seats?</Text>
                <View className="flex-row justify-between items-center bg-zinc-50 p-6 rounded-[28px] border border-zinc-100 mb-8">
                    <View className="flex-row items-center">
                        <StyledMaterialCommunityIcons name="seat-passenger" size={24} color="black" />
                        <Text className="font-uber-bold text-xl ml-4">Seats</Text>
                    </View>
                    <View className="flex-row items-center">
                        <TouchableOpacity 
                            onPress={() => setSeatCount(Math.max(1, seatCount - 1))}
                            className="h-12 w-12 bg-white rounded-full items-center justify-center shadow-sm"
                        >
                            <StyledIonicons name="remove" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="font-uber-bold text-2xl mx-6">{seatCount}</Text>
                        <TouchableOpacity 
                            onPress={() => setSeatCount(seatCount + 1)}
                            className="h-12 w-12 bg-black rounded-full items-center justify-center shadow-sm"
                        >
                            <StyledIonicons name="add" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Fare Summary */}
                <View className="bg-white border border-zinc-100 p-6 rounded-[28px] mb-8">
                    <View className="flex-row justify-between mb-4">
                        <Text className="text-zinc-500 font-uber-medium">Total Amount</Text>
                        <Text className="text-lg font-uber-bold text-secondary">${(unitPrice * seatCount + 2).toFixed(2)}</Text>
                    </View>
                    <Text className="text-zinc-400 font-uber-medium text-xs">Includes $2.00 service fee</Text>
                </View>
            </ScrollView>

            <View className="p-6 border-t border-zinc-100 bg-white">
                <TouchableOpacity 
                    onPress={handleConfirmBooking}
                    disabled={loading}
                    className={`h-16 rounded-[24px] items-center justify-center flex-row ${loading ? 'bg-zinc-200' : 'bg-primary'}`}
                >
                    <StyledIonicons name="lock-closed" size={20} color="black" style={{ marginRight: 10 }} />
                    <Text className="text-black font-uber-bold text-lg">{loading ? 'Processing...' : 'Confirm Booking'}</Text>
                </TouchableOpacity>
                <Text className="text-center text-zinc-400 font-uber-medium mt-4 text-xs">
                    Funds will be held in escrow until arrival
                </Text>
            </View>
        </SafeAreaView>
    );
}
