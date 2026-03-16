import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState, useEffect } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
    Dimensions,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons } from "../../src/lib/interop";
import { api } from "../../src/lib/api";

const { width } = Dimensions.get("window");

export default function CheckoutScreen() {
    const { id, seat, reservationId, method } = useLocalSearchParams();
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [event, setEvent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadEvent();
        }
    }, [id]);

    const loadEvent = async () => {
        setIsLoading(true);
        try {
            const response = await api.getEvent(id as string);
            setEvent(response.data);
        } catch (error) {
            console.error("Error loading event for checkout:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !event) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-black">
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (timeStr: string) => {
        if (!timeStr) return "TBD";
        return timeStr.substring(0, 5);
    };

    const ticketPrice = event.summary?.minPrice || 120;
    const serviceFee = 5;
    const total = ticketPrice + serviceFee;

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <SafeAreaView className="flex-1 px-6 pt-4" edges={['top']}>
                {/* Header */}
                <View className="flex-row items-center mb-8">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <StyledIonicons name="arrow-back" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </Pressable>
                    <Text className="text-2xl font-uber-bold text-secondary dark:text-white">Review Summary</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    {/* Event Detail Card */}
                    <View className="flex-row items-center p-4 mb-8 rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                        <Image source={{ uri: event.image_url || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80" }} className="h-24 w-24 rounded-2xl" />
                        <View className="flex-1 ml-4">
                            <Text className="text-lg font-uber-bold text-secondary dark:text-white mb-2" numberOfLines={1}>
                                {event.title}
                            </Text>
                            <View className="flex-row items-center mb-1">
                                <StyledIonicons name="calendar-outline" size={12} color="#FFD700" />
                                <Text className="ml-1 text-secondary/40 dark:text-white/40 font-uber-bold text-[10px]">
                                    {formatDate(event.start_time)} • {formatTime(event.start_time)}
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <StyledIonicons name="location-outline" size={12} color="#FFD700" />
                                <Text className="ml-1 text-secondary/40 dark:text-white/40 font-uber-bold text-[10px]">
                                    {event.venues?.name}, {event.venues?.city}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Contact Info Section */}
                    <SummarySection title="Contact Information" onEdit={() => router.back()}>
                        <SummaryRow label="Full Name" value="Andrew Ainsley" />
                        <SummaryRow label="Email" value="andrew@email.com" />
                        <SummaryRow label="Phone" value="+1 234 567 890" />
                    </SummarySection>

                    {/* Payment Method Section */}
                    <SummarySection title="Payment Method" onEdit={() => router.back()}>
                        <View className="flex-row items-center py-2">
                            <Image 
                                source={{ uri: "https://img.icons8.com/color/48/mastercard.png" }} 
                                className="h-6 w-8 mr-4" 
                                resizeMode="contain" 
                            />
                            <Text className="text-lg font-uber-bold text-secondary dark:text-white">MasterCard (4456)</Text>
                        </View>
                    </SummarySection>

                    {/* Order Summary Section */}
                    <View className="p-8 rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 mb-10">
                        <PriceRow label="Ticket Price" value={`$${ticketPrice}`} />
                        <PriceRow label="Service Fee" value={`$${serviceFee}`} colorScheme={colorScheme} />
                        <View className="h-[1px] bg-zinc-200 dark:bg-zinc-800 my-4" />
                        <PriceRow label="Total" value={`$${total}`} isTotal />
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Bottom Bar */}
            <SafeAreaView edges={['bottom']} className="px-6 py-6 border-t border-zinc-100 dark:border-zinc-800">
                <Pressable 
                    onPress={() => router.push({ pathname: "/events/booking/pin", params: { id, seat, reservationId, amount: total } } as any)}
                    className="bg-primary h-16 rounded-[28px] items-center justify-center shadow-lg shadow-primary/40 active:scale-[0.98]"
                >
                    <Text className="text-black font-uber-bold text-xl uppercase tracking-wider">Confirm Payment</Text>
                </Pressable>
            </SafeAreaView>
        </View>
    );
}

function SummarySection({ title, children, onEdit }: any) {
    return (
        <View className="mb-8 p-6 rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-uber-bold text-secondary dark:text-white">{title}</Text>
                <Pressable onPress={onEdit}>
                    <Text className="text-primary font-uber-bold text-sm">Edit</Text>
                </Pressable>
            </View>
            {children}
        </View>
    );
}

function SummaryRow({ label, value }: any) {
    return (
        <View className="flex-row items-center justify-between py-1">
            <Text className="text-secondary/40 dark:text-white/40 font-uber-medium text-sm">{label}</Text>
            <Text className="text-secondary dark:text-white font-uber-bold text-sm">{value}</Text>
        </View>
    );
}

function PriceRow({ label, value, isTotal = false, colorScheme }: any) {
    return (
        <View className="flex-row items-center justify-between py-1">
            <Text className={`${isTotal ? 'text-lg text-secondary dark:text-white' : 'text-sm text-secondary/40 dark:text-white/40'} font-uber-bold`}>
                {label}
            </Text>
            <Text className={`${isTotal ? 'text-xl' : 'text-base'} font-uber-bold ${isTotal ? 'text-primary' : 'text-secondary dark:text-white'}`}>
                {value}
            </Text>
        </View>
    );
}
