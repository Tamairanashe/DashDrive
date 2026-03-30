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
    Dimensions,
    TextInput
} from "react-native";
import {
    StyledFontAwesome5,
    StyledIonicons,
    StyledSafeAreaView
} from "../../src/lib/interop";

const { width } = Dimensions.get("window");

const STORES = [
    { id: "1", name: "Nike", icon: "logo-snapchat", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" }, // Placeholder icons
    { id: "2", name: "Overstock", icon: "cube-outline" },
    { id: "3", name: "Old Navy", icon: "shirt-outline" },
    { id: "4", name: "Walmart", icon: "cart-outline" },
    { id: "5", name: "Home Depot", icon: "construct-outline" },
    { id: "6", name: "COS", icon: "briefcase-outline" },
    { id: "7", name: "adidas", icon: "logo-google" },
    { id: "8", name: "Target", icon: "radio-button-on-outline" },
    { id: "9", name: "Alo Yoga", icon: "fitness-outline" },
];

const PRODUCTS = [
    {
        id: "1",
        brand: "URBAN OUTFITTERS",
        title: "Urban Outfitters Jellyfish ...",
        price: "$ 30.00",
        image: "https://images.unsplash.com/photo-1543512218-319b3e65922c?q=80&w=400&auto=format&fit=crop",
    },
    {
        id: "2",
        brand: "ALO YOGA",
        title: "Alo Yoga Opulent Faux F...",
        price: "$ 248.00",
        image: "https://images.unsplash.com/photo-1539109132364-34775271ff81?q=80&w=400&auto=format&fit=crop",
    },
    {
        id: "3",
        brand: "STEVE MADDEN",
        title: "Steve Madden J-Kayla ...",
        price: "$ 49.95",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=400&auto=format&fit=crop",
    },
    {
        id: "4",
        brand: "ALO YOGA",
        title: "Alo Yoga Mesh Goddess ...",
        price: "$ 118.00",
        image: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=400&auto=format&fit=crop",
    },
];

export default function BnplScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [showMoreStores, setShowMoreStores] = useState(false);

    const displayedStores = showMoreStores ? STORES : STORES.slice(0, 4);

    const renderProduct = ({ item }: { item: typeof PRODUCTS[0] }) => (
        <View style={{ width: (width - 48) / 2 }} className="mb-6 mr-3">
            <View className="relative bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden aspect-[4/5]">
                <Image
                    source={{ uri: item.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                <TouchableOpacity className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 dark:bg-black/40 items-center justify-center">
                    <StyledIonicons name="bookmark-outline" size={18} color={colorScheme === 'dark' ? 'white' : 'black'} />
                </TouchableOpacity>
            </View>
            <View className="mt-2">
                <Text className="text-[14px] font-uber-bold text-secondary dark:text-white">
                    {item.price}
                </Text>
                <Text className="text-[13px] font-uber text-zinc-500 dark:text-zinc-400 mt-0.5" numberOfLines={1}>
                    {item.title}
                </Text>
                <Text className="text-[11px] font-uber-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter mt-0.5">
                    {item.brand}
                </Text>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <StyledSafeAreaView className="flex-1">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                    {/* Header */}
                    <View className="items-center py-6">
                        <TouchableOpacity onPress={() => router.back()} className="absolute left-6 top-8">
                            <StyledIonicons name="close" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                        </TouchableOpacity>
                        <Text className="text-4xl font-uber-bold tracking-tighter text-black dark:text-white">
                            karma
                        </Text>
                    </View>

                    {/* Stores Grid */}
                    <View className="px-6 mb-8">
                        <View className="flex-row flex-wrap justify-between">
                            <TouchableOpacity className="w-[80px] mb-6 items-center">
                                <View className="h-[80px] w-[80px] rounded-xl bg-zinc-50 dark:bg-zinc-900 items-center justify-center border border-zinc-100 dark:border-zinc-800">
                                    <StyledIonicons name="add" size={32} color="#71717a" />
                                </View>
                                <Text className="text-[11px] mt-2 text-center font-uber-medium text-zinc-600 dark:text-zinc-400" numberOfLines={2}>
                                    Add more fave stores
                                </Text>
                            </TouchableOpacity>

                            {displayedStores.map((store) => (
                                <TouchableOpacity key={store.id} className="w-[80px] mb-6 items-center">
                                    <View className="h-[80px] w-[80px] rounded-xl bg-white dark:bg-zinc-900 items-center justify-center border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                        <StyledIonicons name={store.icon as any} size={28} color={colorScheme === 'dark' ? 'white' : 'black'} />
                                    </View>
                                    <Text className="text-[11px] mt-2 text-center font-uber-medium text-zinc-600 dark:text-zinc-400" numberOfLines={1}>
                                        {store.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity onPress={() => setShowMoreStores(!showMoreStores)} className="items-center mt-2">
                            <Text className="text-[14px] font-uber-bold text-black dark:text-white underline decoration-2 offset-4">
                                {showMoreStores ? "Show less" : "Show more"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Products Grid */}
                    <View className="px-6">
                        <FlatList
                            data={PRODUCTS}
                            renderItem={renderProduct}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            scrollEnabled={false}
                        />
                    </View>
                </ScrollView>
            </StyledSafeAreaView>

            {/* Floating Bottom Bar */}
            <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-white/80 dark:bg-black/80">
                <View className="flex-row items-center bg-zinc-100 dark:bg-zinc-900 rounded-full px-5 py-3 h-14 shadow-lg border border-zinc-200 dark:border-zinc-800">
                    <StyledIonicons name="search" size={20} color="#71717a" />
                    <TextInput
                        placeholder="Search an item or store"
                        placeholderTextColor="#71717a"
                        className="flex-1 ml-3 font-uber-medium text-black dark:text-white text-[15px]"
                    />
                    <StyledIonicons name="camera-outline" size={20} color="#71717a" />
                </View>

                <View className="flex-row justify-between pt-6 px-2">
                    <TouchableOpacity className="items-center">
                        <View className="h-0.5 w-10 bg-black dark:bg-white absolute top-[-8] rounded-full" />
                        <Text className="text-[13px] font-uber-bold text-black dark:text-white">Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center">
                        <Text className="text-[13px] font-uber-bold text-zinc-400 dark:text-zinc-500">Browse</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center">
                        <Text className="text-[13px] font-uber-bold text-zinc-400 dark:text-zinc-500">Saved</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center">
                        <Text className="text-[13px] font-uber-bold text-zinc-400 dark:text-zinc-500">Menu</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
