import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
    Pressable,
    Text,
    View,
    TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons } from "../../../src/lib/interop";
import { api } from "../../../src/lib/api";

export default function PinEntryScreen() {
    const { id, seat, reservationId, amount } = useLocalSearchParams();
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [pin, setPin] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleNumberPress = (num: string) => {
        if (pin.length < 4 && !isProcessing) {
            const newPin = pin + num;
            setPin(newPin);
            if (newPin.length === 4) {
                handlePinComplete(newPin);
            }
        }
    };

    const handlePinComplete = async (enteredPin: string) => {
        setIsProcessing(true);
        try {
            // In a real app, we'd verify the PIN here
            // Then call createOrder
            const response = await api.createOrder(reservationId as string, Number(amount));
            
            if (response.success) {
                setTimeout(() => {
                    router.push({ 
                        pathname: "/events/payment", 
                        params: { id, seat, status: 'success', orderId: response.data.id } 
                    } as any);
                }, 500);
            } else {
                alert(response.message || "Failed to create order");
                setPin("");
                setIsProcessing(false);
            }
        } catch (error: any) {
            console.error("Order creation error:", error);
            alert(error.message || "Something went wrong during payment");
            setPin("");
            setIsProcessing(false);
        }
    };

    const handleBackspace = () => {
        setPin(pin.slice(0, -1));
    };

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <SafeAreaView className="flex-1 px-6 pt-4" edges={['top']}>
                {/* Header */}
                <View className="flex-row items-center mb-16">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <StyledIonicons name="arrow-back" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </Pressable>
                    <Text className="text-2xl font-uber-bold text-secondary dark:text-white">Enter Your PIN</Text>
                </View>

                <View className="items-center mb-16">
                    <Text className="text-secondary/60 dark:text-white/60 font-uber-medium text-lg text-center mb-10">
                        Enter your PIN to confirm payment
                    </Text>

                    {/* PIN Display */}
                    <View className="flex-row space-x-6">
                        {[1, 2, 3, 4].map((i) => (
                            <View 
                                key={i}
                                className={`h-16 w-16 rounded-[24px] border-2 items-center justify-center ${
                                    pin.length >= i ? 'border-primary bg-primary/5' : 'border-zinc-100 dark:border-zinc-800'
                                }`}
                            >
                                {pin.length >= i && <View className="h-4 w-4 rounded-full bg-black dark:bg-white" />}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Custom Number Pad */}
                <View className="flex-1 justify-center px-4">
                    <View className="flex-row justify-between mb-8">
                        <NumButton num="1" onPress={() => handleNumberPress("1")} colorScheme={colorScheme} />
                        <NumButton num="2" onPress={() => handleNumberPress("2")} colorScheme={colorScheme} />
                        <NumButton num="3" onPress={() => handleNumberPress("3")} colorScheme={colorScheme} />
                    </View>
                    <View className="flex-row justify-between mb-8">
                        <NumButton num="4" onPress={() => handleNumberPress("4")} colorScheme={colorScheme} />
                        <NumButton num="5" onPress={() => handleNumberPress("5")} colorScheme={colorScheme} />
                        <NumButton num="6" onPress={() => handleNumberPress("6")} colorScheme={colorScheme} />
                    </View>
                    <View className="flex-row justify-between mb-8">
                        <NumButton num="7" onPress={() => handleNumberPress("7")} colorScheme={colorScheme} />
                        <NumButton num="8" onPress={() => handleNumberPress("8")} colorScheme={colorScheme} />
                        <NumButton num="9" onPress={() => handleNumberPress("9")} colorScheme={colorScheme} />
                    </View>
                    <View className="flex-row justify-between">
                        <View className="w-20" />
                        <NumButton num="0" onPress={() => handleNumberPress("0")} colorScheme={colorScheme} />
                        <TouchableOpacity 
                            onPress={handleBackspace}
                            className="h-20 w-20 items-center justify-center"
                        >
                            <StyledIonicons name="backspace-outline" size={32} color={colorScheme === 'dark' ? 'white' : 'black'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

function NumButton({ num, onPress, colorScheme }: any) {
    return (
        <TouchableOpacity 
            onPress={onPress}
            className="h-20 w-20 items-center justify-center"
        >
            <Text className="text-3xl font-uber-bold text-secondary dark:text-white">{num}</Text>
        </TouchableOpacity>
    );
}
