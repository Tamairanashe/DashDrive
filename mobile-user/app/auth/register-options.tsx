import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/src/components/ui/Button";

export default function RegisterOptionsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <View className="flex-1 px-6 py-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mb-8 h-10 w-10 items-center justify-center bg-secondary/5 dark:bg-white/5 rounded-2xl"
                >
                    <Ionicons name="arrow-back" size={20} color="#adadad" />
                </TouchableOpacity>

                <View className="items-center mb-10">
                    <View className="mb-6 h-16 w-16 items-center justify-center bg-primary/10 rounded-3xl">
                        <Ionicons name="person-add" size={32} color="#00ff90" />
                    </View>
                    <Text className="text-3xl font-uber-bold text-secondary dark:text-white text-center">
                        Create an account
                    </Text>
                    <Text className="mt-3 text-base font-uber-medium text-accent-gray dark:text-zinc-500 text-center px-4">
                        Save time by linking your social account. We will never share any personal data.
                    </Text>
                </View>

                <View className="gap-4">
                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 h-[64px] rounded-2xl"
                        onPress={() => { }}
                    >
                        <Ionicons name="logo-apple" size={24} color="#adadad" />
                        <Text className="ml-3 text-lg font-uber-bold text-secondary dark:text-white">
                            Continue with Apple
                        </Text>
                    </TouchableOpacity>

                    <Button
                        label="Continue with email"
                        onPress={() => router.push("/auth/email" as any)}
                    />
                </View>

                <View className="mt-8 flex-row items-center justify-center">
                    <View className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-800" />
                    <Text className="mx-4 text-sm font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest">
                        OR
                    </Text>
                    <View className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-800" />
                </View>

                <View className="mt-8 items-center">
                    <TouchableOpacity
                        className="h-14 w-14 items-center justify-center bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-full shadow-sm"
                        onPress={() => { }}
                    >
                        <Ionicons name="logo-google" size={24} color="#EA4335" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
