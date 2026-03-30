import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import {
    Alert,
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

const CATEGORIES = [
    { id: "1", name: "Pizza", icon: "pizza-outline" },
    { id: "2", name: "Burgers", icon: "fast-food-outline" },
    { id: "3", name: "Sushi", icon: "fish-outline" },
    { id: "4", name: "Coffee", icon: "cafe-outline" },
    { id: "5", name: "Dessert", icon: "ice-cream-outline" },
];

const RESTAURANTS = [
    {
        id: "1",
        name: "Artisan Pizza Co.",
        rating: 4.8,
        time: "15-25 min",
        fee: "$0.99",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop",
        tags: ["Pizza", "Italian"]
    },
    {
        id: "2",
        name: "Burger Nomad",
        rating: 4.6,
        time: "20-30 min",
        fee: "$1.49",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop",
        tags: ["Burgers", "American"]
    },
    {
        id: "3",
        name: "Sushi Zen",
        rating: 4.9,
        time: "25-40 min",
        fee: "$2.99",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&auto=format&fit=crop",
        tags: ["Sushi", "Japanese"]
    }
];

import { useCartStore } from "../../src/lib/cartStore";

export default function FoodLandingScreen() {
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
                    <Text className="text-xs font-uber-bold text-accent-gray uppercase tracking-widest">Delivery to</Text>
                    <View className="flex-row items-center">
                        <Text className="text-sm font-uber-bold text-secondary dark:text-white mr-1">Current Location</Text>
                        <StyledIonicons name="chevron-down" size={14} color="#00ff90" />
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
                {/* Search Bar */}
                <View className="px-6 py-4">
                    <View className="flex-row items-center bg-accent-light/30 dark:bg-zinc-900 rounded-2xl px-4 py-3 border border-accent-light dark:border-zinc-800">
                        <StyledIonicons name="search" size={20} color="#adadad" />
                        <TextInput
                            placeholder="Food, groceries, drinks..."
                            placeholderTextColor="#adadad"
                            className="flex-1 ml-3 font-uber-medium text-secondary dark:text-white"
                        />
                        <StyledIonicons name="options-outline" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </View>
                </View>

                {/* Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="px-6 mb-8"
                    contentContainerStyle={{ paddingRight: 40 }}
                >
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity key={cat.id} className="items-center mr-6">
                            <View className="h-16 w-16 rounded-2xl bg-primary/10 items-center justify-center mb-2 border border-primary/20">
                                <StyledIonicons name={cat.icon as any} size={28} color="#00ff90" />
                            </View>
                            <Text className="text-xs font-uber-bold text-secondary dark:text-white">{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Promotional Banner */}
                <View className="px-6 mb-8">
                    <TouchableOpacity className="bg-secondary dark:bg-zinc-900 rounded-[32px] p-6 flex-row items-center overflow-hidden">
                        <View className="flex-1">
                            <Text className="text-white text-2xl font-uber-bold mb-1">50% OFF</Text>
                            <Text className="text-primary text-sm font-uber-bold mb-3">On your first 3 orders</Text>
                            <View className="bg-primary self-start px-4 py-2 rounded-full">
                                <Text className="text-secondary font-uber-bold text-xs">Order Now</Text>
                            </View>
                        </View>
                        <View className="absolute right-[-20] top-[-10] opacity-20">
                            <StyledMaterialCommunityIcons name="food-fork-drink" size={120} color="#00ff90" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Featured Restaurants */}
                <View className="px-6 mb-10">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-xl font-uber-bold text-secondary dark:text-white">Featured Near You</Text>
                        <TouchableOpacity>
                            <Text className="text-primary font-uber-bold text-sm">See All</Text>
                        </TouchableOpacity>
                    </View>

                    {RESTAURANTS.map((res) => (
                        <TouchableOpacity 
                            key={res.id} 
                            className="mb-6"
                            onPress={() => {
                                addItem({
                                    id: res.id,
                                    name: res.name,
                                    price: parseFloat(res.fee.replace('$', '')),
                                    priceString: res.fee,
                                    quantity: 1,
                                });
                                Alert.alert("Added to Cart", `${res.name} delivery added to basket.`);
                            }}
                        >
                            <Image
                                source={{ uri: res.image }}
                                className="w-full h-48 rounded-[32px] mb-3"
                            />
                            <View className="flex-row justify-between items-start">
                                <View>
                                    <Text className="text-lg font-uber-bold text-secondary dark:text-white">{res.name}</Text>
                                    <Text className="text-xs font-uber text-accent-gray dark:text-zinc-500">
                                        {res.tags.join(" • ")} • {res.time} • {res.fee} Delivery Fee
                                    </Text>
                                </View>
                                <View className="bg-accent-light/50 dark:bg-zinc-800 h-8 w-12 rounded-full items-center justify-center border border-transparent dark:border-zinc-800">
                                    <Text className="text-xs font-uber-bold text-secondary dark:text-white">{res.rating}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </StyledSafeAreaView>
    );
}
