import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    Extrapolate,
    FadeIn,
    FadeOut,
    interpolate,
    SlideInLeft,
    SlideInRight,
    SlideOutLeft,
    SlideOutRight,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from "react-native-reanimated";
import { StyledIonicons, StyledMaterialCommunityIcons } from "../lib/interop";
import { useSavedPlacesStore } from "../lib/store";

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
    const router = useRouter();
    const { colorScheme, setColorScheme } = useColorScheme();
    const { hasCompanyProfile, userMode, setUserMode } = useSavedPlacesStore();
    const [showMoreServices, setShowMoreServices] = React.useState(false);

    React.useEffect(() => {
        if (!isOpen) {
            setShowMoreServices(false);
        }
    }, [isOpen]);

    const navigate = (route: string) => {
        onClose();
        router.push(route as any);
    };

    const scrollY = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const profileImageStyle = useAnimatedStyle(() => {
        const scale = interpolate(scrollY.value, [-50, 0, 100], [1.1, 1, 0.6], Extrapolate.CLAMP);
        const translateY = interpolate(scrollY.value, [0, 100], [0, -20], Extrapolate.CLAMP);
        return {
            transform: [{ scale }, { translateY }],
        };
    });

    const profileContainerStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [0, 80], [1, 0], Extrapolate.CLAMP);
        const translateY = interpolate(scrollY.value, [0, 80], [0, -10], Extrapolate.CLAMP);
        return {
            opacity,
            transform: [{ translateY }],
        };
    });

    const headerBackgroundStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [50, 100], [0, 1], Extrapolate.CLAMP);
        return {
            opacity,
            backgroundColor: colorScheme === 'dark' ? '#18181b' : '#ffffff',
        };
    });

    if (!isOpen) return null;

    return (
        <View className="absolute inset-0 z-[100]">
            <View className="flex-1">
                <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                    className="absolute inset-0 bg-black/50"
                >
                    <Pressable className="flex-1" onPress={onClose} />
                </Animated.View>

                <Animated.View
                    entering={userMode === 'pilot' ? SlideInLeft.duration(300) : SlideInRight.duration(300)}
                    exiting={userMode === 'pilot' ? SlideOutLeft.duration(300) : SlideOutRight.duration(300)}
                    className="absolute inset-0 bg-gray-50 dark:bg-zinc-950"
                >
                    {/* Floating Sticky Header for Email and Close Button */}
                    <View className="absolute top-0 left-0 right-0 z-20 pt-14 pb-4 px-6">
                        <Animated.View style={[StyleSheet.absoluteFill, headerBackgroundStyle]} />
                        <View className={`flex-row items-center ${userMode === 'pilot' ? 'justify-start' : 'justify-end'}`}>
                            <TouchableOpacity
                                onPress={onClose}
                                className="h-10 w-10 items-center justify-center bg-white dark:bg-zinc-800 rounded-full shadow-sm"
                            >
                                <StyledIonicons name="close" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Animated.ScrollView
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                        contentContainerStyle={{ paddingTop: 120, paddingBottom: 40 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Profile Section */}
                        <View className="items-center px-6 mb-8">
                            <Animated.View style={profileImageStyle}>
                                <View className="relative">
                                    {/* Colorful Border Effect */}
                                    <View className="h-[108px] w-[108px] rounded-full p-[3.5px] border-2 border-primary/30 items-center justify-center">
                                        <View className="h-full w-full rounded-full overflow-hidden border border-gray-100 dark:border-zinc-800">
                                            <Image
                                                source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }}
                                                className="h-full w-full"
                                            />
                                        </View>
                                    </View>
                                    {/* Camera Icon Overlay */}
                                    <View className="absolute bottom-1 right-1 h-8 w-8 bg-white dark:bg-zinc-800 rounded-full items-center justify-center shadow-md border border-gray-100 dark:border-zinc-700">
                                        <StyledIonicons name="camera-outline" size={16} color={colorScheme === 'dark' ? 'white' : 'black'} />
                                    </View>
                                </View>
                            </Animated.View>

                            <Animated.View style={[profileContainerStyle, { alignItems: 'center', marginTop: 16 }]}>
                                <Text className="text-2xl font-uber-bold text-secondary dark:text-white">
                                    Hi, Bruce M.!
                                </Text>
                                <View className="flex-row items-center mt-3 bg-white dark:bg-zinc-900 px-4 py-1.5 rounded-full border border-gray-100 dark:border-zinc-800 shadow-sm">
                                    <View className="flex-row mr-2">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <StyledIonicons key={i} name="star" size={14} color="#FFB800" />
                                        ))}
                                    </View>
                                    <Text className="text-sm font-uber-bold text-secondary dark:text-white">5.0</Text>
                                </View>
                            </Animated.View>
                        </View>

                        {/* Account Switcher (Rider/Pilot) */}
                        <View className="mx-4 mb-6 bg-white dark:bg-zinc-900 rounded-3xl px-6 py-4 shadow-sm border border-black/5 dark:border-zinc-800">
                            <TouchableOpacity
                                className="flex-row items-center justify-between"
                                onPress={() => {
                                    const newMode = userMode === 'rider' ? 'pilot' : 'rider';
                                    setUserMode(newMode);
                                    onClose();
                                    if (newMode === 'pilot') {
                                        router.replace("/pilot/welcome" as any);
                                    } else {
                                        router.replace("/home" as any);
                                    }
                                }}
                            >
                                <View className="flex-row items-center">
                                    <View className={`h-10 w-10 rounded-full ${userMode === 'rider' ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-primary/20'} items-center justify-center mr-3`}>
                                        <StyledIonicons
                                            name={userMode === 'rider' ? "bicycle-outline" : "person-outline"}
                                            size={20}
                                            color={userMode === 'rider' ? (colorScheme === 'dark' ? 'white' : 'black') : '#00ff90'}
                                        />
                                    </View>
                                    <View>
                                        <Text className="font-uber-bold text-secondary dark:text-white">
                                            {userMode === 'rider' ? 'Pilot Mode' : 'Rider Mode'}
                                        </Text>
                                        <Text className="text-[11px] text-accent-gray dark:text-zinc-500">
                                            Switch to {userMode === 'rider' ? 'driving' : 'passenger'}
                                        </Text>
                                    </View>
                                </View>
                                <View className="bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1 rounded-full">
                                    <Text className="text-[10px] font-uber-bold text-accent-gray dark:text-zinc-400 uppercase tracking-tighter">Switch</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {userMode === 'rider' ? (
                            <>
                                {/* RIDER MODE MENU */}
                                <Text className="mx-6 mb-4 text-[13px] font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest">
                                    Our Services
                                </Text>
                                <View className="mx-4 mb-6 bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden shadow-sm border border-black/5 dark:border-zinc-800">
                                    <MenuOption icon="car-outline" label="Car" onPress={() => { }} />
                                    <MenuOption icon="navigate-outline" label="Intercity" onPress={() => { }} />
                                    <MenuOption icon="cube-outline" label="Delivery" onPress={() => { }} />
                                    <MenuOption
                                        icon="truck-delivery"
                                        label="Cargo"
                                        onPress={() => { }}
                                        IconComponent={StyledMaterialCommunityIcons}
                                    />

                                    {!showMoreServices ? (
                                        <TouchableOpacity
                                            className="flex-row items-center py-4 px-6 border-t border-black/5 dark:border-zinc-800/50"
                                            onPress={() => setShowMoreServices(true)}
                                        >
                                            <View className="w-6 items-center">
                                                <StyledIonicons name="chevron-down" size={20} color={colorScheme === 'dark' ? '#71717a' : '#adadad'} />
                                            </View>
                                            <Text className="ml-4 text-sm font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest">Show More</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <Animated.View entering={FadeIn.duration(300)}>
                                            <MenuOption icon="fast-food-outline" label="Food" onPress={() => { }} />
                                            <MenuOption icon="cart-outline" label="Shopping" onPress={() => { }} />
                                            <MenuOption icon="basket-outline" label="Grocery" onPress={() => { }} />
                                            <MenuOption icon="car-sport-outline" label="Rent a Car" onPress={() => { }} />
                                            <MenuOption icon="bus-outline" label="School Run" onPress={() => { }} />
                                            <MenuOption icon="list-outline" label="Errands" onPress={() => { }} />
                                            <MenuOption icon="shield-checkmark-outline" label="Insurance" onPress={() => { }} />
                                            <MenuOption icon="gift-outline" label="Gifts" onPress={() => { }} />
                                            <MenuOption icon="receipt-outline" label="Bills" onPress={() => { }} />

                                            <TouchableOpacity
                                                className="flex-row items-center py-4 px-6 border-t border-black/5 dark:border-zinc-800/50"
                                                onPress={() => setShowMoreServices(false)}
                                            >
                                                <View className="w-6 items-center">
                                                    <StyledIonicons name="chevron-up" size={20} color={colorScheme === 'dark' ? '#71717a' : '#adadad'} />
                                                </View>
                                                <Text className="ml-4 text-sm font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest">Show Less</Text>
                                            </TouchableOpacity>
                                        </Animated.View>
                                    )}
                                </View>

                                <Text className="mx-6 mb-4 text-[13px] font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest">
                                    More from DashDrive
                                </Text>

                                <View className="mx-4 mt-4 bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden shadow-sm border border-black/5 dark:border-zinc-800">
                                    <MenuOption icon="time-outline" label="History" onPress={() => navigate("/account/history")} />
                                    <MenuOption icon="wallet-outline" label="Wallet" onPress={() => navigate("/account/wallet")} />
                                    <MenuOption
                                        icon="briefcase-outline"
                                        label={hasCompanyProfile ? "Company Profile" : "Claim ride costs"}
                                        onPress={() => navigate("/account/company")}
                                    />
                                </View>

                                <View className="mx-4 mt-4 bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden shadow-sm border border-black/5 dark:border-zinc-800">
                                    <MenuOption icon="bookmark-outline" label="Saved Places" onPress={() => navigate("/account/saved-places")} />
                                    <MenuOption icon="gift-outline" label="Promos" onPress={() => { }} />
                                    <MenuOption icon="settings-outline" label="Settings" onPress={() => navigate("/settings")} />
                                    <MenuOption icon="help-circle-outline" label="Support" onPress={() => navigate("/settings/support")} />
                                </View>
                            </>
                        ) : (
                            <>
                                {/* PILOT/DRIVER MODE MENU */}


                                <Text className="mx-6 mb-4 text-[13px] font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest">
                                    Driver Dashboard
                                </Text>
                                <View className="mx-4 mb-6 bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden shadow-sm border border-black/5 dark:border-zinc-800">
                                    <MenuOption icon="car-outline" label="My Trips" onPress={() => { }} />
                                    <MenuOption icon="cash-outline" label="Earnings" onPress={() => navigate("/pilot/earnings")} />
                                    <MenuOption icon="gift-outline" label="Promotions" onPress={() => navigate("/pilot/promotions")} />
                                    <MenuOption icon="stats-chart-outline" label="Performance" onPress={() => { }} />
                                </View>

                                <Text className="mx-6 mb-4 text-[13px] font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest">
                                    Vehicle & Documents
                                </Text>
                                <View className="mx-4 mb-6 bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden shadow-sm border border-black/5 dark:border-zinc-800">
                                    <MenuOption icon="car-sport-outline" label="Vehicle Info" onPress={() => navigate("/pilot/profile")} />
                                    <MenuOption icon="document-text-outline" label="Documents" onPress={() => navigate("/pilot/profile")} />
                                    <MenuOption icon="clipboard-outline" label="Inspections" onPress={() => { }} />
                                    <MenuOption icon="shield-checkmark-outline" label="Insurance" onPress={() => navigate("/pilot/profile")} />
                                </View>

                                <Text className="mx-6 mb-4 text-[13px] font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest">
                                    Driver Settings
                                </Text>
                                <View className="mx-4 mb-6 bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden shadow-sm border border-black/5 dark:border-zinc-800">
                                    <MenuOption icon="calendar-outline" label="Availability Schedule" onPress={() => { }} />
                                    <MenuOption icon="location-outline" label="Preferred Areas" onPress={() => { }} />
                                    <MenuOption icon="options-outline" label="Trip Preferences" onPress={() => { }} />
                                    <MenuOption icon="navigate-outline" label="Navigation App" onPress={() => { }} />
                                </View>

                                <Text className="mx-6 mb-4 text-[13px] font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest">
                                    Support & More
                                </Text>
                                <View className="mx-4 mb-6 bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden shadow-sm border border-black/5 dark:border-zinc-800">
                                    <MenuOption icon="headset-outline" label="Driver Support" onPress={() => { }} />
                                    <MenuOption icon="school-outline" label="Training & Resources" onPress={() => { }} />
                                    <MenuOption icon="information-circle-outline" label="Driver Guidelines" onPress={() => { }} />
                                    <MenuOption icon="shield-outline" label="Admin Dashboard" onPress={() => navigate("/admin")} />
                                </View>

                                <View className="mx-4 bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden shadow-sm border border-black/5 dark:border-zinc-800">
                                    <MenuOption icon="settings-outline" label="Settings" onPress={() => navigate("/settings")} />
                                    <MenuOption icon="help-circle-outline" label="Help Center" onPress={() => navigate("/settings/support")} />
                                </View>
                            </>
                        )}

                        {/* Footer */}
                        <View className="items-center mt-10 mb-8">
                            <View className="flex-row gap-4 mb-4">
                                <TouchableOpacity className="w-11 h-11 rounded-full bg-white dark:bg-zinc-800 items-center justify-center shadow-sm border border-black/5 dark:border-zinc-700">
                                    <StyledIonicons name="logo-facebook" size={22} color={colorScheme === 'dark' ? '#fff' : '#1877F2'} />
                                </TouchableOpacity>
                                <TouchableOpacity className="w-11 h-11 rounded-full bg-white dark:bg-zinc-800 items-center justify-center shadow-sm border border-black/5 dark:border-zinc-700">
                                    <StyledIonicons name="logo-instagram" size={22} color={colorScheme === 'dark' ? '#fff' : '#E4405F'} />
                                </TouchableOpacity>
                                <TouchableOpacity className="w-11 h-11 rounded-full bg-white dark:bg-zinc-800 items-center justify-center shadow-sm border border-black/5 dark:border-zinc-700">
                                    <StyledIonicons name="logo-twitter" size={22} color={colorScheme === 'dark' ? '#fff' : '#1DA1F2'} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => navigate("/settings/terms")} className="mb-3">
                                <Text className="text-xs font-uber-medium text-primary underline">Terms and Service</Text>
                            </TouchableOpacity>
                            <Text className="text-xs font-uber text-accent-gray dark:text-zinc-600">© DashDrive Technologies Pvt Ltd</Text>
                        </View>

                    </Animated.ScrollView>
                </Animated.View>
            </View>
        </View>
    );
};


function MenuOption({ icon, label, onPress, IconComponent = StyledIonicons }: { icon: any, label: string, onPress: () => void, IconComponent?: any }) {
    const { colorScheme } = useColorScheme();
    return (
        <TouchableOpacity className="flex-row items-center py-4 px-6" onPress={onPress}>
            <IconComponent name={icon} size={22} color={colorScheme === 'dark' ? '#71717a' : '#adadad'} />
            <Text className="ml-4 text-lg font-uber-medium text-secondary dark:text-white">{label}</Text>
        </TouchableOpacity>
    );
}
