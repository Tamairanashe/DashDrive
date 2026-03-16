import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeSwitcher } from "../../src/components/ThemeSwitcher";
import { useSavedPlacesStore } from "../../src/lib/store";

const ACCOUNT_ITEMS = [
    { id: "profile", label: "Edit Profile", icon: "person-outline", route: "/account/profile" },
    { id: "payment", label: "Payment Methods", icon: "card-outline", route: "/setup/payment-method" },
    { id: "security", label: "Login and Security", icon: "lock-closed-outline", route: "/settings/security" },
];

const APP_SETTINGS_ITEMS = [
    { id: "language", label: "Language", icon: "language-outline", detail: "English (Default)", route: "/settings/language" },
    { id: "units", label: "Date and Distances", icon: "calendar-outline", detail: "Metric", route: "/settings/units" },
    { id: "navigation", label: "Navigation", icon: "navigate-outline", route: "/settings/navigation" },
];

const PREFERENCES = [
    { id: "notifications", label: "Push Notifications", icon: "notifications-outline" },
    { id: "email", label: "Email Updates", icon: "mail-outline" },
    { id: "promo", label: "Promotional Offers", icon: "pricetag-outline" },
];

const LEGAL_ITEMS = [
    { id: "terms", label: "Terms and Conditions", icon: "document-text-outline", route: "/settings/terms" },
    { id: "privacy", label: "Privacy Policy", icon: "shield-checkmark-outline", route: "/settings/privacy" },
];

export default function SettingsScreen() {
    const router = useRouter();
    const { colorScheme, setColorScheme } = useColorScheme();
    const { isDriverMode, setIsDriverMode } = useSavedPlacesStore();
    const [preferences, setPreferences] = useState({
        notifications: true,
        email: true,
        promo: false,
        keepScreenOn: false,
    });

    const togglePreference = (key: string) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <View className="flex-row items-center px-6 mt-4 mb-6">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="h-10 w-10 items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full"
                    >
                        <Ionicons name="arrow-back" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
                    <Text className="flex-1 text-center text-xl font-uber-bold dark:text-white">Settings</Text>
                    <View className="w-10" />
                </View>

                {/* Account Section */}
                <View className="px-6 mb-8">
                    <Text className="text-sm font-uber-bold text-accent-gray dark:text-zinc-500 mb-3 uppercase tracking-widest">Account</Text>
                    <View className="bg-zinc-50 dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-black/5 dark:border-zinc-800">
                        {ACCOUNT_ITEMS.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                className={`flex-row items-center p-5 ${index !== ACCOUNT_ITEMS.length - 1 ? 'border-b border-black/5 dark:border-zinc-800' : ''}`}
                                onPress={() => router.push(item.route as any)}
                            >
                                <View className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-2xl items-center justify-center mr-4 shadow-sm">
                                    <Ionicons name={item.icon as any} size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                                </View>
                                <Text className="flex-1 font-uber-medium text-lg dark:text-white">{item.label}</Text>
                                <Ionicons name="chevron-forward" size={18} color="#adadad" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* App Settings */}
                <View className="px-6 mb-8">
                    <Text className="text-sm font-uber-bold text-accent-gray dark:text-zinc-500 mb-3 uppercase tracking-widest">App Settings</Text>
                    <View className="bg-zinc-50 dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-black/5 dark:border-zinc-800">
                        {APP_SETTINGS_ITEMS.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                className="flex-row items-center p-5 border-b border-black/5 dark:border-zinc-800"
                                onPress={() => router.push(item.route as any)}
                            >
                                <View className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-2xl items-center justify-center mr-4 shadow-sm">
                                    <Ionicons name={item.icon as any} size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-uber-medium text-lg dark:text-white">{item.label}</Text>
                                    {item.detail && <Text className="text-sm text-accent-gray dark:text-zinc-500 font-uber">{item.detail}</Text>}
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#adadad" />
                            </TouchableOpacity>
                        ))}
                        </View>
                    </View>
                </View>
+
+                {/* Driver Settings */}
+                <View className="px-6 mb-8">
+                    <Text className="text-sm font-uber-bold text-accent-gray dark:text-zinc-500 mb-3 uppercase tracking-widest">Driver Settings</Text>
+                    <View className="bg-zinc-50 dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-black/5 dark:border-zinc-800">
+                        <View className="flex-row items-center p-5">
+                            <View className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-2xl items-center justify-center mr-4 shadow-sm">
+                                <Ionicons name="car-outline" size={20} color={colorScheme === 'dark' ? '#00ff90' : '#000'} />
+                            </View>
+                            <View className="flex-1">
+                                <Text className="font-uber-medium text-lg dark:text-white">Driver Mode</Text>
+                                <Text className="text-sm text-accent-gray dark:text-zinc-500 font-uber">Switch to driver dashboard</Text>
+                            </View>
+                            <Switch
+                                value={isDriverMode}
+                                onValueChange={setIsDriverMode}
+                                trackColor={{ false: '#d4d4d8', true: '#00ff90' }}
+                                thumbColor="#fff"
+                            />
+                        </View>
+                    </View>
+                </View>
+
                 {/* Appearance */}
                <View className="px-6 mb-8">
                    <Text className="text-sm font-uber-bold text-accent-gray dark:text-zinc-500 mb-3 uppercase tracking-widest">Appearance</Text>
                    <View className="bg-zinc-50 dark:bg-zinc-900 rounded-[32px] p-6 shadow-sm border border-black/5 dark:border-zinc-800">
                        <ThemeSwitcher
                            selectedMode={(colorScheme || 'system') as any}
                            onSelect={(mode) => setColorScheme(mode)}
                        />
                    </View>
                </View>

                {/* Preferences (Notifications) */}
                <View className="px-6 mb-8">
                    <Text className="text-sm font-uber-bold text-accent-gray dark:text-zinc-500 mb-3 uppercase tracking-widest">Preferences</Text>
                    <View className="bg-zinc-50 dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-black/5 dark:border-zinc-800">
                        {PREFERENCES.map((pref, index) => (
                            <View
                                key={pref.id}
                                className={`flex-row items-center p-5 ${index !== PREFERENCES.length - 1 ? 'border-b border-black/5 dark:border-zinc-800' : ''}`}
                            >
                                <View className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-2xl items-center justify-center mr-4 shadow-sm">
                                    <Ionicons name={pref.icon as any} size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                                </View>
                                <Text className="flex-1 font-uber-medium text-lg dark:text-white">{pref.label}</Text>
                                <Switch
                                    value={preferences[pref.id as keyof typeof preferences]}
                                    onValueChange={() => togglePreference(pref.id)}
                                    trackColor={{ false: '#d4d4d8', true: '#00ff90' }}
                                    thumbColor="#fff"
                                />
                            </View>
                        ))}
                    </View>
                </View>

                {/* Legal */}
                <View className="px-6 mb-8">
                    <Text className="text-sm font-uber-bold text-accent-gray dark:text-zinc-500 mb-3 uppercase tracking-widest">Legal</Text>
                    <View className="bg-zinc-50 dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-black/5 dark:border-zinc-800">
                        {LEGAL_ITEMS.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                className={`flex-row items-center p-5 ${index !== LEGAL_ITEMS.length - 1 ? 'border-b border-black/5 dark:border-zinc-800' : ''}`}
                                onPress={() => router.push(item.route as any)}
                            >
                                <View className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-2xl items-center justify-center mr-4 shadow-sm">
                                    <Ionicons name={item.icon as any} size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                                </View>
                                <Text className="flex-1 font-uber-medium text-lg dark:text-white">{item.label}</Text>
                                <Ionicons name="chevron-forward" size={18} color="#adadad" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* More */}
                <View className="px-6 mb-10">
                    <Text className="text-sm font-uber-bold text-accent-gray dark:text-zinc-500 mb-3 uppercase tracking-widest">More</Text>
                    <View className="bg-zinc-50 dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-black/5 dark:border-zinc-800">
                        <TouchableOpacity
                            className="flex-row items-center p-5 border-b border-black/5 dark:border-zinc-800"
                            onPress={() => router.push("/settings/support" as any)}
                        >
                            <View className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-2xl items-center justify-center mr-4 shadow-sm">
                                <Ionicons name="help-circle-outline" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            </View>
                            <Text className="flex-1 font-uber-medium text-lg dark:text-white">Help & Support</Text>
                            <Ionicons name="chevron-forward" size={18} color="#adadad" />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center p-5">
                            <View className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full items-center justify-center mr-4">
                                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                            </View>
                            <Text className="flex-1 font-uber-medium text-lg text-red-500">Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Danger Zone */}
                <View className="px-6 mb-10">
                    <View className="bg-zinc-50 dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-red-200 dark:border-red-900/50">
                        <TouchableOpacity className="flex-row items-center p-5">
                            <View className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full items-center justify-center mr-4">
                                <Ionicons name="trash-outline" size={20} color="#ef4444" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-uber-medium text-lg text-red-500">Delete Account</Text>
                                <Text className="text-xs text-accent-gray dark:text-zinc-500 font-uber">Permanently remove your account and data</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text className="text-center text-sm font-uber text-accent-gray dark:text-zinc-600 mb-10">Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}
