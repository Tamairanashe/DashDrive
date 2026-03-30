import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface DriverCardProps {
    driver: string;
    rating: number;
    price: number;
    time: string;
    vehicle: string;
    seats: number;
    isRecommended?: boolean;
    onPress: () => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({ driver, rating, price, time, vehicle, seats, isRecommended, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            {isRecommended && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>BEST VALUE</Text>
                </View>
            )}
            
            <View style={styles.header}>
                <View style={styles.driverInfo}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={24} color="#71717a" />
                    </View>
                    <View>
                        <Text style={styles.driverName}>{driver}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={14} color="#f59e0b" />
                            <Text style={styles.ratingText}>{rating}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>${price}</Text>
                    <Text style={styles.priceUnit}>per seat</Text>
                </View>
            </View>

            <View style={styles.detailsRow}>
                <View style={styles.detailTag}><Text style={styles.tagText}>{time}</Text></View>
                <View style={styles.detailTag}><Text style={styles.tagText}>{vehicle}</Text></View>
            </View>

            <View style={styles.footer}>
                <View style={styles.seatsInfo}>
                    <MaterialCommunityIcons name="seat-passenger" size={18} color="#3b82f6" />
                    <Text style={styles.seatsText}>{seats} seats left</Text>
                </View>
                <View style={styles.bookBtn}>
                    <Text style={styles.bookBtnText}>Book</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { backgroundColor: 'white', padding: 24, borderRadius: 32, marginBottom: 16, borderWidth: 1, borderColor: '#f3f4f6', position: 'relative', overflow: 'hidden' },
    badge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#fca311', paddingHorizontal: 12, paddingVertical: 4, borderBottomLeftRadius: 16 },
    badgeText: { fontSize: 10, fontWeight: '800', color: 'black' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    driverInfo: { flexDirection: 'row', alignItems: 'center' },
    avatar: { height: 48, width: 48, borderRadius: 24, backgroundColor: '#f4f4f5', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    driverName: { fontSize: 18, fontWeight: '700', color: '#18181b' },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { fontSize: 14, color: '#71717a', fontWeight: '500', marginLeft: 4 },
    priceContainer: { alignItems: 'flex-end' },
    price: { fontSize: 24, fontWeight: '800', color: '#18181b' },
    priceUnit: { fontSize: 12, color: '#a1a1aa' },
    detailsRow: { flexDirection: 'row', marginBottom: 16, gap: 8 },
    detailTag: { backgroundColor: '#f9fafb', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
    tagText: { fontWeight: '700', color: '#3f3f46' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    seatsInfo: { flexDirection: 'row', alignItems: 'center' },
    seatsText: { color: '#3b82f6', fontWeight: '700', marginLeft: 8 },
    bookBtn: { backgroundColor: '#18181b', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 },
    bookBtnText: { color: 'white', fontWeight: '700' }
});
