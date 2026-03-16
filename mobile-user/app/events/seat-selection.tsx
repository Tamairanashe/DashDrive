import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState, useEffect } from "react";
import {
    Pressable,
    ScrollView,
    Text,
    View,
    Dimensions,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons } from "../../src/lib/interop";
import Animated, { FadeInUp } from "react-native-reanimated";
import { api } from "../../src/lib/api";

const { width } = Dimensions.get("window");

const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const SEATS_PER_ROW = 8;

export default function SeatSelectionScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
    const [seats, setSeats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadSeats();
        }
    }, [id]);

    const loadSeats = async () => {
        setIsLoading(true);
        try {
            const response = await api.getEventSeats(id as string);
            setSeats(response.data || []);
        } catch (error) {
            console.error("Error loading seats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSeat = (seatId: string) => {
        if (selectedSeat === seatId) setSelectedSeat(null);
        else setSelectedSeat(seatId);
    };

    const getSeatStatus = (seatId: string) => {
        const seat = seats.find(s => s.seat_id === seatId);
        return seat ? seat.status : 'AVAILABLE';
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-black">
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    const [isLocking, setIsLocking] = useState(false);

    const handleContinue = async () => {
        if (!selectedSeat || !id) return;
        
        setIsLocking(true);
        try {
            const response = await api.lockSeat(id as string, selectedSeat);
            if (response.success) {
                const reservationId = response.data.id;
                router.push({ 
                    pathname: "/events/booking/contact", 
                    params: { id: id, seat: selectedSeat, reservationId: reservationId } 
                } as any);
            } else {
                alert(response.message || "Failed to lock seat");
                loadSeats(); // Refresh seats if it failed
            }
        } catch (error: any) {
            console.error("Lock seat error:", error);
            alert(error.message || "Something went wrong locking your seat");
            loadSeats();
        } finally {
            setIsLocking(false);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-black">
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <SafeAreaView className="flex-1 px-6 pt-4" edges={['top']}>
                {/* Header */}
                <View className="flex-row items-center mb-8">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <StyledIonicons name="arrow-back" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </Pressable>
                    <Text className="text-2xl font-uber-bold text-secondary dark:text-white">Choose Seat</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    {/* Stage Backdrop */}
                    <View className="items-center mb-10">
                        <View className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-2" />
                        <View className="px-10 py-2 bg-primary/10 rounded-full">
                            <Text className="text-primary font-uber-bold uppercase tracking-widest text-xs">Stage</Text>
                        </View>
                    </View>

                    {/* Seat Grid */}
                    <View className="items-center">
                        {SEAT_ROWS.map((row) => (
                            <View key={row} className="flex-row mb-3">
                                <Text className="w-6 text-zinc-400 font-uber-bold text-xs self-center">{row}</Text>
                                <View className="flex-row flex-1 justify-center">
                                    {Array.from({ length: SEATS_PER_ROW }).map((_, i) => {
                                        const seatId = `${row}${i + 1}`;
                                        const isSelected = selectedSeat === seatId;
                                        const status = getSeatStatus(seatId);
                                        const isSold = status === 'SOLD' || status === 'LOCKED';

                                        return (
                                            <Pressable
                                                key={seatId}
                                                disabled={isSold || isLocking}
                                                onPress={() => toggleSeat(seatId)}
                                                className={`h-7 w-7 m-1 rounded-lg items-center justify-center border ${
                                                    isSold 
                                                        ? 'bg-zinc-100 border-zinc-100 dark:bg-zinc-800 dark:border-zinc-800' 
                                                        : isSelected 
                                                            ? 'bg-primary border-primary' 
                                                            : 'bg-transparent border-primary/40'
                                                }`}
                                            >
                                                <View className={`h-1.5 w-1.5 rounded-full ${isSold ? 'bg-zinc-300 dark:bg-zinc-600' : isSelected ? 'bg-black' : 'bg-primary/40'}`} />
                                            </Pressable>
                                        );
                                    })}
                                </View>
                                <Text className="w-6 text-zinc-400 font-uber-bold text-xs self-center text-right">{row}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Legend */}
                    <View className="flex-row justify-around mt-12 mb-10">
                        <LegendItem color="border-primary/40" label="Available" />
                        <LegendItem color="bg-primary" label="Selected" />
                        <LegendItem color="bg-zinc-100 dark:bg-zinc-800" label="Sold" />
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Bottom Bar */}
            <SafeAreaView edges={['bottom']} className="px-6 py-6 bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-800 flex-row items-center justify-between">
                <View>
                    <Text className="text-secondary/40 dark:text-white/40 font-uber-medium text-xs">Selected Seat</Text>
                    <Text className="text-2xl font-uber-bold text-secondary dark:text-white">
                        {selectedSeat ? `Section A, ${selectedSeat}` : 'None'}
                    </Text>
                </View>
                <Pressable 
                    disabled={!selectedSeat || isLocking}
                    onPress={handleContinue}
                    className={`h-16 px-10 rounded-[28px] items-center justify-center shadow-lg ${
                        selectedSeat ? 'bg-primary shadow-primary/40' : 'bg-zinc-200 dark:bg-zinc-800'
                    } active:scale-[0.98]`}
                >
                    {isLocking ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text className={`font-uber-bold text-xl uppercase tracking-wider ${selectedSeat ? 'text-black' : 'text-zinc-500'}`}>
                            Continue
                        </Text>
                    )}
                </Pressable>
            </SafeAreaView>
        </View>
    );
}

function LegendItem({ color, label }: { color: string, label: string }) {
    return (
        <View className="flex-row items-center">
            <View className={`h-4 w-4 rounded-md mr-2 ${color.includes('border') ? `border ${color}` : color}`} />
            <Text className="text-secondary/60 dark:text-white/60 font-uber-bold text-xs">{label}</Text>
        </View>
    );
}
