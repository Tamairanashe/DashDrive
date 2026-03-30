import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
    FlatList,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
    Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons } from "../../src/lib/interop";
import { EventCard } from "../../src/components/events/EventUI";

const { width } = Dimensions.get("window");

const SEARCH_SUGGESTIONS = [
    "National Music Festival",
    "Art Workshops",
    "Tech Seminar",
    "Jazz Festival",
    "Classical Concert",
];

const SEARCH_RESULTS = [
    {
        id: "3",
        title: "Art Workshops",
        category: "Art",
        date: "Fri, Dec 20",
        time: "13.00 - 15.00 PM",
        venue: "New Avenue, WA",
        price: "$20",
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "4",
        title: "Music Concert",
        category: "Music",
        date: "Tue, Dec 19",
        time: "19.00 - 22.00 PM",
        venue: "Central Park, NY",
        price: "$45",
        image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80",
    },
];

export default function EventsSearchScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [viewMode, setViewMode] = useState<'card' | 'list'>('list');

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        setIsSearching(text.length > 0);
    };

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <SafeAreaView className="flex-1 px-6 pt-4" edges={['top']}>
                {/* Header / Search Bar */}
                <View className="flex-row items-center mb-6">
                    <Pressable 
                        onPress={() => router.back()}
                        className="mr-4"
                    >
                        <StyledIonicons name="arrow-back" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </Pressable>
                    <View className="flex-1 flex-row items-center rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-4 py-3">
                        <StyledIonicons name="search-outline" size={20} color="#adadad" />
                        <TextInput 
                            autoFocus
                            placeholder="Search..."
                            placeholderTextColor="#adadad"
                            value={searchQuery}
                            onChangeText={handleSearch}
                            className="ml-3 flex-1 font-uber-medium text-secondary dark:text-white"
                        />
                        {searchQuery.length > 0 && (
                            <Pressable onPress={() => handleSearch("")}>
                                <StyledIonicons name="close-circle" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
                            </Pressable>
                        )}
                        <Pressable className="ml-2">
                            <StyledIonicons name="options-outline" size={20} color="#FFD700" />
                        </Pressable>
                    </View>
                </View>

                {!isSearching ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-xl font-uber-bold text-secondary dark:text-white">Recent Search</Text>
                            <Pressable>
                                <Text className="text-primary font-uber-bold">Clear All</Text>
                            </Pressable>
                        </View>
                        {SEARCH_SUGGESTIONS.map((suggestion, index) => (
                            <Pressable 
                                key={index}
                                onPress={() => handleSearch(suggestion)}
                                className="flex-row items-center justify-between py-4 border-b border-zinc-50 dark:border-zinc-900/50"
                            >
                                <Text className="text-secondary/60 dark:text-white/60 font-uber-medium text-lg">{suggestion}</Text>
                                <StyledIonicons name="close-outline" size={20} color="#adadad" />
                            </Pressable>
                        ))}
                    </ScrollView>
                ) : (
                    <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-xl font-uber-bold text-secondary dark:text-white">Results for "{searchQuery}"</Text>
                            <View className="flex-row items-center space-x-4">
                                <Pressable 
                                    onPress={() => setViewMode('list')}
                                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary/10' : ''}`}
                                >
                                    <StyledIonicons name="list" size={20} color={viewMode === 'list' ? '#FFD700' : '#adadad'} />
                                </Pressable>
                                <Pressable 
                                    onPress={() => setViewMode('card')}
                                    className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-primary/10' : ''}`}
                                >
                                    <StyledIonicons name="grid" size={20} color={viewMode === 'card' ? '#FFD700' : '#adadad'} />
                                </Pressable>
                            </View>
                        </View>

                        <Text className="text-secondary/40 dark:text-white/40 font-uber-bold text-sm mb-6 uppercase tracking-widest">
                            Found {SEARCH_RESULTS.length} Results
                        </Text>

                        <FlatList 
                            data={SEARCH_RESULTS}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <EventCard 
                                    event={item} 
                                    onPress={() => router.push({ pathname: "/events/details", params: { id: item.id } } as any)} 
                                />
                            )}
                            ListEmptyComponent={() => (
                                <View className="flex-1 items-center justify-center pt-20">
                                    <Image 
                                        source={{ uri: "https://img.icons8.com/bubbles/200/search.png" }}
                                        className="h-40 w-40 opacity-50 mb-6"
                                    />
                                    <Text className="text-2xl font-uber-bold text-secondary dark:text-white">Not Found</Text>
                                    <Text className="text-secondary/40 dark:text-white/40 font-uber-medium text-center mt-2 px-10">
                                        Sorry, the keyword you entered could not be found, please check again or search with another keyword.
                                    </Text>
                                </View>
                            )}
                        />
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}
