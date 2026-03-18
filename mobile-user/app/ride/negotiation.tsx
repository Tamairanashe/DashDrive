import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Animated, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons, StyledMaterialCommunityIcons } from "../../../src/lib/interop";

export default function NegotiationScreen() {
    const router = useRouter();
    const [offers, setOffers] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(true);
    const pulseAnim = new Animated.Value(1);

    useEffect(() => {
        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
            ])
        ).start();

        // Simulate incoming bids
        const timer = setTimeout(() => {
            setOffers([
                { id: '1', driver: 'Driver Simba', rating: 4.8, price: 4.00, vehicle: 'Toyota Wish', eta: 3 },
                { id: '2', driver: 'Driver Memory', rating: 4.9, price: 3.50, vehicle: 'Honda Fit', eta: 5 },
                { id: '3', driver: 'Driver Tinashe', rating: 4.7, price: 3.80, vehicle: 'VW Polo', eta: 4 }
            ]);
            setIsSearching(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 flex-row items-center border-b border-zinc-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <StyledIonicons name="close" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-uber-bold">Nearby Drivers</Text>
            </View>

            <View className="flex-1 px-6">
                {isSearching && offers.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <Animated.View style={{ transform: [{ scale: pulseAnim }] }} className="h-40 w-40 rounded-full bg-secondary/10 items-center justify-center mb-8">
                            <StyledMaterialCommunityIcons name="radar" size={64} color="#000" />
                        </Animated.View>
                        <Text className="text-2xl font-uber-bold text-center">Finding your ride...</Text>
                        <Text className="text-zinc-400 font-uber-medium text-center mt-2 px-10">We've shared your $3.50 offer with 8 drivers nearby.</Text>
                        <View className="mt-10">
                            <ActivityIndicator color="black" />
                        </View>
                    </View>
                ) : (
                    <ScrollView className="flex-1 pt-6" showsVerticalScrollIndicator={false}>
                        <View className="bg-zinc-900 p-6 rounded-[32px] mb-8 shadow-xl shadow-black/20">
                            <Text className="text-white/60 font-uber-bold text-xs uppercase mb-2">My Request</Text>
                            <View className="flex-row items-center justify-between">
                                <Text className="text-white font-uber-bold text-xl">Borrowdale → Avondale</Text>
                                <Text className="text-primary font-uber-bold text-xl">$3.50</Text>
                            </View>
                        </View>

                        <Text className="text-lg font-uber-bold mb-4">Driver Offers</Text>
                        {offers.map((offer) => (
                            <View key={offer.id} className="bg-white border border-zinc-100 p-6 rounded-[32px] mb-4 shadow-sm">
                                <View className="flex-row justify-between items-start mb-6">
                                    <View className="flex-row items-center">
                                        <View className="h-12 w-12 rounded-full bg-zinc-100 items-center justify-center mr-3">
                                            <StyledIonicons name="person" size={24} color="#71717a" />
                                        </View>
                                        <View>
                                            <Text className="font-uber-bold text-lg">{offer.driver}</Text>
                                            <Text className="text-zinc-500 font-uber-medium">{offer.rating} ★ • {offer.vehicle}</Text>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-2xl font-uber-bold text-secondary">${offer.price.toFixed(2)}</Text>
                                        <Text className="text-xs text-zinc-400 font-uber-bold uppercase">{offer.eta} min away</Text>
                                    </View>
                                </View>

                                <View className="flex-row gap-4">
                                    <TouchableOpacity className="flex-1 h-12 bg-zinc-100 rounded-2xl items-center justify-center">
                                        <Text className="text-zinc-600 font-uber-bold">Decline</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => router.push("/ride/tracking" as any)}
                                        className="flex-[2] h-12 bg-primary rounded-2xl items-center justify-center"
                                    >
                                        <Text className="text-black font-uber-bold">Accept Offer</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}
