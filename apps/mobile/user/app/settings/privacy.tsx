import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [twoFactor, setTwoFactor] = useState(false);
    const [biometric, setBiometric] = useState(true);

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => { } }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center px-6 mt-4 mb-6">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="h-10 w-10 items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full"
                    >
                        <Ionicons name="arrow-back" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
                    <Text className="flex-1 text-center text-xl font-uber-bold dark:text-white">Privacy & Security</Text>
                    <View className="w-10" />
                </View>

                {/* Security */}
                <View className="px-6 mb-6">
                    <Text className="text-sm font-uber-bold text-accent-gray dark:text-zinc-500 mb-3 uppercase tracking-widest">Security</Text>
                    <View className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden">
                        <View className="flex-row items-center p-4 border-b border-zinc-100 dark:border-zinc-800">
                            <View className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-3">
                                <Ionicons name="shield-checkmark-outline" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            </View>
                            <View className="flex-1">
                                <Text className="font-uber-medium dark:text-white">Two-Factor Authentication</Text>
                                <Text className="text-xs text-accent-gray dark:text-zinc-500 font-uber">Extra security for your account</Text>
                            </View>
                            <Switch
                                value={twoFactor}
                                onValueChange={setTwoFactor}
                                trackColor={{ false: '#d4d4d8', true: '#00ff90' }}
                                thumbColor="#fff"
                            />
                        </View>
                        <View className="flex-row items-center p-4">
                            <View className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-3">
                                <Ionicons name="finger-print-outline" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            </View>
                            <View className="flex-1">
                                <Text className="font-uber-medium dark:text-white">Biometric Login</Text>
                                <Text className="text-xs text-accent-gray dark:text-zinc-500 font-uber">Face ID / Touch ID</Text>
                            </View>
                            <Switch
                                value={biometric}
                                onValueChange={setBiometric}
                                trackColor={{ false: '#d4d4d8', true: '#00ff90' }}
                                thumbColor="#fff"
                            />
                        </View>
                    </View>
                </View>

                {/* Devices */}
                <View className="px-6 mb-6">
                    <Text className="text-sm font-uber-bold text-accent-gray dark:text-zinc-500 mb-3 uppercase tracking-widest">Devices</Text>
                    <View className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden">
                        <TouchableOpacity className="flex-row items-center p-4 border-b border-zinc-100 dark:border-zinc-800">
                            <View className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-3">
                                <Ionicons name="phone-portrait-outline" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            </View>
                            <View className="flex-1">
                                <Text className="font-uber-medium dark:text-white">iPhone 15 Pro</Text>
                                <Text className="text-xs text-primary font-uber">Current device</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center p-4">
                            <View className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-3">
                                <Ionicons name="tablet-portrait-outline" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            </View>
                            <View className="flex-1">
                                <Text className="font-uber-medium dark:text-white">iPad Air</Text>
                                <Text className="text-xs text-accent-gray dark:text-zinc-500 font-uber">Last active: 2 days ago</Text>
                            </View>
                            <Text className="text-sm font-uber-medium text-red-500">Remove</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Data */}
                <View className="px-6 mb-6">
                    <Text className="text-sm font-uber-bold text-accent-gray dark:text-zinc-500 mb-3 uppercase tracking-widest">Data</Text>
                    <View className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden">
                        <TouchableOpacity className="flex-row items-center p-4 border-b border-zinc-100 dark:border-zinc-800">
                            <View className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-3">
                                <Ionicons name="download-outline" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            </View>
                            <Text className="flex-1 font-uber-medium dark:text-white">Download My Data</Text>
                            <Ionicons name="chevron-forward" size={20} color="#adadad" />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center p-4 border-b border-zinc-100 dark:border-zinc-800">
                            <View className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-3">
                                <Ionicons name="document-text-outline" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            </View>
                            <Text className="flex-1 font-uber-medium dark:text-white">Privacy Policy</Text>
                            <Ionicons name="chevron-forward" size={20} color="#adadad" />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center p-4" onPress={handleDeleteAccount}>
                            <View className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full items-center justify-center mr-3">
                                <Ionicons name="trash-outline" size={20} color="#ef4444" />
                            </View>
                            <Text className="flex-1 font-uber-medium text-red-500">Delete Account</Text>
                            <Ionicons name="chevron-forward" size={20} color="#adadad" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
