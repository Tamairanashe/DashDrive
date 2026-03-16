import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
    Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons } from "../../src/lib/interop";
import Animated, { FadeInDown } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function TicketScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();

    const EVENT = {
        title: "National Music Festival",
        date: "Mon, Dec 24, 2026",
        time: "18.00 - 23.00 PM",
        venue: "Grand Park, New York",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80",
        seat: "Section A, Row E1",
        orderId: "ORD2311456",
        price: "$125",
    };

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <SafeAreaView className="flex-1 px-6 pt-4" edges={['top']}>
                {/* Header */}
                <View className="flex-row items-center mb-8">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <StyledIonicons name="arrow-back" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </Pressable>
                    <Text className="text-2xl font-uber-bold text-secondary dark:text-white">E-Ticket</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <Animated.View 
                        entering={FadeInDown.duration(800)}
                        className="bg-white dark:bg-zinc-900 rounded-[48px] overflow-hidden shadow-2xl shadow-black/20 mb-10"
                    >
                        {/* Event Part */}
                        <Image source={{ uri: EVENT.image }} className="w-full h-56" />
                        
                        <View className="p-8">
                            <Text className="text-2xl font-uber-bold text-secondary dark:text-white mb-6 text-center">
                                {EVENT.title}
                            </Text>

                            <View className="flex-row justify-around mb-8 border-t border-b border-zinc-50 dark:border-zinc-800 py-6">
                                <TicketDetail label="Date" value="Dec 24, 2026" />
                                <TicketDetail label="Time" value="18:00 PM" />
                            </View>

                            <View className="flex-row justify-between mb-8 px-4">
                                <TicketDetail label="Name" value="Andrew Ainsley" />
                                <TicketDetail label="Phone" value="+1 234 567" />
                            </View>

                            <View className="flex-row justify-between mb-8 px-4">
                                <TicketDetail label="Location" value="Grand Park, NY" />
                                <TicketDetail label="Seat" value="Row E1" />
                            </View>

                            {/* Divider with circles for ticket look */}
                            <View className="flex-row items-center mb-8">
                                <View className="h-8 w-8 rounded-full bg-white dark:bg-black -ml-12" />
                                <View className="flex-1 h-[2px] border-t border-dashed border-zinc-200 dark:border-zinc-700 mx-4" />
                                <View className="h-8 w-8 rounded-full bg-white dark:bg-black -mr-12" />
                            </View>

                            {/* QR Code */}
                            <View className="items-center mb-6">
                                <Image 
                                    source={{ uri: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket-123-456" }} 
                                    className="h-44 w-44" 
                                />
                                <Text className="mt-4 text-secondary/40 dark:text-white/40 font-uber-medium text-xs">ORDER ID: {EVENT.orderId}</Text>
                            </View>
                        </View>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>

            {/* Bottom Bar */}
            <SafeAreaView edges={['bottom']} className="px-6 py-6 flex-row space-x-4">
                <Pressable 
                    onPress={() => {}}
                    className="flex-1 h-16 rounded-[28px] items-center justify-center border border-zinc-100 dark:border-zinc-800"
                >
                    <Text className="text-secondary dark:text-white font-uber-bold text-lg">Download</Text>
                </Pressable>
                <Pressable 
                    onPress={() => router.push("/events" as any)}
                    className="flex-1 bg-primary h-16 rounded-[28px] items-center justify-center shadow-lg shadow-primary/40"
                >
                    <Text className="text-black font-uber-bold text-lg">Add to Wallet</Text>
                </Pressable>
            </SafeAreaView>
        </View>
    );
}

function TicketDetail({ label, value }: { label: string, value: string }) {
    return (
        <View>
            <Text className="text-secondary/40 dark:text-white/40 font-uber-medium text-[10px] mb-1 uppercase tracking-widest">{label}</Text>
            <Text className="text-base font-uber-bold text-secondary dark:text-white">{value}</Text>
        </View>
    );
}
