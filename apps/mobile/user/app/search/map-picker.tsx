import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { KeyboardAvoidingView, Platform, Share, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { PROVIDER_GOOGLE } from "../../src/lib/MapView";
import { useSavedPlacesStore } from "../../src/lib/store";
import { darkMapStyle, mapStyle } from "../../src/styles/mapStyles";

export default function MapPicker() {
    const router = useRouter();
    const { type, id } = useLocalSearchParams<{ type: string, id: string }>();
    const { colorScheme } = useColorScheme();
    const { home, work, custom, setHome, setWork, addCustom, updateCustom, removeHome, removeWork, removeCustom } = useSavedPlacesStore();
    const [placeName, setPlaceName] = React.useState("");

    React.useEffect(() => {
        if (type === 'home') setPlaceName(home?.title || 'Home');
        else if (type === 'work') setPlaceName(work?.title || 'Work');
        else if (type === 'custom' && id) {
            const place = custom.find(p => p.id === id);
            setPlaceName(place?.title || 'New Place');
        } else {
            setPlaceName('New Place');
        }
    }, [type, id, home, work, custom]);
    const [region, setRegion] = React.useState({
        latitude: 51.5074,
        longitude: -0.1278,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    return (
        <View className="flex-1">
            <MapView
                provider={PROVIDER_GOOGLE}
                className="flex-1"
                initialRegion={region}
                onRegionChangeComplete={setRegion}
                customMapStyle={colorScheme === 'dark' ? darkMapStyle : mapStyle}
            />

            {/* Floating Marker in Center */}
            <View className="absolute inset-0 items-center justify-center pointer-events-none" style={{ marginTop: -40 }}>
                <Ionicons name="location" size={50} color="#00ff90" />
            </View>

            <SafeAreaView className="absolute top-0 w-full px-6 pt-4 flex-row items-center">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-lg"
                >
                    <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                </TouchableOpacity>
                <View className="flex-1 mx-4 bg-white/90 dark:bg-zinc-900/90 py-3 px-6 rounded-2xl shadow-lg items-center">
                    <Text className="font-uber-bold text-secondary dark:text-white">Move map to pin</Text>
                </View>

                {((type === 'home' && home) || (type === 'work' && work) || (type === 'custom' && id)) && (
                    <View className="flex-row">
                        <TouchableOpacity
                            onPress={async () => {
                                let place = null;
                                if (type === 'home') place = home;
                                else if (type === 'work') place = work;
                                else if (type === 'custom' && id) place = custom.find(p => p.id === id);

                                if (place) {
                                    try {
                                        await Share.share({
                                            message: `Check out this place: ${place.title}\nAddress: ${place.address}\nShared via DashDrive`,
                                            title: place.title,
                                        });
                                    } catch (error) {
                                        console.error("Error sharing:", error);
                                    }
                                }
                            }}
                            className="h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/40 shadow-lg mr-2"
                        >
                            <Ionicons name="share-social-outline" size={24} color="#3b82f6" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                if (type === 'home') removeHome();
                                else if (type === 'work') removeWork();
                                else if (type === 'custom' && id) removeCustom(id);
                                router.back();
                            }}
                            className="h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/40 shadow-lg"
                        >
                            <Ionicons name="trash-outline" size={24} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "padding"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
                className="absolute inset-0 px-6"
                pointerEvents="box-none"
            >
                <View className="flex-1 justify-end pb-10" pointerEvents="box-none">
                    <View className="bg-white/95 dark:bg-zinc-900/95 p-6 rounded-[32px] shadow-2xl border border-white/20">
                        <Text className="text-xs font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest mb-3 ml-2">Name this place</Text>
                        <TextInput
                            value={placeName}
                            onChangeText={setPlaceName}
                            placeholder="e.g. My Secret Spot"
                            placeholderTextColor="#71717a"
                            className="bg-gray-50 dark:bg-zinc-800 px-6 py-4 rounded-2xl font-uber-bold text-lg text-secondary dark:text-white mb-6 border border-gray-100 dark:border-zinc-700"
                        />
                        <TouchableOpacity
                            onPress={() => {
                                const mockAddress = "123 Baker Street, London"; // Mock address
                                if (type === 'home') setHome(mockAddress, placeName);
                                else if (type === 'work') setWork(mockAddress, placeName);
                                else if (type === 'custom') {
                                    if (id) updateCustom(id, placeName, mockAddress);
                                    else addCustom(placeName, mockAddress);
                                }

                                router.back();
                            }}
                            className="bg-primary py-5 rounded-2xl shadow-lg items-center"
                        >
                            <Text className="font-uber-bold text-secondary text-lg uppercase tracking-widest">Save & Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
