import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import MapView, { Marker, PROVIDER_GOOGLE } from "@/src/lib/MapView";
import { useSavedPlacesStore } from "@/src/lib/store";
import { darkMapStyle, mapStyle } from "@/src/styles/mapStyles";

export default function FareInputScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const { isBusinessMode } = useSavedPlacesStore();
    const [fare, setFare] = useState("");

    const handleNegotiate = () => {
        if (fare) {
            router.push("/negotiation/broadcasting" as any);
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-[#111111]">
            {/* Mini Map */}
            <View className="h-2/5 w-full">
                <MapView
                    provider={PROVIDER_GOOGLE}
                    className="flex-1"
                    initialRegion={{
                        latitude: 51.5074,
                        longitude: -0.1278,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    }}
                    customMapStyle={colorScheme === 'dark' ? darkMapStyle : mapStyle}
                >
                    <Marker coordinate={{ latitude: 51.5074, longitude: -0.1278 }}>
                        <View className="h-6 w-6 items-center justify-center rounded-full bg-secondary dark:bg-zinc-900 border-2 border-primary">
                            <View className="h-2 w-2 rounded-full bg-primary" />
                        </View>
                    </Marker>
                    <Marker coordinate={{ latitude: 51.5174, longitude: -0.1378 }}>
                        <View className="h-6 w-6 items-center justify-center rounded-full bg-red-500 border-2 border-white" />
                    </Marker>
                </MapView>

                {/* Overlays */}
                <SafeAreaView className="absolute top-0 w-full px-6 pt-4 flex-row items-center pointer-events-none">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-zinc-900 shadow-lg pointer-events-auto border border-transparent dark:border-zinc-800"
                    >
                        <FontAwesome5 name="arrow-left" size={18} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-6 -mt-10">
                    {isBusinessMode && (
                        <View className="mb-4 bg-primary px-4 py-2 rounded-2xl flex-row items-center self-center shadow-lg border border-secondary/10">
                            <FontAwesome5 name="briefcase" size={12} color="#000" />
                            <Text className="ml-2 text-[10px] font-uber-bold text-secondary uppercase tracking-widest">
                                Corporate Billing: Acme Corp
                            </Text>
                        </View>
                    )}
                    <Card className="shadow-2xl mb-6">
                        <View className="flex-row items-center mb-6">
                            <View className="mr-4 items-center">
                                <View className="h-3 w-3 rounded-full bg-primary" />
                                <View className="h-8 w-[2px] bg-accent-light dark:bg-zinc-800" />
                                <MaterialIcons name="location-on" size={16} color="red" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-uber-medium text-accent-gray dark:text-zinc-500 mb-1">Pickup</Text>
                                <Text className="text-base font-uber-bold text-secondary dark:text-white mb-4">123 Baker Street, London</Text>
                                <View className="h-[1px] w-full bg-accent-light dark:bg-zinc-800 mb-4" />
                                <Text className="text-sm font-uber-medium text-accent-gray dark:text-zinc-500 mb-1">Destination</Text>
                                <Text className="text-base font-uber-bold text-secondary dark:text-white">Oxford Circus, London</Text>
                            </View>
                        </View>

                        <View className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
                            <Text className="text-center text-sm font-uber-medium text-secondary/60 dark:text-white/60 mb-2">
                                Recommended Fare
                            </Text>
                            <Text className="text-center text-3xl font-uber-bold text-secondary dark:text-white">
                                £12.50
                            </Text>
                        </View>
                    </Card>

                    <View className="mb-6">
                        <Text className="text-xl font-uber-bold text-secondary dark:text-white mb-4">Offer your price</Text>
                        <Input
                            placeholder="Enter fare amount"
                            keyboardType="numeric"
                            value={fare}
                            onChangeText={setFare}
                            icon={<Text className="text-xl font-uber-bold text-secondary dark:text-white">£</Text>}
                            className="py-6 border-primary bg-primary/5"
                        />
                    </View>

                    <Button
                        label="Negotiate"
                        disabled={!fare}
                        onPress={handleNegotiate}
                        className="mb-8"
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
