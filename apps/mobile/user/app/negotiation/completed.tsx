import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";
import { Card } from "../../src/components/ui/Card";

const TIP_OPTIONS = [
    { label: "No tip", value: 0 },
    { label: "£1", value: 1 },
    { label: "£2", value: 2 },
    { label: "£5", value: 5 },
];

const FEEDBACK_CATEGORIES = [
    { id: "navigation", label: "Great navigation", icon: "navigate" },
    { id: "clean", label: "Clean car", icon: "sparkles" },
    { id: "conversation", label: "Great conversation", icon: "chatbubbles" },
    { id: "driving", label: "Smooth driving", icon: "car-sport" },
];

export default function RideCompletedScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [rating, setRating] = useState(0);
    const [selectedTip, setSelectedTip] = useState(0);
    const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
    const [comment, setComment] = useState("");

    const toggleFeedback = (id: string) => {
        setSelectedFeedback(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const handleFinish = () => {
        router.push("/ride/receipt" as any);
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                    {/* Success Header */}
                    <View className="items-center mt-8 mb-6">
                        <View className="w-20 h-20 bg-primary/20 rounded-full items-center justify-center mb-4">
                            <Ionicons name="checkmark-circle" size={50} color="#00ff90" />
                        </View>
                        <Text className="text-2xl font-uber-bold dark:text-white">Trip Completed!</Text>
                        <Text className="text-accent-gray font-uber dark:text-zinc-500">Hope you had a great ride</Text>
                    </View>

                    {/* Fare Card */}
                    <Card className="mb-6 p-6 items-center">
                        <Text className="text-xs font-uber-medium text-accent-gray dark:text-zinc-600 uppercase tracking-widest mb-1">Total Fare</Text>
                        <Text className="text-4xl font-uber-bold mb-4 dark:text-white">£12.50</Text>

                        <View className="w-full h-[1px] bg-gray-100 dark:bg-zinc-800 mb-4" />

                        <View className="flex-row justify-between w-full">
                            <View className="items-center flex-1">
                                <Ionicons name="map-outline" size={18} color={colorScheme === 'dark' ? '#71717a' : '#adadad'} />
                                <Text className="text-xs text-accent-gray dark:text-zinc-500 font-uber mt-1">Distance</Text>
                                <Text className="font-uber-medium dark:text-zinc-300">4.2 km</Text>
                            </View>
                            <View className="items-center flex-1">
                                <Ionicons name="time-outline" size={18} color={colorScheme === 'dark' ? '#71717a' : '#adadad'} />
                                <Text className="text-xs text-accent-gray dark:text-zinc-500 font-uber mt-1">Duration</Text>
                                <Text className="font-uber-medium dark:text-zinc-300">12 mins</Text>
                            </View>
                            <View className="items-center flex-1">
                                <Ionicons name="car-outline" size={18} color={colorScheme === 'dark' ? '#71717a' : '#adadad'} />
                                <Text className="text-xs text-accent-gray dark:text-zinc-500 font-uber mt-1">Vehicle</Text>
                                <Text className="font-uber-medium dark:text-zinc-300">Comfort</Text>
                            </View>
                        </View>
                    </Card>

                    {/* Rating Section */}
                    <View className="items-center mb-6">
                        <View className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full items-center justify-center mb-3">
                            <Ionicons name="person" size={28} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                        </View>
                        <Text className="text-lg font-uber-medium mb-3 dark:text-white">Rate Sarah M.</Text>
                        <View className="flex-row gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)} className="p-1">
                                    <Ionicons
                                        name={rating >= star ? "star" : "star-outline"}
                                        size={36}
                                        color={rating >= star ? "#FFD700" : (colorScheme === 'dark' ? '#52525b' : '#d4d4d8')}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Feedback Categories */}
                    {rating > 0 && (
                        <View className="mb-6">
                            <Text className="text-sm font-uber-medium text-accent-gray dark:text-zinc-500 mb-3">What went well?</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {FEEDBACK_CATEGORIES.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        onPress={() => toggleFeedback(cat.id)}
                                        className={`flex-row items-center px-4 py-2 rounded-full border ${selectedFeedback.includes(cat.id)
                                            ? 'bg-primary/10 border-primary'
                                            : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'
                                            }`}
                                    >
                                        <Ionicons
                                            name={cat.icon as any}
                                            size={16}
                                            color={selectedFeedback.includes(cat.id) ? '#00ff90' : '#adadad'}
                                        />
                                        <Text className={`ml-2 text-sm font-uber-medium ${selectedFeedback.includes(cat.id) ? 'text-primary' : 'text-secondary dark:text-zinc-300'}`}>
                                            {cat.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Tip Section */}
                    <View className="mb-6">
                        <Text className="text-sm font-uber-medium text-accent-gray dark:text-zinc-500 mb-3">Add a tip for Sarah</Text>
                        <View className="flex-row gap-3">
                            {TIP_OPTIONS.map((tip) => (
                                <TouchableOpacity
                                    key={tip.value}
                                    onPress={() => setSelectedTip(tip.value)}
                                    className={`flex-1 py-3 rounded-2xl items-center border-2 ${selectedTip === tip.value
                                        ? 'bg-primary border-primary'
                                        : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'
                                        }`}
                                >
                                    <Text className={`font-uber-bold ${selectedTip === tip.value ? 'text-secondary' : 'text-secondary dark:text-white'}`}>
                                        {tip.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Comment */}
                    <View className="mb-8">
                        <Text className="text-sm font-uber-medium text-accent-gray dark:text-zinc-500 mb-2">Leave a comment (optional)</Text>
                        <TextInput
                            multiline
                            numberOfLines={3}
                            placeholder="How was your ride?"
                            placeholderTextColor="#71717a"
                            value={comment}
                            onChangeText={setComment}
                            className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl font-uber min-h-[80px] text-base border border-zinc-100 dark:border-zinc-800 text-secondary dark:text-white"
                            textAlignVertical="top"
                        />
                    </View>

                    <Button
                        label={selectedTip > 0 ? `Submit & Pay £${selectedTip} Tip` : "Submit Rating"}
                        onPress={handleFinish}
                        className="mb-10"
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
