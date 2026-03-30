import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SocialAuthModal } from "../../src/components/ui/SocialAuthModal";
import { StyledFontAwesome5, StyledIonicons, StyledSafeAreaView } from "../../src/lib/interop";

export default function LoginScreen() {
    const router = useRouter();
    const [socialModal, setSocialModal] = useState<{
        visible: boolean;
        provider: "apple" | "google" | "facebook" | null;
    }>({
        visible: false,
        provider: null,
    });

    const handlePhonePress = () => {
        router.push("/auth/phone-login" as any);
    };

    const openSocial = (provider: "apple" | "google" | "facebook") => {
        setSocialModal({ visible: true, provider });
    };

    const handleSocialContinue = () => {
        setSocialModal({ ...socialModal, visible: false });
        // Redirect to phone verification after social auth
        router.push("/auth/verify-phone" as any);
    };

    return (
        <StyledSafeAreaView className="flex-1 bg-white dark:bg-black">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-4">
                <View className="mb-10 items-center mt-12">
                    <Text className="text-3xl font-uber-bold text-black dark:text-white">
                        Enter your number
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handlePhonePress}
                    activeOpacity={0.7}
                    className="flex-row items-center gap-2 mt-6"
                >
                    <View className="flex-row items-center rounded-2xl border-2 border-accent-light dark:border-zinc-800 bg-accent-light/30 dark:bg-zinc-800/50 px-4 h-16">
                        <Text className="text-lg">🇬🇧</Text>
                        <Text className="ml-2 text-base font-uber-medium text-black dark:text-white">
                            +44
                        </Text>
                        <StyledFontAwesome5
                            name="chevron-down"
                            size={12}
                            color="#adadad"
                            className="ml-2"
                        />
                    </View>
                    <View className="flex-1 h-16 rounded-2xl border-2 border-accent-light dark:border-zinc-800 bg-accent-light/30 dark:bg-zinc-800/50 px-4 justify-center">
                        <Text className="text-base font-uber-medium text-black/30 dark:text-white/30">
                            Phone number
                        </Text>
                    </View>
                </TouchableOpacity>

                <View className="flex-row items-center my-10">
                    <View className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-800" />
                    <Text className="mx-4 text-xs font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest">
                        OR
                    </Text>
                    <View className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-800" />
                </View>

                <View className="gap-4 mb-8">
                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 h-[64px] rounded-full"
                        onPress={() => openSocial("apple")}
                    >
                        <StyledIonicons name="logo-apple" size={24} color="#adadad" />
                        <Text className="ml-3 text-lg font-uber-bold text-black dark:text-white">
                            Continue with Apple
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 h-[64px] rounded-full"
                        onPress={() => openSocial("google")}
                    >
                        <StyledIonicons name="logo-google" size={24} color="#EA4335" />
                        <Text className="ml-3 text-lg font-uber-bold text-black dark:text-white">
                            Continue with Google
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 h-[64px] rounded-full"
                        onPress={() => openSocial("facebook")}
                    >
                        <StyledIonicons name="logo-facebook" size={24} color="#1877F2" />
                        <Text className="ml-3 text-lg font-uber-bold text-black dark:text-white">
                            Continue with Facebook
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-auto items-center pb-6">
                    <Text className="text-center text-[13px] font-uber-medium text-accent-gray dark:text-zinc-500 leading-5">
                        By signing up, you agree to our <Text className="text-secondary dark:text-white underline">Terms & Conditions</Text>, acknowledge our <Text className="text-secondary dark:text-white underline">Privacy Policy</Text>, and confirm that you're over 18. We may send promotions related to our services - you can unsubscribe anytime in Communication Settings under your Profile.
                    </Text>
                </View>
            </ScrollView>

            <SocialAuthModal
                visible={socialModal.visible}
                provider={socialModal.provider}
                onClose={() => setSocialModal({ ...socialModal, visible: false })}
                onContinue={handleSocialContinue}
            />
        </StyledSafeAreaView>
    );
}