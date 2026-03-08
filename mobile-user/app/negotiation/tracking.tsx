import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons } from "../../src/lib/interop";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "../../src/lib/MapView";
import { useSavedPlacesStore } from "../../src/lib/store";
import { darkMapStyle, mapStyle } from "../../src/styles/mapStyles";

const { width, height } = Dimensions.get("window");

export default function TrackingScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const { isBusinessMode } = useSavedPlacesStore();
    const [region, setRegion] = useState({
        latitude: 51.5074,
        longitude: -0.1278,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
    });

    const [driverPos, setDriverPos] = useState({
        latitude: 51.5124,
        longitude: -0.1328,
    });

    // Simple animation simulation for the driver
    useEffect(() => {
        const interval = setInterval(() => {
            setDriverPos(prev => ({
                latitude: prev.latitude - 0.0001,
                longitude: prev.longitude + 0.0001,
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View className="flex-1 bg-white dark:bg-[#111111]">
            {/* Map Background */}
            <MapView
                provider={PROVIDER_GOOGLE}
                className="flex-1"
                region={region}
                customMapStyle={colorScheme === 'dark' ? darkMapStyle : mapStyle}
            >
                <Marker coordinate={driverPos}>
                    <View className="h-10 w-10 items-center justify-center bg-white dark:bg-zinc-800 rounded-full shadow-lg border-2 border-primary">
                        <StyledIonicons name="car" size={24} color={colorScheme === 'dark' ? '#00ff90' : 'black'} />
                    </View>
                </Marker>

                <Marker coordinate={{ latitude: 51.5074, longitude: -0.1278 }}>
                    <View className="h-4 w-4 bg-black dark:bg-primary rounded-full border-2 border-white dark:border-[#111111]" />
                </Marker>

                <Polyline
                    coordinates={[
                        driverPos,
                        { latitude: 51.5074, longitude: -0.1278 }
                    ]}
                    strokeColor="#00ff90"
                    strokeWidth={4}
                />
            </MapView>

            {/* Header Overlay */}
            <SafeAreaView className="absolute top-0 left-0 right-0 p-5">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.replace("/(tabs)" as any)}
                        className="h-12 w-12 bg-white dark:bg-zinc-800 rounded-full items-center justify-center shadow-lg"
                    >
                        <StyledIonicons name="close" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </TouchableOpacity>
                    <View className="bg-white/90 dark:bg-zinc-800 px-4 py-2 rounded-full shadow-lg flex-row items-center border border-transparent dark:border-zinc-700/50">
                        {isBusinessMode && <StyledIonicons name="briefcase" size={12} color="#00ff90" className="mr-2" />}
                        <Text className="font-uber-medium text-xs dark:text-white">Arriving in 4 mins</Text>
                    </View>
                    <View className="w-12" />
                </View>
            </SafeAreaView>

            {/* Bottom Sheet UI */}
            <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-3xl shadow-2xl p-6 pb-10 border-t border-white/5">
                <View className="w-10 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full self-center mb-6" />

                <View className="flex-row items-center justify-between mb-6">
                    <View className="flex-row items-center">
                        <View className="w-16 h-16 bg-accent-light dark:bg-zinc-800 rounded-full items-center justify-center mr-4">
                            <StyledIonicons name={isBusinessMode ? "briefcase" : "person"} size={32} color={isBusinessMode ? "#00ff90" : "#adadad"} />
                        </View>
                        <View>
                            <Text className="text-xl font-uber-bold dark:text-white">Sarah M.</Text>
                            <View className="flex-row items-center">
                                <StyledIonicons name="star" size={14} color="#FFD700" />
                                <Text className="text-sm font-uber-medium ml-1 dark:text-zinc-400">4.93</Text>
                                <Text className="mx-2 text-gray-300 dark:text-zinc-700">•</Text>
                                <Text className="text-sm text-gray-500 font-uber dark:text-zinc-500">Nissan Versa</Text>
                            </View>
                            <Text className="text-xs text-gray-400 font-uber uppercase tracking-tighter dark:text-zinc-600">ABC 1234 • Silver</Text>
                        </View>
                        {isBusinessMode && (
                            <View className="mt-2 flex-row items-center bg-primary/20 self-start px-2 py-0.5 rounded-full">
                                <Text className="text-[8px] font-uber-bold text-primary uppercase">Business Trip</Text>
                            </View>
                        )}
                    </View>
                    <View className="items-center">
                        <View className="h-14 w-14 bg-primary rounded-full items-center justify-center mb-1">
                            <StyledIonicons name="call" size={24} color="black" />
                        </View>
                    </View>
                </View>

                <View className="h-[1px] bg-gray-100 dark:bg-zinc-800 w-full mb-6" />

                <TouchableOpacity className="flex-row items-center mb-8">
                    <View className="h-8 w-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg items-center justify-center mr-3">
                        <StyledIonicons name="chatbox" size={18} color="#2563eb" />
                    </View>
                    <Text className="flex-1 font-uber-medium text-gray-600 dark:text-zinc-400">Send a message to Sarah...</Text>
                </TouchableOpacity>

                <View className="flex-row justify-between">
                    <TouchableOpacity className="bg-gray-100 dark:bg-zinc-800 px-6 py-4 rounded-2xl flex-row items-center">
                        <StyledIonicons name="shield-checkmark" size={20} color="#059669" className="mr-2" />
                        <Text className="font-uber-medium text-gray-700 dark:text-zinc-300 ml-2">Safety</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.replace("/negotiation/completed" as any)}
                        className="bg-black dark:bg-primary px-10 py-4 rounded-2xl"
                    >
                        <Text className="text-primary dark:text-black font-uber-bold">Finish Ride</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
