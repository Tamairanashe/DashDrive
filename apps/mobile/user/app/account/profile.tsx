import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";

export default function ProfileScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [firstName, setFirstName] = useState("Bruce");
    const [lastName, setLastName] = useState("Matthews");
    const [email, setEmail] = useState("bruce.m@example.com");
    const [phone, setPhone] = useState("+44 7911 123456");

    const handleSave = () => {
        router.back();
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
                    <Text className="flex-1 text-center text-xl font-uber-bold dark:text-white">Edit Profile</Text>
                    <View className="w-10" />
                </View>

                {/* Avatar */}
                <View className="items-center mb-8">
                    <View className="relative">
                        <View className="w-24 h-24 bg-primary rounded-full items-center justify-center">
                            <Text className="text-3xl font-uber-bold text-secondary">BM</Text>
                        </View>
                        <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 bg-secondary dark:bg-white rounded-full items-center justify-center">
                            <Ionicons name="camera" size={16} color={colorScheme === 'dark' ? '#000' : '#fff'} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form */}
                <View className="px-6">
                    <View className="mb-4">
                        <Text className="text-sm font-uber-medium text-accent-gray dark:text-zinc-500 mb-2">First Name</Text>
                        <TextInput
                            value={firstName}
                            onChangeText={setFirstName}
                            className="bg-zinc-50 dark:bg-zinc-900 px-4 py-4 rounded-2xl font-uber text-base border border-zinc-100 dark:border-zinc-800 text-secondary dark:text-white"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-uber-medium text-accent-gray dark:text-zinc-500 mb-2">Last Name</Text>
                        <TextInput
                            value={lastName}
                            onChangeText={setLastName}
                            className="bg-zinc-50 dark:bg-zinc-900 px-4 py-4 rounded-2xl font-uber text-base border border-zinc-100 dark:border-zinc-800 text-secondary dark:text-white"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-uber-medium text-accent-gray dark:text-zinc-500 mb-2">Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="bg-zinc-50 dark:bg-zinc-900 px-4 py-4 rounded-2xl font-uber text-base border border-zinc-100 dark:border-zinc-800 text-secondary dark:text-white"
                        />
                    </View>

                    <View className="mb-8">
                        <Text className="text-sm font-uber-medium text-accent-gray dark:text-zinc-500 mb-2">Phone Number</Text>
                        <View className="flex-row items-center bg-zinc-50 dark:bg-zinc-900 px-4 py-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <Text className="font-uber text-base text-secondary dark:text-white">{phone}</Text>
                            <TouchableOpacity className="ml-auto">
                                <Text className="font-uber-medium text-primary">Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Button
                        label="Save Changes"
                        onPress={handleSave}
                        className="mb-6"
                    />

                    <TouchableOpacity className="flex-row items-center justify-center py-4">
                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        <Text className="ml-2 font-uber-medium text-red-500">Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
