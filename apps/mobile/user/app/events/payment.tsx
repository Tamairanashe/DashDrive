import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    View,
    Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons } from "../../src/lib/interop";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function PaymentScreen() {
    const { status = 'processing' } = useLocalSearchParams();
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [currentStatus, setCurrentStatus] = useState(status);

    useEffect(() => {
        if (currentStatus === 'processing') {
            const timer = setTimeout(() => {
                setCurrentStatus('success');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [currentStatus]);

    if (currentStatus === 'processing') {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-black px-10">
                <ActivityIndicator size="large" color="#FFD700" />
                <Text className="mt-8 text-2xl font-uber-bold text-secondary dark:text-white text-center">
                    Processing your payment...
                </Text>
                <Text className="mt-4 text-secondary/40 dark:text-white/40 font-uber-medium text-center">
                    Please wait while we secure your seats for the National Music Festival.
                </Text>
            </View>
        );
    }

    const isSuccess = currentStatus === 'success';

    return (
        <View className="flex-1 bg-white dark:bg-black px-10 items-center justify-center">
            <Animated.View 
                entering={ZoomIn.duration(800)}
                className={`h-48 w-48 rounded-[64px] items-center justify-center mb-10 ${isSuccess ? 'bg-primary/20' : 'bg-red-500/10'}`}
            >
                <StyledIonicons 
                    name={isSuccess ? "checkmark-circle" : "close-circle"} 
                    size={120} 
                    color={isSuccess ? "#FFD700" : "#FF5A5F"} 
                />
            </Animated.View>

            <Animated.View entering={FadeIn.delay(400)} className="items-center">
                <Text className="text-4xl font-uber-bold text-secondary dark:text-white text-center mb-4">
                    {isSuccess ? 'Congratulations!' : 'Oops, Failed!'}
                </Text>
                <Text className="text-secondary/60 dark:text-white/60 font-uber-medium text-lg text-center mb-16 leading-7 px-4">
                    {isSuccess 
                        ? 'You have successfully booked your ticket. You can check your e-ticket on the ticket page.' 
                        : 'Something went wrong with your payment. Please check your card balance or try another method.'}
                </Text>

                <View className="w-full">
                    <Pressable 
                        onPress={() => isSuccess ? router.push("/events/ticket" as any) : router.back()}
                        className="bg-primary h-16 rounded-[28px] items-center justify-center shadow-lg shadow-primary/40 mb-6 active:scale-[0.98]"
                    >
                        <Text className="text-black font-uber-bold text-xl uppercase tracking-wider">
                            {isSuccess ? 'View Ticket' : 'Try Again'}
                        </Text>
                    </Pressable>

                    <Pressable 
                        onPress={() => router.push("/events" as any)}
                        className="h-16 rounded-[28px] items-center justify-center border border-zinc-100 dark:border-zinc-800 active:bg-zinc-50 dark:active:bg-zinc-900"
                    >
                        <Text className="text-secondary dark:text-white font-uber-bold text-lg uppercase">
                            {isSuccess ? 'Go Home' : 'Cancel'}
                        </Text>
                    </Pressable>
                </View>
            </Animated.View>
        </View>
    );
}
