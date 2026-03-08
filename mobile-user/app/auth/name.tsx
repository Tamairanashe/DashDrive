import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";
import { StyledIonicons } from "../../src/lib/interop";

export default function NameScreen() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [focusedField, setFocusedField] = useState<"first" | "last" | null>(null);

    const isFormValid = firstName.trim().length > 0 && lastName.trim().length > 0;

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <SafeAreaView className="flex-1">
                <View className="flex-1 px-6 py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mb-8 h-10 w-10 items-center justify-center bg-secondary/5 dark:bg-white/5 rounded-2xl"
                    >
                        <StyledIonicons name="arrow-back" size={20} color="#adadad" />
                    </TouchableOpacity>

                    <Text className="mb-2 text-3xl font-uber-bold text-secondary dark:text-white">
                        Enter your name
                    </Text>
                    <Text className="mb-8 text-base font-uber-medium text-accent-gray dark:text-zinc-500">
                        Please enter your name as it appears on your ID or passport.
                    </Text>

                    <View className="gap-4">
                        <View
                            className={`h-20 rounded-2xl border-2 bg-primary/5 dark:bg-primary/10 px-6 justify-center ${focusedField === 'first' ? 'border-primary' : 'border-transparent'
                                }`}
                        >
                            <Text className="text-xs font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest mb-1">
                                First name
                            </Text>
                            <TextInput
                                className="text-xl font-uber-bold text-black dark:text-white p-0"
                                placeholder="e.g. John"
                                placeholderTextColor="#71717a"
                                autoFocus
                                value={firstName}
                                onChangeText={setFirstName}
                                onFocus={() => setFocusedField('first')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        <View
                            className={`h-20 rounded-2xl border-2 bg-primary/5 dark:bg-primary/10 px-6 justify-center ${focusedField === 'last' ? 'border-primary' : 'border-transparent'
                                }`}
                        >
                            <Text className="text-xs font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest mb-1">
                                Last name
                            </Text>
                            <TextInput
                                className="text-xl font-uber-bold text-black dark:text-white p-0"
                                placeholder="e.g. Doe"
                                placeholderTextColor="#71717a"
                                value={lastName}
                                onChangeText={setLastName}
                                onFocus={() => setFocusedField('last')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>
                    </View>

                    <View className="mt-auto mb-6">
                        <Button
                            label="Continue"
                            disabled={!isFormValid}
                            onPress={() => router.replace("/(tabs)" as any)}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}
