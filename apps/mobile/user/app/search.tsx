import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { StyledIonicons, StyledSafeAreaView } from "../src/lib/interop";
import { useSavedPlacesStore } from "../src/lib/store";

const RECENT_HISTORY = [
    { id: "1", title: "Emily Homes Subd Ph 2", subtitle: "Cabantian, Davao City", icon: "time-sharp" },
    { id: "2", title: "Bangoy Int'l Airport", subtitle: "Sasa, Davao City", icon: "airplane", tag: "Travel" },
    { id: "3", title: "Buddy Store", subtitle: "Malagamot Road, Communal", icon: "time-sharp" },
];

const COMPANY_PLACES = [
    { id: "c1", title: "Acme HQ", address: "42 Innovation Way, London", icon: "business" },
    { id: "c2", title: "City Logistics Hub", address: "Container Terminal 4, London", icon: "cube" },
    { id: "c3", title: "The Shard - Client Office", address: "32 London Bridge St", icon: "office" },
];

export default function SearchScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const { home, work, custom, isBusinessMode } = useSavedPlacesStore();

    // Dynamic stops state: 1 pickup + up to 3 drop-offs
    const [stops, setStops] = React.useState([
        { id: '1', type: 'pickup' as const, value: 'home', placeholder: 'Pickup location' },
        { id: '2', type: 'dropoff' as const, value: '', placeholder: 'Where to?' }
    ]);

    const addStop = () => {
        if (stops.length < 4) {
            const newStops = [...stops];
            const newId = Math.random().toString(36).substr(2, 9);
            newStops.push({ id: newId, type: 'dropoff' as const, value: '', placeholder: 'Add stop' });
            setStops(newStops);
        }
    };

    const removeStop = (id: string) => {
        if (stops.length > 2) {
            setStops(stops.filter(s => s.id !== id));
        }
    };

    const updateStop = (id: string, value: string) => {
        setStops(stops.map(s => s.id === id ? { ...s, value } : s));
    };

    return (
        <StyledSafeAreaView className="flex-1 bg-white dark:bg-[#111111]">
            {/* Header with Title and Close */}
            <View className="px-6 pt-10 pb-4 flex-row items-center justify-between z-50 bg-white dark:bg-[#111111]">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="h-10 w-10 items-center justify-center mr-4"
                    >
                        <StyledIonicons name="close" size={28} color={colorScheme === 'dark' ? 'white' : 'black'} />
                    </TouchableOpacity>
                    <Text className="text-xl font-uber-bold text-secondary dark:text-white">
                        Your route
                    </Text>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Multi-Stop Search Area */}
                <View className="px-6 py-2 flex-row" style={{ zIndex: 10 }}>
                    <View className="flex-1 bg-accent-light/10 dark:bg-zinc-900 rounded-[24px] p-2">
                        {stops.map((stop, index) => (
                            <View key={stop.id} className="flex-row items-center">
                                {/* Left Icon & Connector Column */}
                                <View className="items-center justify-center w-10 py-1">
                                    {index === stops.length - 1 && stop.value === '' ? (
                                        <StyledIonicons name="search" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
                                    ) : (
                                        <View className={`h-4 w-4 rounded-full border-2 ${index === 0 ? 'bg-primary border-primary' : 'border-gray-400 dark:border-zinc-500'} items-center justify-center`}>
                                            {index === 0 && <View className="h-1.5 w-1.5 rounded-full bg-secondary" />}
                                        </View>
                                    )}

                                    {index < stops.length - 1 && (
                                        <View className="h-6 w-[1px] bg-gray-300 dark:bg-zinc-700 my-1" />
                                    )}
                                </View>

                                {/* Input Field */}
                                <View className="flex-1">
                                    <TextInput
                                        placeholder={stop.placeholder}
                                        placeholderTextColor="#71717a"
                                        className={`h-10 font-uber-medium text-base text-secondary dark:text-white ${index < stops.length - 1 ? 'border-b border-gray-100 dark:border-zinc-800' : ''}`}
                                        value={stop.value}
                                        onChangeText={(val) => updateStop(stop.id, val)}
                                        autoFocus={index === stops.length - 1}
                                    />
                                </View>

                                {/* Right Controls Column */}
                                <View className="flex-row items-center px-1">
                                    {index > 1 && (
                                        <TouchableOpacity onPress={() => removeStop(stop.id)} className="p-2">
                                            <StyledIonicons name="close" size={18} color="#ef4444" />
                                        </TouchableOpacity>
                                    )}
                                    <View className="p-2">
                                        <StyledIonicons name="ellipsis-vertical" size={18} color="#71717a" style={{ opacity: 0.3 }} />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Add Stop Button - Visibility based on limit */}
                    <View className="ml-3 justify-center">
                        {stops.length < 4 && (
                            <TouchableOpacity
                                onPress={addStop}
                                className="h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-gray-100 dark:border-zinc-800"
                            >
                                <StyledIonicons name="add" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity className="mt-3 h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-gray-100 dark:border-zinc-800">
                            <StyledIonicons name="swap-vertical" size={20} color="#71717a" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="h-[1px] bg-gray-100 dark:bg-zinc-900 w-full mt-4" />

                {/* Modern History List */}
                {!isBusinessMode && (
                    <View className="px-6 mb-10">
                        <View className="flex-row items-center justify-between mb-8">
                            <Text className="text-xl font-uber-bold text-secondary dark:text-white">Recent History</Text>
                            <TouchableOpacity>
                                <Text className="text-primary font-uber-bold text-sm">See All</Text>
                            </TouchableOpacity>
                        </View>

                        {RECENT_HISTORY.map((item) => (
                            <TouchableOpacity key={item.id} className="flex-row items-center py-4 border-b border-gray-50 dark:border-zinc-900">
                                <View className="h-10 w-10 items-center justify-center mr-4">
                                    <StyledIonicons name={item.icon as any} size={22} color="#adadad" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-lg font-uber-medium text-secondary dark:text-white capitalize">{item.title}</Text>
                                    <Text className="text-xs font-uber text-accent-gray dark:text-zinc-500 mt-0.5 leading-5">{item.subtitle}</Text>
                                </View>
                                {item.tag === "Travel" && <Text className="text-xs font-uber text-accent-gray mr-2">8 km</Text>}
                                <StyledIonicons name="chevron-forward" size={18} color="#71717a" />
                            </TouchableOpacity>
                        ))}

                        {/* Current Location Row */}
                        <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-50 dark:border-zinc-900">
                            <View className="h-10 w-10 items-center justify-center mr-4">
                                <StyledIonicons name="locate-outline" size={22} color="#71717a" />
                            </View>
                            <Text className="text-lg font-uber-medium text-secondary dark:text-white">Current location</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Business Mode History / Locations */}
                {isBusinessMode && (
                    <View className="px-6 mb-10">
                        <Text className="text-sm font-uber-bold text-accent-gray dark:text-zinc-500 mb-6 uppercase tracking-widest">
                            Company Destinations
                        </Text>
                        {COMPANY_PLACES.map((item) => (
                            <TouchableOpacity key={item.id} className="flex-row items-center mb-8">
                                <View className="h-14 w-14 items-center justify-center rounded-[20px] bg-primary/10 border border-primary/20 mr-5">
                                    <StyledIonicons name={item.icon as any} size={22} color="#00ff90" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-lg font-uber-bold text-secondary dark:text-white">{item.title}</Text>
                                    <Text className="text-sm font-uber text-accent-gray dark:text-zinc-500 mt-1">{item.address}</Text>
                                </View>
                                <StyledIonicons name="chevron-forward" size={18} color="#71717a" />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Refined Quick Actions with Navigation Heading */}
                <View className="px-6 mb-4">
                    <TouchableOpacity
                        onPress={() => router.push("/search/choose-place" as any)}
                        className="flex-row items-center justify-between mb-4"
                    >
                        <Text className="text-xl font-uber-bold text-secondary dark:text-white">
                            {isBusinessMode ? "Business Places" : "Saved Places"}
                        </Text>
                        <View className="h-8 w-8 items-center justify-center rounded-full bg-gray-50 dark:bg-zinc-800">
                            <StyledIonicons
                                name="chevron-forward"
                                size={20}
                                color={colorScheme === 'dark' ? 'white' : 'black'}
                            />
                        </View>
                    </TouchableOpacity>

                    <View className="flex-row justify-between mb-6">
                        {isBusinessMode ? (
                            <>
                                <QuickAction
                                    icon="business"
                                    label="Acme HQ"
                                    color="#00ff90"
                                    sub="Office"
                                    onPress={() => { }}
                                />
                                <QuickAction
                                    icon="briefcase"
                                    label="Co-working"
                                    color="#3b82f6"
                                    sub="Meeting"
                                    onPress={() => { }}
                                />
                                <QuickAction
                                    icon="add"
                                    label="Add New"
                                    color="#6366f1"
                                    sub="Business"
                                    onPress={() => { }}
                                />
                            </>
                        ) : (
                            <>
                                <QuickAction
                                    icon="home"
                                    label={home ? home.title : "Add Home"}
                                    color="#00ff90"
                                    sub={home ? home.address : "Setup"}
                                    onPress={() => router.push({ pathname: "/search/map-picker", params: { type: 'home' } } as any)}
                                />
                                <QuickAction
                                    icon="briefcase"
                                    label={work ? work.title : "Add Work"}
                                    color="#3b82f6"
                                    sub={work ? work.address : "Setup"}
                                    onPress={() => router.push({ pathname: "/search/map-picker", params: { type: 'work' } } as any)}
                                />
                                <QuickAction
                                    icon="add"
                                    label="Add New"
                                    color="#6366f1"
                                    sub="Save"
                                    onPress={() => router.push({ pathname: "/search/map-picker", params: { type: 'custom' } } as any)}
                                />
                            </>
                        )}
                    </View>
                </View>

                {/* Always using the same locations? Info Section */}
                <View className="px-6 mb-10 items-center justify-center pt-10">
                    <View className="h-40 w-40 bg-gray-50/50 dark:bg-zinc-900 rounded-full items-center justify-center mb-8">
                        <StyledIonicons name="location" size={80} color={colorScheme === 'dark' ? '#222' : '#eee'} />
                        <View className="absolute top-8 right-8 h-10 w-10 bg-primary/20 rounded-full items-center justify-center">
                            <StyledIonicons name="heart" size={20} color="#00ff90" />
                        </View>
                    </View>
                    <Text className="text-xl font-uber-bold text-secondary dark:text-white mb-2 text-center">
                        Always using the same locations?
                    </Text>
                    <Text className="text-sm font-uber text-accent-gray dark:text-zinc-500 text-center px-10">
                        Save them and make your bookings easily.
                    </Text>
                </View>

                {/* Redesigned VIP Travel Card (Airport Drop-off) */}
                <View className="px-6 mb-10">
                    <TouchableOpacity className="rounded-[40px] bg-[#CCEFFF] p-8 flex-row items-center overflow-hidden border border-white/20 shadow-sm">
                        <View className="flex-1">
                            <Text className="text-zinc-900 dark:text-zinc-900 text-2xl font-uber-bold leading-9 pr-2 mb-4">
                                Simplify your airport arrivals and departures.
                            </Text>
                            <TouchableOpacity className="self-start bg-white px-8 py-3 rounded-full shadow-sm">
                                <Text className="text-secondary font-uber-bold text-sm">Schedule ride</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="absolute right-[-20] bottom-[-10] opacity-30">
                            <StyledIonicons name="airplane" size={140} color="#3b82f6" style={{ transform: [{ rotate: '-45deg' }] }} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Bento Grid - Rides for your every need */}
                <View className="px-6 mb-12">
                    <Text className="text-xl font-uber-bold text-secondary dark:text-white mb-6">Your journey, simplified</Text>
                    <View className="flex-row flex-wrap gap-4">
                        {/* Featured Advance Booking Card */}
                        <DashServiceCard
                            icon="calendar"
                            title="Advance Booking"
                            desc=""
                            color="#3b82f6"
                            bgColor="#CCEFFF"
                            className="w-full h-44"
                            iconAtBottom
                        />

                        {/* Mid-sized Grid */}
                        <View className="flex-row w-full gap-4">
                            <DashServiceCard
                                icon="people"
                                title="Group ride"
                                desc=""
                                color="#65a30d"
                                bgColor="#E6F4A2"
                                className="flex-1 h-28"
                                iconRight
                            />
                            <DashServiceCard
                                icon="people-circle"
                                title="Family account"
                                desc=""
                                color="#d97706"
                                bgColor="#FFEFB0"
                                className="flex-1 h-28"
                                iconRight
                            />
                        </View>
                    </View>
                </View>
                {/* Google Attribution */}
                <View className="items-center py-6">
                    <Text className="text-xs font-uber text-accent-gray dark:text-zinc-600">powered by Google</Text>
                </View>
            </ScrollView>

            {/* Fixed Bottom Confirm Button */}
            <View className="px-6 py-6 pb-10 bg-white dark:bg-[#111111] border-t border-gray-100 dark:border-zinc-900">
                <TouchableOpacity
                    onPress={() => router.push("/negotiation/fare-input" as any)}
                    className="w-full bg-primary py-4 rounded-full items-center justify-center shadow-lg"
                >
                    <Text className="text-secondary font-uber-bold text-lg">Confirm route</Text>
                </TouchableOpacity>
            </View>

        </StyledSafeAreaView>
    );
}

const QuickAction = ({ icon, label, color, sub, onPress }: { icon: any, label: string, color: string, sub: string, onPress?: () => void }) => (
    <TouchableOpacity onPress={onPress} className="flex-1 mx-1.5 items-center">
        <View style={{ backgroundColor: color + '10' }} className="h-16 w-16 mb-3 rounded-[24px] items-center justify-center border border-white dark:border-zinc-800 shadow-sm shadow-black/5 dark:shadow-none">
            <StyledIonicons name={icon} size={26} color={color} />
        </View>
        <Text className="text-sm font-uber-bold text-secondary dark:text-white mb-0.5">{label}</Text>
        <Text className="text-[10px] font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest">{sub}</Text>
    </TouchableOpacity>
);

const DashServiceCard = ({ icon, title, desc, color, bgColor, className, isLarge, iconAtBottom, iconRight }: { icon: any, title: string, desc: string, color: string, bgColor?: string, className?: string, isLarge?: boolean, iconAtBottom?: boolean, iconRight?: boolean }) => (
    <TouchableOpacity
        style={bgColor ? { backgroundColor: bgColor } : {}}
        className={`${!bgColor ? 'bg-white dark:bg-zinc-900' : ''} rounded-[28px] p-5 border border-gray-50/10 dark:border-zinc-800 shadow-sm ${className}`}
    >
        <View className={`flex-1 ${iconRight ? 'flex-row items-center' : ''}`}>
            <View className="flex-1 justify-center">
                <Text className={`${isLarge ? 'text-xl' : 'text-sm'} font-uber-bold text-zinc-900 dark:text-zinc-900 mb-1`}>
                    {title}
                </Text>
                {desc ? (
                    <Text className={`${isLarge ? 'text-sm' : 'text-[10px]'} font-uber text-zinc-600 dark:text-zinc-600 opacity-80`} numberOfLines={2}>
                        {desc}
                    </Text>
                ) : null}
            </View>

            {(iconRight || iconAtBottom) && (
                <View className={`${iconAtBottom ? 'items-end mt-2' : 'ml-2'}`}>
                    <StyledIonicons name={icon} size={iconAtBottom ? 48 : 32} color={color} />
                </View>
            )}
        </View>

        {!iconRight && !iconAtBottom && (
            <View style={{ backgroundColor: color + '15' }} className="h-10 w-10 rounded-[16px] items-center justify-center mt-2">
                <StyledIonicons name={icon} size={22} color={color} />
            </View>
        )}
    </TouchableOpacity>
);
