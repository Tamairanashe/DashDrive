import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {
    StyledFontAwesome5,
    StyledIonicons,
    StyledMaterialCommunityIcons,
    StyledSafeAreaView
} from "../../src/lib/interop";

const MART_CATEGORIES = [
    { id: "1", name: "Groceries", icon: "basket-outline" },
    { id: "2", name: "Electronics", icon: "laptop-outline" },
    { id: "3", name: "Beauty", icon: "sparkles-outline" },
    { id: "4", name: "Toys", icon: "balloon-outline" },
    { id: "5", name: "Home", icon: "home-outline" },
];

const OFFERS = [
    {
        id: "1",
        title: "Weekly Essentials",
        subtitle: "Up to 30% Off",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500&auto=format&fit=crop",
        color: "#0071dc" // Walmart-ish Blue
    },
    {
        id: "2",
        title: "Fresh Produce",
        subtitle: "Straight from farm",
        image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=500&auto=format&fit=crop",
        color: "#4caf50" // Green
    }
];

const FEATURED_ITEMS = [
    {
        id: "1",
        name: "Fresh Whole Milk",
        price: "$3.88",
        originalPrice: "$4.12",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1563636619-e9107da5a1bb?q=80&w=300&auto=format&fit=crop"
    },
    {
        id: "2",
        name: "Organic Bananas",
        price: "$1.24",
        originalPrice: "$1.50",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?q=80&w=300&auto=format&fit=crop"
    },
    {
        id: "3",
        name: "Bluetooth Headphones",
        price: "$49.99",
        originalPrice: "$79.99",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop"
    }
];

import { Alert } from "react-native";
import { useCartStore } from "../../src/lib/cartStore";

export default function MartLandingScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const { items, addItem } = useCartStore();

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <StyledSafeAreaView className="flex-1 bg-white dark:bg-black">
            {/* Header */}
            <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-10 w-10 items-center justify-center rounded-full bg-accent-light/50 dark:bg-zinc-800"
                >
                    <StyledIonicons name="arrow-back" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                </TouchableOpacity>
                <View className="flex-1 items-center">
                    <Text className="text-xs font-uber-bold text-accent-gray uppercase tracking-widest">Shop at</Text>
                    <View className="flex-row items-center">
                        <Text className="text-sm font-uber-bold text-secondary dark:text-white mr-1">Dash Mart</Text>
                        <StyledIonicons name="star" size={14} color="#FFD700" />
                    </View>
                </View>
                <TouchableOpacity 
                    onPress={() => router.push("/food/checkout" as any)}
                    className="h-10 w-10 items-center justify-center rounded-full bg-accent-light/50 dark:bg-zinc-800"
                >
                    <StyledIonicons name="cart-outline" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    {cartCount > 0 && (
                        <View className="absolute -top-1 -right-1 bg-primary h-5 w-5 rounded-full items-center justify-center border-2 border-white dark:border-black">
                            <Text className="text-[10px] font-uber-bold text-secondary">{cartCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Search Bar - Walmart Style */}
                <View className="px-6 py-4">
                    <View className="flex-row items-center bg-[#f2f8fd] dark:bg-zinc-900 rounded-full px-5 py-4 border border-[#e2effa] dark:border-zinc-800">
                        <StyledIonicons name="search" size={20} color="#0071dc" />
                        <TextInput
                            placeholder="Search everything at Dash Mart"
                            placeholderTextColor="#adadad"
                            className="flex-1 ml-3 font-uber-medium text-secondary dark:text-white"
                        />
                        <StyledIonicons name="barcode-outline" size={20} color="#0071dc" />
                    </View>
                </View>

                {/* Categories Grid - 5 items */}
                <View className="px-6 mb-8 flex-row justify-between">
                    {MART_CATEGORIES.map((cat) => (
                        <TouchableOpacity key={cat.id} className="items-center">
                            <View className="h-14 w-14 rounded-full bg-accent-light/30 dark:bg-zinc-800 items-center justify-center mb-2 border border-accent-light dark:border-zinc-800">
                                <StyledIonicons name={cat.icon as any} size={24} color={colorScheme === 'dark' ? 'white' : '#0071dc'} />
                            </View>
                            <Text className="text-[10px] font-uber-bold text-secondary dark:text-white text-center">{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Horizontal Offers */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="px-6 mb-8"
                    contentContainerStyle={{ paddingRight: 40 }}
                >
                    {OFFERS.map((offer) => (
                        <TouchableOpacity
                            key={offer.id}
                            style={{ backgroundColor: offer.color }}
                            className="w-72 h-40 rounded-[32px] mr-4 p-6 justify-between overflow-hidden"
                        >
                            <View className="z-10">
                                <Text className="text-white text-xl font-uber-bold">{offer.title}</Text>
                                <Text className="text-white/80 text-sm font-uber-medium">{offer.subtitle}</Text>
                            </View>
                            <View className="bg-white/20 self-start px-4 py-2 rounded-full z-10">
                                <Text className="text-white font-uber-bold text-xs">Shop now</Text>
                            </View>
                            <Image
                                source={{ uri: offer.image }}
                                className="absolute right-0 bottom-0 w-32 h-32 opacity-40"
                                style={{ borderBottomRightRadius: 32 }}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Featured Products */}
                <View className="px-6 mb-10">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-xl font-uber-bold text-secondary dark:text-white">Best Sellers</Text>
                        <TouchableOpacity>
                            <Text className="text-[#0071dc] font-uber-bold text-sm">See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row flex-wrap justify-between">
                        {FEATURED_ITEMS.map((item) => (
                            <TouchableOpacity key={item.id} className="w-[48%] mb-6 bg-accent-light/10 dark:bg-zinc-800 rounded-[28px] p-3 border border-accent-light/20 dark:border-zinc-800">
                                <Image
                                    source={{ uri: item.image }}
                                    className="w-full h-32 rounded-[20px] mb-3"
                                />
                                <View className="px-1">
                                    <View className="flex-row items-center justify-between mb-1">
                                        <Text className="text-sm font-uber-bold text-secondary dark:text-white" numberOfLines={1}>{item.name}</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Text className="text-base font-uber-bold text-[#0071dc] mr-2">{item.price}</Text>
                                        <Text className="text-xs font-uber text-accent-gray line-through">{item.originalPrice}</Text>
                                    </View>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            addItem({
                                                id: item.id,
                                                name: item.name,
                                                price: parseFloat(item.price.replace('$', '')),
                                                priceString: item.price,
                                                quantity: 1,
                                            });
                                            Alert.alert("Added to Cart", `${item.name} added to basket.`);
                                        }}
                                        className="mt-3 bg-[#0071dc] h-10 rounded-full items-center justify-center flex-row"
                                    >
                                        <StyledIonicons name="add" size={18} color="white" />
                                        <Text className="text-white font-uber-bold text-xs ml-1">Add</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </StyledSafeAreaView>
    );
}

