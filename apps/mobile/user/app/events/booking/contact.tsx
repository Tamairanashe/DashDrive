import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons } from "@/src/lib/interop";

export default function ContactInfoScreen() {
    const { id, seat, reservationId } = useLocalSearchParams();
    const router = useRouter();
    const { colorScheme } = useColorScheme();

    const [fullName, setFullName] = useState("Andrew Ainsley");
    const [email, setEmail] = useState("andrew@email.com");
    const [phone, setPhone] = useState("+1 234 567 890");

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white dark:bg-black"
        >
            <SafeAreaView className="flex-1 px-6 pt-4" edges={['top']}>
                {/* Header */}
                <View className="flex-row items-center mb-8">
                    <Pressable onPress={() => router.back()} className="mr-4">
                        <StyledIonicons name="arrow-back" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </Pressable>
                    <Text className="text-2xl font-uber-bold text-secondary dark:text-white">Contact Information</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <Text className="text-secondary/60 dark:text-white/60 font-uber-medium text-base mb-8">
                        The ticket details will be sent to the email and phone number below.
                    </Text>

                    <InputField 
                        label="Full Name" 
                        value={fullName} 
                        onChange={setFullName} 
                        colorScheme={colorScheme}
                    />
                    
                    <InputField 
                        label="Email Address" 
                        value={email} 
                        onChange={setEmail} 
                        keyboardType="email-address"
                        colorScheme={colorScheme}
                    />

                    <InputField 
                        label="Phone Number" 
                        value={phone} 
                        onChange={setPhone} 
                        keyboardType="phone-pad"
                        colorScheme={colorScheme}
                    />
                </ScrollView>
            </SafeAreaView>

            {/* Bottom Bar */}
            <SafeAreaView edges={['bottom']} className="px-6 py-6 border-t border-zinc-100 dark:border-zinc-800">
                <Pressable 
                    onPress={() => router.push({ pathname: "/events/booking/payment-methods", params: { id, seat, reservationId } } as any)}
                    className="bg-primary h-16 rounded-[28px] items-center justify-center shadow-lg shadow-primary/40 active:scale-[0.98]"
                >
                    <Text className="text-black font-uber-bold text-xl uppercase tracking-wider">Continue</Text>
                </Pressable>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

function InputField({ label, value, onChange, keyboardType = 'default', colorScheme }: any) {
    return (
        <View className="mb-6">
            <Text className="text-secondary dark:text-white font-uber-bold text-base mb-3">{label}</Text>
            <View className="flex-row items-center rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-4 py-4">
                <TextInput 
                    value={value}
                    onChangeText={onChange}
                    keyboardType={keyboardType}
                    className="flex-1 font-uber-bold text-lg text-secondary dark:text-white"
                />
                <StyledIonicons name="checkmark-circle" size={20} color="#FFD700" />
            </View>
        </View>
    );
}
