import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";
import { Card } from "../../src/components/ui/Card";
import { api } from "../../src/lib/api";
import { useCartStore } from "../../src/lib/cartStore";

export default function CheckoutScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const { items, subtotal, promoCode, discountAmount, setPromoCode, clearCart } = useCartStore();
    
    const [couponInput, setCouponInput] = useState("");
    const [isValidating, setIsValidating] = useState(false);

    const deliveryFee = 2.99;
    const total = subtotal + deliveryFee - (discountAmount || 0);

    const handleApplyCoupon = async () => {
        if (!couponInput) return;
        
        setIsValidating(true);
        try {
            // Using a dummy storeId for now as it's not in the cart state yet
            const result = await api.validateCoupon(couponInput, "store-001", subtotal);
            setPromoCode(result.code, result.discountAmount);
            Alert.alert("Success", `Coupon applied! You saved $${result.discountAmount.toFixed(2)}`);
            setCouponInput("");
        } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to validate coupon");
        } finally {
            setIsValidating(false);
        }
    };

    const handlePlaceOrder = () => {
        Alert.alert(
            "Order Placed",
            "Your order has been placed successfully!",
            [
                { 
                    text: "OK", 
                    onPress: () => {
                        clearCart();
                        router.replace("/" as any);
                    } 
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="flex-row items-center px-6 mt-4 mb-6">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="h-10 w-10 items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full"
                    >
                        <Ionicons name="arrow-back" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
                    <Text className="flex-1 text-center text-xl font-uber-bold dark:text-white">Checkout</Text>
                    <View className="w-10" />
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                    {/* Items Summary */}
                    <Text className="text-lg font-uber-bold dark:text-white mb-4">Order Summary</Text>
                    <Card className="mb-6 p-4">
                        {items.length === 0 ? (
                            <Text className="text-center text-accent-gray py-4">Your cart is empty</Text>
                        ) : (
                            items.map((item) => (
                                <View key={item.id} className="flex-row justify-between mb-3">
                                    <Text className="font-uber-medium dark:text-white">
                                        <Text className="text-primary font-uber-bold">{item.quantity}x</Text> {item.name}
                                    </Text>
                                    <Text className="font-uber-bold dark:text-white">{item.priceString}</Text>
                                </View>
                            ))
                        )}
                    </Card>

                    {/* Promo Code Section */}
                    <Text className="text-lg font-uber-bold dark:text-white mb-4">Promo Code</Text>
                    <View className="flex-row gap-3 mb-6">
                        <View className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 flex-row items-center">
                            <Ionicons name="pricetag-outline" size={20} color="#adadad" />
                            <TextInput
                                placeholder="Enter promo code"
                                placeholderTextColor="#adadad"
                                value={couponInput}
                                onChangeText={setCouponInput}
                                className="flex-1 ml-3 font-uber-medium dark:text-white"
                                autoCapitalize="characters"
                            />
                        </View>
                        <TouchableOpacity
                            onPress={handleApplyCoupon}
                            disabled={isValidating || !couponInput}
                            className={`px-6 rounded-2xl items-center justify-center ${
                                isValidating || !couponInput ? "bg-zinc-200 dark:bg-zinc-800" : "bg-primary"
                            }`}
                        >
                            {isValidating ? (
                                <ActivityIndicator size="small" color="#000" />
                            ) : (
                                <Text className="font-uber-bold text-secondary">Apply</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {promoCode && (
                        <View className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl flex-row items-center justify-between mb-6 border border-emerald-100 dark:border-emerald-900/40">
                            <View className="flex-row items-center">
                                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                                <Text className="ml-2 font-uber-bold text-emerald-600">Promo Applied: {promoCode}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setPromoCode(null, 0)}>
                                <Ionicons name="close-circle" size={20} color="#10b981" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Payment Info */}
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-uber-bold dark:text-white">Payment</Text>
                        <TouchableOpacity>
                            <Text className="font-uber-bold text-primary">Change</Text>
                        </TouchableOpacity>
                    </View>
                    <Card className="mb-8 p-4 flex-row items-center">
                        <View className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-4">
                            <Ionicons name="card-outline" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                        </View>
                        <Text className="flex-1 font-uber-medium dark:text-white">•••• 4242</Text>
                        <Ionicons name="chevron-forward" size={18} color="#adadad" />
                    </Card>

                    {/* Totals */}
                    <View className="space-y-3 mb-10">
                        <View className="flex-row justify-between">
                            <Text className="font-uber text-accent-gray dark:text-zinc-500">Subtotal</Text>
                            <Text className="font-uber-medium dark:text-white">${subtotal.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="font-uber text-accent-gray dark:text-zinc-500">Delivery Fee</Text>
                            <Text className="font-uber-medium dark:text-white">${deliveryFee.toFixed(2)}</Text>
                        </View>
                        {discountAmount > 0 && (
                            <View className="flex-row justify-between">
                                <Text className="font-uber text-emerald-600">Discount</Text>
                                <Text className="font-uber-medium text-emerald-600">-${discountAmount.toFixed(2)}</Text>
                            </View>
                        )}
                        <View className="h-[1px] bg-zinc-100 dark:bg-zinc-800 my-2" />
                        <View className="flex-row justify-between">
                            <Text className="font-uber-bold text-xl dark:text-white">Total</Text>
                            <Text className="font-uber-bold text-xl dark:text-white">${total.toFixed(2)}</Text>
                        </View>
                    </View>

                    <Button
                        label="Place Order"
                        onPress={handlePlaceOrder}
                        disabled={items.length === 0}
                        className="mb-10"
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
