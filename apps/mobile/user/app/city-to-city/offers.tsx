import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Animated, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons, StyledMaterialCommunityIcons } from "../../src/lib/interop";
import { citySocketService } from "../../src/services/city-to-city/websocket";

export default function OffersMonitor() {
    const router = useRouter();
    const [offers, setOffers] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(true);
    const pulseAnim = new Animated.Value(1);

    useEffect(() => {
        // Pulsing animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
            ])
        ).start();

        // Connect to WebSocket
        citySocketService.connect();
        
        citySocketService.onOfferCreated((newOffer) => {
            setOffers(prev => [newOffer, ...prev]);
            setIsSearching(false);
        });

        // Demo simulation if no real backend streams
        const timer = setTimeout(() => {
            if (offers.length === 0) {
                setOffers([
                    { id: '1', driver: 'Driver Simba', rating: 4.8, price: 50, vehicle: 'Toyota Hiace' },
                    { id: '2', driver: 'Driver Memory', rating: 4.7, price: 45, vehicle: 'Honda Fit' }
                ]);
                setIsSearching(false);
            }
        }, 4000);

        return () => {
            citySocketService.disconnect();
            clearTimeout(timer);
        };
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 flex-row items-center border-b border-zinc-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <StyledIonicons name="close" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-uber-bold">Incoming Offers</Text>
            </View>

            <View className="flex-1 px-6">
                {(isSearching || offers.length === 0) ? (
                    <View className="flex-1 items-center justify-center">
                        <Animated.View style={{ transform: [{ scale: pulseAnim }] }} className="h-40 w-40 rounded-full bg-secondary/10 items-center justify-center mb-8">
                            <ActivityIndicator size="large" color="#000" />
                        </Animated.View>
                        <Text className="text-2xl font-uber-bold text-center">Finding your drivers...</Text>
                        <Text className="text-zinc-400 font-uber-medium text-center mt-2 px-10">Your request is visible to drivers on the Harare → Bulawayo route.</Text>
                    </View>
                ) : (
                    <ScrollView className="flex-1 pt-6" showsVerticalScrollIndicator={false}>
                        <View className="bg-zinc-900 p-6 rounded-[32px] mb-8">
                            <Text className="text-white/60 font-uber-bold text-xs uppercase mb-2">My Request</Text>
                            <Text className="text-white font-uber-bold text-xl">Harare → Bulawayo</Text>
                        </View>

                        <Text className="text-lg font-uber-bold mb-4">Live Bids</Text>
                        {offers.map((offer) => (
                            <OfferCard 
                                key={offer.id} 
                                offer={offer} 
                                onAccept={() => router.push({
                                    pathname: "/negotiation/completed",
                                    params: { type: 'c2c_request_accepted' }
                                } as any)} 
                            />
                        ))}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}

function OfferCard({ offer, onAccept }: any) {
    return (
        <View className="bg-white border border-zinc-100 p-6 rounded-[32px] mb-4 shadow-sm">
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
                <Text className="text-3xl font-uber-bold text-secondary">${offer.price}</Text>
            </View>

            <View className="flex-row gap-4">
                <TouchableOpacity className="flex-1 h-12 bg-zinc-100 rounded-2xl items-center justify-center">
                    <Text className="text-zinc-600 font-uber-bold">Counter</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={onAccept}
                    className="flex-[2] h-12 bg-primary rounded-2xl items-center justify-center"
                >
                    <Text className="text-black font-uber-bold">Accept Offer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
