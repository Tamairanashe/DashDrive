import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";

interface Invitation {
    id: string;
    companyName: string;
    companyEmail: string;
    invitedBy: string;
    role: "admin" | "member";
    invitedAt: string;
    expiresIn: string; // e.g., "5 days", "2 hours", "Expired"
    expiryStatus: "active" | "expiring" | "expired";
}

const MOCK_INVITATIONS: Invitation[] = [
    {
        id: "1",
        companyName: "Acme Corporation",
        companyEmail: "billing@acme.com",
        invitedBy: "Bruce M.",
        role: "member",
        invitedAt: "2 hours ago",
        expiresIn: "6 days",
        expiryStatus: "active"
    },
    {
        id: "2",
        companyName: "Global Tech Inc",
        companyEmail: "finance@globaltech.io",
        invitedBy: "Sarah Johnson",
        role: "admin",
        invitedAt: "5 days ago",
        expiresIn: "2 days",
        expiryStatus: "expiring"
    },
    {
        id: "3",
        companyName: "Old Corp Ltd",
        companyEmail: "hr@oldcorp.com",
        invitedBy: "John Doe",
        role: "member",
        invitedAt: "2 weeks ago",
        expiresIn: "Expired",
        expiryStatus: "expired"
    },
];

export default function CompanyInvitationsScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [invitations, setInvitations] = useState<Invitation[]>(MOCK_INVITATIONS);

    const activeInvitations = invitations.filter(i => i.expiryStatus !== "expired");
    const expiredInvitations = invitations.filter(i => i.expiryStatus === "expired");

    const handleAccept = (invitation: Invitation) => {
        if (invitation.expiryStatus === "expired") {
            Alert.alert("Invitation Expired", "This invitation has expired. Please ask the admin to send a new one.");
            return;
        }
        Alert.alert(
            "Join Company",
            `Accept invitation to join ${invitation.companyName} as ${invitation.role === "admin" ? "an Admin" : "a Member"}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Accept",
                    onPress: () => {
                        setInvitations(invitations.filter(i => i.id !== invitation.id));
                        Alert.alert(
                            "Welcome! 🎉",
                            `You've joined ${invitation.companyName}. You can now book rides using the company profile.`,
                            [{ text: "Great!", onPress: () => router.push("/account/company" as any) }]
                        );
                    }
                }
            ]
        );
    };

    const handleDecline = (invitation: Invitation) => {
        Alert.alert(
            invitation.expiryStatus === "expired" ? "Remove Invitation" : "Decline Invitation",
            invitation.expiryStatus === "expired"
                ? `Remove this expired invitation from ${invitation.companyName}?`
                : `Decline invitation from ${invitation.companyName}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: invitation.expiryStatus === "expired" ? "Remove" : "Decline",
                    style: "destructive",
                    onPress: () => setInvitations(invitations.filter(i => i.id !== invitation.id))
                }
            ]
        );
    };

    const getExpiryColor = (status: string) => {
        switch (status) {
            case "expiring": return { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-500", icon: "#eab308" };
            case "expired": return { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-500", icon: "#ef4444" };
            default: return { bg: "bg-zinc-100 dark:bg-zinc-700", text: "dark:text-white", icon: "#adadad" };
        }
    };

    const renderInvitation = (invitation: Invitation) => {
        const expiryColor = getExpiryColor(invitation.expiryStatus);
        const isExpired = invitation.expiryStatus === "expired";

        return (
            <View key={invitation.id} className="py-6 border-b border-zinc-100 dark:border-zinc-800">
                {/* Header-like row */}
                <View className={`flex-row items-center mb-4 ${isExpired ? "opacity-50" : ""}`}>
                    <View className="w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center mr-4">
                        <Ionicons name="briefcase" size={24} color="#00ff90" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-uber-bold dark:text-white capitalize">{invitation.companyName}</Text>
                        <View className="flex-row items-center">
                            <Text className={`text-[10px] font-uber-bold tracking-wider ${invitation.role === 'admin' ? 'text-primary' : 'text-accent-gray dark:text-zinc-500'} uppercase`}>
                                {invitation.role}
                            </Text>
                            <Text className="mx-2 text-zinc-300 dark:text-zinc-700">•</Text>
                            <Text className="text-xs text-accent-gray dark:text-zinc-500 font-uber">Invited by {invitation.invitedBy}</Text>
                        </View>
                    </View>
                </View>

                {/* Info row */}
                <View className={`mb-6 ${isExpired ? "opacity-50" : ""}`}>
                    <Text className="text-xs text-accent-gray dark:text-zinc-400 font-uber leading-5">
                        {invitation.role === "admin"
                            ? "You'll have full administrative access: managing team members, viewing reports, and updating places."
                            : "You'll be able to book business rides and track your expenses using this company's profile."}
                    </Text>
                </View>

                {/* Status or Actions */}
                {isExpired ? (
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
                            <Text className="ml-1.5 text-xs font-uber-bold text-red-500 uppercase">Expired</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDecline(invitation)}>
                            <Text className="text-xs font-uber-bold text-accent-gray dark:text-zinc-500 uppercase">Remove</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="gap-3">
                        <View className={`flex-row items-center px-4 py-3 ${expiryColor.bg} rounded-xl`}>
                            <Ionicons name="time-outline" size={16} color={expiryColor.icon} />
                            <Text className={`ml-2 text-[10px] font-uber-bold uppercase tracking-wider ${expiryColor.text}`}>
                                Expires in {invitation.expiresIn}
                            </Text>
                        </View>

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => handleDecline(invitation)}
                                className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl items-center"
                            >
                                <Text className="font-uber-bold text-sm text-accent-gray dark:text-zinc-400">Decline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleAccept(invitation)}
                                className="flex-1 py-3 bg-primary rounded-xl items-center"
                            >
                                <Text className="font-uber-bold text-sm text-secondary">Accept Join Request</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <View className="flex-row items-center px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-10 w-10 items-center justify-center"
                >
                    <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-lg font-uber-bold dark:text-white">Invitations</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6 pb-20">
                    {invitations.length > 0 ? (
                        <>
                            {activeInvitations.length > 0 && (
                                <>
                                    <Text className="text-[10px] font-uber-bold text-accent-gray dark:text-zinc-500 mb-2 mt-8 uppercase tracking-widest">
                                        Active
                                    </Text>
                                    {activeInvitations.map(renderInvitation)}
                                </>
                            )}

                            {expiredInvitations.length > 0 && (
                                <>
                                    <Text className="text-[10px] font-uber-bold text-accent-gray dark:text-zinc-500 mb-2 mt-12 uppercase tracking-widest">
                                        Expired
                                    </Text>
                                    {expiredInvitations.map(renderInvitation)}
                                </>
                            )}
                        </>
                    ) : (
                        <View className="items-center py-20">
                            <View className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl items-center justify-center mb-4">
                                <Ionicons name="mail-outline" size={30} color="#adadad" />
                            </View>
                            <Text className="text-lg font-uber-bold dark:text-white mb-1">No invitations</Text>
                            <Text className="text-xs font-uber text-accent-gray dark:text-zinc-500 text-center mb-10 px-10">
                                You haven't received any invitations to join a work profile yet.
                            </Text>
                            <Button
                                label="Back to Settings"
                                onPress={() => router.push("/account/company" as any)}
                                className="w-48"
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

