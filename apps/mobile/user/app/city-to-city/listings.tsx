import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledIonicons } from "../../src/lib/interop";
import { DriverCard } from "../../src/components/city-to-city/DriverCard";
import { CityApiService } from "../../src/services/city-to-city/api";

export default function TripListings() {
    const router = useRouter();
    const { from = "Harare", to = "Bulawayo", date } = useLocalSearchParams();
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("Recommended");

    useEffect(() => {
        const fetchTrips = async () => {
            setLoading(true);
            try {
                const data = await CityApiService.getAvailableTrips(from as string, to as string, date as string);
                setTrips(data);
            } catch (error) {
                console.error("Fetch trips failed:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, [from, to, date]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 border-b border-zinc-100">
                <View className="flex-row items-center mb-2">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <StyledIonicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-xl font-uber-bold">{from} → {to}</Text>
                        <Text className="text-zinc-500 font-uber-medium">{date || 'Tomorrow, 2nd Oct'}</Text>
                    </View>
                </View>
            </View>

            {/* Filter Chips */}
            <View className="px-6 py-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {["Recommended", "Cheapest", "Earliest", "Highest Rated"].map((item) => (
                        <TouchableOpacity 
                            key={item}
                            onPress={() => setFilter(item)}
                            className={`px-6 py-3 rounded-full mr-3 ${filter === item ? 'bg-secondary' : 'bg-zinc-100'}`}
                        >
                            <Text className={`font-uber-bold ${filter === item ? 'text-white' : 'text-zinc-600'}`}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView className="flex-1 px-6 pt-2">
                {loading ? (
                    <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
                ) : trips.length > 0 ? (
                    trips.map((trip, idx) => (
                        <DriverCard 
                            key={trip.id}
                            driver={trip.driverName || "Alex P."}
                            rating={trip.rating || 4.9}
                            price={trip.pricePerSeat}
                            time="08:30 AM"
                            vehicle="Toyota Wish"
                            seats={trip.availableSeats}
                            isRecommended={idx === 0}
                            onPress={() => router.push({
                                pathname: "/city-to-city/book",
                                params: { tripId: trip.id, driver: trip.driverName || "Alex P.", price: trip.pricePerSeat }
                            } as any)}
                        />
                    ))
                ) : (
                    <View className="items-center justify-center mt-20">
                        <StyledIonicons name="search" size={48} color="#e5e7eb" />
                        <Text className="text-zinc-400 font-uber-bold mt-4 text-center">No trips found for this route.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
