import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Linking, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";

const FAQS = [
    { id: 1, question: "How do I cancel a ride?", answer: "You can cancel a ride from the tracking screen by tapping the cancel button. Note that cancellation fees may apply if the driver is already on the way." },
    { id: 2, question: "How do I get a refund?", answer: "Refunds are processed automatically for cancelled rides within the free cancellation window. For other issues, please contact support." },
    { id: 3, question: "How do I add a payment method?", answer: "Go to Settings > Payment Methods > Add Card. You can add credit/debit cards, Apple Pay, or Google Pay." },
    { id: 4, question: "What safety features are available?", answer: "DashDrive offers trip sharing, emergency button, live tracking, and verified drivers. Access safety features from the ride screen." },
];

export default function SupportScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [issue, setIssue] = useState("");

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
                    <Text className="flex-1 text-center text-xl font-uber-bold dark:text-white">Help & Support</Text>
                    <View className="w-10" />
                </View>

                {/* Quick Actions */}
                <View className="px-6 mb-6">
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            className="flex-1 items-center py-5 bg-primary/10 rounded-2xl"
                            onPress={() => Linking.openURL('tel:+441234567890')}
                        >
                            <Ionicons name="call-outline" size={24} color="#00ff90" />
                            <Text className="mt-2 font-uber-bold text-primary">Call Us</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-1 items-center py-5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl"
                            onPress={() => Linking.openURL('mailto:support@dashdrive.com')}
                        >
                            <Ionicons name="mail-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            <Text className="mt-2 font-uber-bold dark:text-white">Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 items-center py-5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
                            <Ionicons name="chatbubbles-outline" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            <Text className="mt-2 font-uber-bold dark:text-white">Chat</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* FAQs */}
                <View className="px-6 mb-6">
                    <Text className="text-sm font-uber-bold text-accent-gray dark:text-zinc-500 mb-3 uppercase tracking-widest">FAQs</Text>
                    <View className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden">
                        {FAQS.map((faq, index) => (
                            <TouchableOpacity
                                key={faq.id}
                                className={`p-4 ${index !== FAQS.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}
                                onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                            >
                                <View className="flex-row items-center justify-between">
                                    <Text className="flex-1 font-uber-medium dark:text-white pr-2">{faq.question}</Text>
                                    <Ionicons
                                        name={expandedFaq === faq.id ? "chevron-up" : "chevron-down"}
                                        size={20}
                                        color="#adadad"
                                    />
                                </View>
                                {expandedFaq === faq.id && (
                                    <Text className="mt-3 text-sm font-uber text-accent-gray dark:text-zinc-400">{faq.answer}</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Report Issue */}
                <View className="px-6 mb-10">
                    <Text className="text-sm font-uber-bold text-accent-gray dark:text-zinc-500 mb-3 uppercase tracking-widest">Report an Issue</Text>
                    <View className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4">
                        <TextInput
                            multiline
                            numberOfLines={4}
                            placeholder="Describe your issue..."
                            placeholderTextColor="#71717a"
                            value={issue}
                            onChangeText={setIssue}
                            className="font-uber text-base min-h-[100px] text-secondary dark:text-white"
                            textAlignVertical="top"
                        />
                    </View>
                    <Button
                        label="Submit"
                        onPress={() => { }}
                        className="mt-4"
                        disabled={!issue.trim()}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
