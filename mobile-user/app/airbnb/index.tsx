import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Dimensions
} from "react-native";
import {
    StyledFontAwesome5,
    StyledIonicons,
    StyledSafeAreaView
} from "../../src/lib/interop";

const { width } = Dimensions.get("window");

const CATEGORIES = [
    { id: "1", name: "Tropical", icon: "palm-outline" },
    { id: "2", name: "OMG!", icon: "rocket-outline" },
    { id: "3", name: "Tiny homes", icon: "home-outline" },
    { id: "4", name: "Lake", icon: "boat-outline" },
    { id: "5", name: "Mansions", icon: "business-outline" },
    { id: "6", name: "Luxe", icon: "diamond-outline" },
];

const LISTINGS = [
    {
        id: "1",
        title: "Lusaka, Zambia",
        description: "125 km away",
        date: "Feb 23 – 28",
        price: "K1,200",
        rating: 4.85,
        image: { uri: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop" },
    },
    {
        id: "2",
        title: "Livingstone, Zambia",
        description: "450 km away",
        date: "Mar 10 – 15",
        price: "K2,500",
        rating: 4.92,
        image: { uri: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?q=80&w=2070&auto=format&fit=crop" },
    },
    {
        id: "3",
        title: "Siavonga, Zambia",
        description: "180 km away",
        date: "Apr 2 – 7",
        price: "K1,800",
        rating: 4.78,
        image: { uri: "https://images.unsplash.com/photo-1510227272981-aa5f236375b2?q=80&w=2070&auto=format&fit=crop" },
    },
    {
        id: "4",
        title: "Ndola, Zambia",
        description: "320 km away",
        date: "May 15 – 20",
        price: "K950",
        rating: 4.65,
        image: { uri: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070&auto=format&fit=crop" },
    },
];

export default function AirbnbScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [activeCategory, setActiveCategory] = useState("1");

    const renderItem = ({ item }: { item: typeof LISTINGS[0] }) => (
        <TouchableOpacity activeOpacity={0.9} className="mb-10 px-6">
            <View className="relative">
                <Image
                    source={item.image}
                    className="w-full h-80 rounded-2xl"
                    resizeMode="cover"
                />
                <TouchableOpacity className="absolute top-4 right-4">
                    <StyledIonicons name="heart-outline" size={24} color="white" />
                </TouchableOpacity>
                <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-1.5">
                    <View className="h-1.5 w-1.5 rounded-full bg-white" />
                    <View className="h-1.5 w-1.5 rounded-full bg-white/60" />
                    <View className="h-1.5 w-1.5 rounded-full bg-white/60" />
                    <View className="h-1.5 w-1.5 rounded-full bg-white/60" />
                    <View className="h-1.5 w-1.5 rounded-full bg-white/60" />
                </View>
            </View>
            <View className="mt-3">
                <View className="flex-row justify-between items-center">
                    <Text className="text-[16px] font-uber-bold text-secondary dark:text-white">
                        {item.title}
                    </Text>
                    <View className="flex-row items-center">
                        <StyledIonicons name="star" size={14} color={colorScheme === 'dark' ? 'white' : 'black'} />
                        <Text className="ml-1 text-[14px] font-uber-medium text-secondary dark:text-white">
                            {item.rating}
                        </Text>
                    </View>
                </View>
                <Text className="text-[15px] font-uber text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {item.description}
                </Text>
                <Text className="text-[15px] font-uber text-zinc-500 dark:text-zinc-400">
                    {item.date}
                </Text>
                <Text className="text-[16px] font-uber-bold text-secondary dark:text-white mt-2">
                    {item.price} <Text className="font-uber text-zinc-500 dark:text-zinc-400">night</Text>
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-white dark:bg-black">
            {/* Search Header */}
            <StyledSafeAreaView className="bg-white dark:bg-black z-10 shadow-sm">
                <View className="px-6 py-4">
                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="flex-row items-center bg-white dark:bg-zinc-900 rounded-full px-5 py-3 shadow-lg border border-zinc-100 dark:border-zinc-800"
                    >
                        <StyledIonicons name="search" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
                        <View className="ml-3 flex-1">
                            <Text className="text-[14px] font-uber-bold text-secondary dark:text-white">Where to?</Text>
                            <Text className="text-[12px] font-uber text-zinc-400">Anywhere • Any week • Add guests</Text>
                        </View>
                        <View className="h-10 w-10 rounded-full border border-zinc-200 dark:border-zinc-800 items-center justify-center">
                            <StyledIonicons name="options-outline" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="px-6 mb-2"
                    contentContainerStyle={{ paddingRight: 40 }}
                >
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => setActiveCategory(cat.id)}
                            className={`items-center mr-8 pb-3 border-b-2 ${activeCategory === cat.id ? 'border-secondary dark:border-white' : 'border-transparent'}`}
                        >
                            <StyledIonicons
                                name={cat.icon as any}
                                size={24}
                                color={activeCategory === cat.id ? (colorScheme === 'dark' ? 'white' : 'black') : '#71717a'}
                            />
                            <Text className={`text-[12px] mt-1 font-uber-medium ${activeCategory === cat.id ? 'text-secondary dark:text-white' : 'text-zinc-500'}`}>
                                {cat.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </StyledSafeAreaView>

            <FlatList
                data={LISTINGS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
                ListHeaderComponent={() => (
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute top-[-60] left-6 z-20 h-10 w-10 rounded-full bg-white dark:bg-zinc-900 shadow-md items-center justify-center"
                    >
                        <StyledIonicons name="chevron-back" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </TouchableOpacity>
                )}
            />

            {/* Floating Map Button */}
            <TouchableOpacity
                activeOpacity={0.9}
                className="absolute bottom-10 self-center bg-[#222222] dark:bg-zinc-800 px-6 py-3.5 rounded-full shadow-2xl flex-row items-center border border-white/10"
            >
                <Text className="text-white font-uber-bold text-[14px]">Map</Text>
                <View className="ml-2">
                    <StyledIonicons name="map" size={16} color="white" />
                </View>
            </TouchableOpacity>
        </View>
    );
}
