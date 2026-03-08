import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Dimensions,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Animated, {
    FadeInDown,
    FadeInUp, FadeOutUp, interpolate,
    useAnimatedStyle, useSharedValue
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledFontAwesome5, StyledIonicons, StyledMaterialCommunityIcons } from "../../src/lib/interop";
import MapView, { Marker, PROVIDER_GOOGLE } from "../../src/lib/MapView";
import { useSavedPlacesStore } from "../../src/lib/store";
import { darkMapStyle, mapStyle } from "../../src/styles/mapStyles";

const { width, height } = Dimensions.get("window");

const CAR_IMAGE = require("../../assets/images/tamitoy.png");

// --- NAVIGATION NETWORK ---
interface Point {
    lat: number;
    lng: number;
}

interface RoadSegment {
    id: string;
    start: Point;
    end: Point;
    next: string[];
}

interface Driver {
    id: string;
    segmentId: string;
    progress: number;
    speed: number;
    latitude: number;
    longitude: number;
    heading: number;
}

const getHeading = (start: Point, end: Point) => {
    const lat1 = start.lat * (Math.PI / 180);
    const lon1 = start.lng * (Math.PI / 180);
    const lat2 = end.lat * (Math.PI / 180);
    const lon2 = end.lng * (Math.PI / 180);

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    const brng = Math.atan2(y, x) * (180 / Math.PI);
    return (brng + 360) % 360;
};

const LUSAKA_NETWORK: RoadSegment[] = [
    { id: "cairo-n1", start: { lat: -15.4285, lng: 28.2825 }, end: { lat: -15.4215, lng: 28.2838 }, next: ["cairo-n2"] },
    { id: "cairo-n2", start: { lat: -15.4215, lng: 28.2838 }, end: { lat: -15.4095, lng: 28.2865 }, next: ["geast-e1", "cairo-s1"] },
    { id: "cairo-s1", start: { lat: -15.4095, lng: 28.2865 }, end: { lat: -15.4215, lng: 28.2838 }, next: ["cairo-s2"] },
    { id: "cairo-s2", start: { lat: -15.4215, lng: 28.2838 }, end: { lat: -15.4285, lng: 28.2825 }, next: ["cairo-n1", "indep-e1"] },
    { id: "geast-e1", start: { lat: -15.4095, lng: 28.2865 }, end: { lat: -15.4050, lng: 28.3000 }, next: ["geast-e2"] },
    { id: "geast-e2", start: { lat: -15.4050, lng: 28.3000 }, end: { lat: -15.3950, lng: 28.3220 }, next: ["geast-w1"] },
    { id: "geast-w1", start: { lat: -15.3950, lng: 28.3220 }, end: { lat: -15.4050, lng: 28.3000 }, next: ["geast-w2"] },
    { id: "geast-w2", start: { lat: -15.4050, lng: 28.3000 }, end: { lat: -15.4095, lng: 28.2865 }, next: ["cairo-s1", "geast-e1"] },
    { id: "indep-e1", start: { lat: -15.4285, lng: 28.2825 }, end: { lat: -15.4265, lng: 28.2950 }, next: ["indep-e2"] },
    { id: "indep-e2", start: { lat: -15.4265, lng: 28.2950 }, end: { lat: -15.4250, lng: 28.3100 }, next: ["indep-w1"] },
    { id: "indep-w1", start: { lat: -15.4250, lng: 28.3100 }, end: { lat: -15.4265, lng: 28.2950 }, next: ["indep-w2"] },
    { id: "indep-w2", start: { lat: -15.4265, lng: 28.2950 }, end: { lat: -15.4285, lng: 28.2825 }, next: ["cairo-n1", "indep-e1"] }
];

export default function HomeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colorScheme } = useColorScheme();
    const [isMoreServicesOpen, setIsMoreServicesOpen] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const animatedIndex = useSharedValue(1);
    const [mapPadding, setMapPadding] = useState(height * 0.4);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const placeholders = ["Where to?", "Order food", "Send a parcel", "Shop essentials"];

    const isTrackingMarkers = true; 
    const [region, setRegion] = useState({
        latitude: -15.4190,
        longitude: 28.2840,
        latitudeDelta: 0.0350,
        longitudeDelta: 0.0350,
    });

    const [drivers, setDrivers] = useState<Driver[]>(
        [0, 2, 4, 6, 8, 10].map((segIdx, i) => {
            const seg = LUSAKA_NETWORK[segIdx % LUSAKA_NETWORK.length];
            return {
                id: (i + 1).toString(),
                segmentId: seg.id,
                progress: i * 0.15,
                speed: 0.003 + (i * 0.0005),
                latitude: seg.start.lat + (seg.end.lat - seg.start.lat) * (i * 0.15),
                longitude: seg.start.lng + (seg.end.lng - seg.start.lng) * (i * 0.15),
                heading: getHeading(seg.start, seg.end)
            };
        })
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setDrivers((prev: Driver[]) => prev.map((d: Driver) => {
                let { segmentId, progress, speed } = d;
                let currentSeg = LUSAKA_NETWORK.find((s: RoadSegment) => s.id === segmentId) || LUSAKA_NETWORK[0];
                let nextProgress = progress + speed;
                if (nextProgress >= 1) {
                    nextProgress = 0;
                    const nextIds = currentSeg.next;
                    const nextId = nextIds[Math.floor(Math.random() * nextIds.length)];
                    currentSeg = LUSAKA_NETWORK.find((s: RoadSegment) => s.id === nextId) || LUSAKA_NETWORK[0];
                    segmentId = currentSeg.id;
                }
                const lat = currentSeg.start.lat + (currentSeg.end.lat - currentSeg.start.lat) * nextProgress;
                const lng = currentSeg.start.lng + (currentSeg.end.lng - currentSeg.start.lng) * nextProgress;
                const head = getHeading(currentSeg.start, currentSeg.end);
                return { ...d, segmentId, progress: nextProgress, latitude: lat, longitude: lng, heading: head };
            }));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const snapPoints = useMemo(() => ["15%", "60%", "100%"], []);
    const handleSheetChange = useCallback((index: number) => {
        if (index === 0) setMapPadding(height * 0.15);
        else if (index === 1) setMapPadding(height * 0.4);
        else if (index === 2) setMapPadding(height * 0.2);
    }, []);

    const [activeMapStyle, setActiveMapStyle] = useState(colorScheme === 'dark' ? darkMapStyle : mapStyle);
    const [showLocationModal, setShowLocationModal] = useState(false);

    useEffect(() => {
        setActiveMapStyle(colorScheme === 'dark' ? darkMapStyle : mapStyle);
    }, [colorScheme]);

    const headerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(animatedIndex.value, [1, 1.7], [1, 0], "clamp"),
        transform: [{ translateY: interpolate(animatedIndex.value, [1, 2], [0, -50], "clamp") }],
    }));

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <MapView
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFillObject}
                initialRegion={region}
                customMapStyle={activeMapStyle}
                mapPadding={{ top: 0, right: 0, bottom: mapPadding, left: 0 }}
            >
                <Marker coordinate={{ latitude: -15.4190, longitude: 28.2840 }}>
                    <View className="h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
                </Marker>
                {drivers.map((driver) => (
                    <Marker
                        key={driver.id}
                        coordinate={{ latitude: driver.latitude, longitude: driver.longitude }}
                        rotation={driver.heading}
                        anchor={{ x: 0.5, y: 0.5 }}
                        tracksViewChanges={false}
                        flat={true}
                        image={CAR_IMAGE}
                    />
                ))}
            </MapView>

            <SafeAreaView className="absolute top-12 left-6 right-6 z-40" pointerEvents="box-none">
                <Animated.View style={[headerAnimatedStyle]}>
                    <TouchableOpacity
                        onPress={() => router.push("/search" as any)}
                        activeOpacity={0.9}
                        className="flex-row items-center rounded-3xl bg-white dark:bg-zinc-900 px-6 py-5 shadow-2xl border border-gray-100 dark:border-zinc-800"
                    >
                        <StyledIonicons name="search" size={20} color={colorScheme === 'dark' ? '#adadad' : '#71717a'} />
                        <Text className="ml-4 flex-1 font-uber-bold text-secondary/60 dark:text-white/60 text-xl">
                            {placeholders[placeholderIndex]}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>

            <BottomSheet
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                animatedIndex={animatedIndex}
                onChange={handleSheetChange}
                handleIndicatorStyle={{ backgroundColor: colorScheme === 'dark' ? '#3f3f46' : '#e7e8ec', width: 48 }}
                backgroundStyle={{ borderRadius: 40, backgroundColor: colorScheme === 'dark' ? '#111111' : 'white' }}
            >
                <BottomSheetScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                    <View className="px-6 pt-2">
                        {/* Super App Bento Grid */}
                        <View className="flex-row gap-4 mb-4">
                            <YangoCard 
                                label="Rides" 
                                subtitle="Now" 
                                image={require("../../assets/images/legend.png")} 
                                onPress={() => router.push("/search" as any)}
                                containerStyle="flex-1 h-[140px]" 
                                imageStyle={{ width: 140, height: 140, position: 'absolute', right: -30, bottom: -20 }}
                            />
                            <View className="flex-1 gap-4">
                                <YangoCard 
                                    label="Food" 
                                    image={require("../../assets/images/Fast Food.png")} 
                                    onPress={() => router.push("/food" as any)}
                                    containerStyle="h-[62px]" 
                                    imageStyle={{ width: 80, height: 80, position: 'absolute', right: -10, top: -15 }}
                                />
                                <YangoCard 
                                    label="Grocery" 
                                    image={require("../../assets/images/grocery.png")} 
                                    onPress={() => router.push("/mart" as any)}
                                    containerStyle="h-[62px]" 
                                    imageStyle={{ width: 80, height: 80, position: 'absolute', right: -10, bottom: -15 }}
                                />
                            </View>
                        </View>

                        <View className="flex-row gap-4 mb-6">
                            <YangoCard 
                                label="Shopping" 
                                subtitle="Marketplace"
                                image={require("../../assets/images/gifts.png")} 
                                onPress={() => {}}
                                containerStyle="flex-1 h-[100px]" 
                                imageStyle={{ width: 110, height: 110, position: 'absolute', right: -20, bottom: -10 }}
                            />
                            <YangoCard 
                                label="Parcel" 
                                subtitle="Send items"
                                image={require("../../assets/images/bikedelivery.png")} 
                                onPress={() => router.push("/negotiation/fare-input" as any)}
                                containerStyle="flex-1 h-[100px]" 
                                imageStyle={{ width: 110, height: 110, position: 'absolute', right: -20, bottom: -10 }}
                            />
                        </View>

                        {/* Fintech / Wallet Banner */}
                        <TouchableOpacity 
                            onPress={() => router.push("/(tabs)/wallet" as any)}
                            className="bg-primary rounded-[32px] p-6 mb-8 flex-row items-center overflow-hidden h-[100px]"
                        >
                            <View className="flex-1">
                                <Text className="text-black font-uber-bold text-xl">Dash Wallet</Text>
                                <Text className="text-black/60 font-uber-medium text-sm">Pay bills, send money & more</Text>
                            </View>
                            <View className="h-12 w-12 rounded-full bg-black/10 items-center justify-center">
                                <StyledIonicons name="arrow-forward" size={20} color="black" />
                            </View>
                        </TouchableOpacity>

                        <Text className="text-secondary dark:text-white font-uber-bold text-xl mb-4">Around you</Text>
                        <LocationItem label="Inter City Bus Station" subtitle="Lusaka, Central" icon="bus" />
                        <LocationItem label="Levy Mall" subtitle="Church Road, Lusaka" icon="cart" />
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>
        </View>
    );
}

function YangoCard({ label, subtitle, image, onPress, containerStyle, imageStyle, bgColor = '#F2F2F2' }: any) {
    const { colorScheme } = useColorScheme();
    return (
        <TouchableOpacity 
            onPress={onPress} 
            activeOpacity={0.8} 
            className={containerStyle}
            style={{ borderRadius: 28, overflow: 'hidden', backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : bgColor }}
        >
            <View className="p-4 z-10">
                <Text className="text-secondary dark:text-white font-uber-bold text-[15px]">{label}</Text>
                {subtitle && <Text className="text-secondary/40 dark:text-white/40 font-uber-medium text-[11px]">{subtitle}</Text>}
            </View>
            <Image source={image} style={imageStyle} resizeMode="contain" />
        </TouchableOpacity>
    );
}

function LocationItem({ label, subtitle, icon }: any) {
    return (
        <TouchableOpacity className="flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800">
            <View className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl items-center justify-center mr-4">
                <StyledIonicons name={icon} size={20} color="gray" />
            </View>
            <View>
                <Text className="text-secondary dark:text-white font-uber-bold text-[16px]">{label}</Text>
                <Text className="text-secondary/40 dark:text-zinc-500 font-uber-medium text-[13px]">{subtitle}</Text>
            </View>
        </TouchableOpacity>
    );
}
