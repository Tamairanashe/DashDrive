import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState, useEffect } from "react";
import {
    FlatList,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
    Dimensions,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons } from "../../src/lib/interop";
import { CategoryChip, EventCard, FeaturedEventCard } from "../../src/components/events/EventUI";
import { api } from "../../src/lib/api";

const { width } = Dimensions.get("window");

const CATEGORIES = [
    { id: "1", name: "All", icon: "apps" },
    { id: "2", name: "Music", icon: "musical-notes" },
    { id: "3", name: "Art", icon: "color-palette" },
    { id: "4", name: "Workshop", icon: "build" },
    { id: "5", name: "Food", icon: "restaurant" },
];

export default function EventsHomeScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setIsLoading(true);
        try {
            const data = await api.fetchEvents();
            // Transform backend data to UI format
            const transformedData = data.map((e: any) => ({
                id: e.id.toString(),
                title: e.title,
                category: "Music", // Mapping categories would need a categories table
                date: new Date(e.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
                time: new Date(e.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                venue: e.venues?.name || "Online",
                price: "$45", // Mock price as it might be in ticket_types table
                image: e.image_url || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80"
            }));
            setEvents(transformedData);
        } catch (error) {
            console.error("Error loading events:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const featuredEvents = events.slice(0, 3);
    const popularEvents = events;

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <SafeAreaView className="flex-1 px-6 pt-4" edges={['top']}>
                {/* Header */}
                <View className="flex-row items-center justify-between mb-8">
                    <View className="flex-row items-center">
                        <Image 
                            source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" }} 
                            className="h-12 w-12 rounded-full mr-4"
                        />
                        <View>
                            <Text className="text-secondary/40 dark:text-white/40 font-uber-medium text-xs">Good Morning 👋</Text>
                            <Text className="text-lg font-uber-bold text-secondary dark:text-white">Andrew Ainsley</Text>
                        </View>
                    </View>
                    <Pressable className="h-12 w-12 rounded-full border border-zinc-100 dark:border-zinc-800 items-center justify-center">
                        <StyledIonicons name="notifications-outline" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </Pressable>
                </View>

                {/* Search Bar */}
                <Pressable 
                    onPress={() => router.push("/events/search" as any)}
                    className="flex-row items-center rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-4 py-4 mb-8"
                >
                    <StyledIonicons name="search-outline" size={20} color="#adadad" />
                    <Text className="ml-3 flex-1 font-uber-medium text-secondary/40 dark:text-white/40">
                        What event are you looking for...
                    </Text>
                    <StyledIonicons name="options-outline" size={20} color="#FFD700" />
                </Pressable>

                <ScrollView showsVerticalScrollIndicator={false} className="flex-1 -mx-6 px-6">
                    {isLoading ? (
                        <View className="py-20">
                            <ActivityIndicator size="large" color="#FFD700" />
                        </View>
                    ) : (
                        <>
                            {/* Featured Section */}
                            <View className="flex-row items-center justify-between mb-6">
                                <Text className="text-2xl font-uber-bold text-secondary dark:text-white">Featured</Text>
                                <Pressable>
                                    <Text className="text-primary font-uber-bold">See All</Text>
                                </Pressable>
                            </View>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6 mb-10">
                                {featuredEvents.map(event => (
                                    <FeaturedEventCard 
                                        key={event.id} 
                                        event={event} 
                                        onPress={() => router.push({ pathname: "/events/details", params: { id: event.id } } as any)} 
                                    />
                                ))}
                                {featuredEvents.length === 0 && (
                                    <Text className="text-zinc-400 font-uber-medium">No featured events today</Text>
                                )}
                            </ScrollView>

                            {/* Popular Events Section */}
                            <View className="flex-row items-center justify-between mb-6">
                                <Text className="text-2xl font-uber-bold text-secondary dark:text-white">Popular Event 🔥</Text>
                                <Pressable>
                                    <Text className="text-primary font-uber-bold">See All</Text>
                                </Pressable>
                            </View>

                            {/* Category Filter */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6 mb-8">
                                {CATEGORIES.map(cat => (
                                    <CategoryChip 
                                        key={cat.id}
                                        label={cat.name}
                                        icon={cat.icon}
                                        isSelected={selectedCategory === cat.name}
                                        onPress={() => setSelectedCategory(cat.name)}
                                    />
                                ))}
                            </ScrollView>

                            {/* Event List */}
                            <View className="pb-10">
                                {popularEvents.map(event => (
                                    <EventCard 
                                        key={event.id} 
                                        event={event} 
                                        onPress={() => router.push({ pathname: "/events/details", params: { id: event.id } } as any)} 
                                    />
                                ))}
                                {popularEvents.length === 0 && (
                                    <View className="py-10 items-center">
                                        <Text className="text-zinc-500 font-uber-bold">No events found</Text>
                                    </View>
                                )}
                            </View>
                        </>
                    )}
                </ScrollView>
            </SafeAreaView>

            {/* Bottom Nav Simulation */}
            <View className="flex-row items-center justify-around py-4 bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-800">
                <NavIcon icon="home" label="Home" active />
                <NavIcon icon="compass-outline" label="Explore" />
                <NavIcon icon="heart-outline" label="Favorites" />
                <NavIcon icon="ticket-outline" label="Tickets" />
                <NavIcon icon="person-outline" label="Profile" />
            </View>
        </View>
    );
}

function NavIcon({ icon, label, active = false }: any) {
    return (
        <View className="items-center">
            <StyledIonicons name={icon} size={24} color={active ? '#FFD700' : '#adadad'} />
            <Text className={`text-[10px] mt-1 font-uber-bold ${active ? 'text-primary' : 'text-zinc-400'}`}>{label}</Text>
        </View>
    );
}
