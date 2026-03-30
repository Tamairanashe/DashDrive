import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";
import { useSavedPlacesStore } from "../../src/lib/store";

interface Destination {
    id: string;
    name: string;
    address: string;
    icon: string;
}

interface Member {
    id: string;
    name: string;
    email: string;
    role: "admin" | "member";
    status: "active" | "pending";
    isOwner?: boolean;
    invitedBy?: string;
    dateInvited?: string;
}

interface PaymentMethod {
    id: string;
    type: "visa" | "mastercard" | "amex";
    last4: string;
    isDefault: boolean;
}

interface Report {
    id: string;
    month: string;
    rides: number;
    amount: string;
    date: string;
}

interface CompanyAccount {
    name: string;
    email: string;
    vatNumber?: string;
    isActive: boolean;
}

const INITIAL_COMPANY: CompanyAccount = {
    name: "Acme Corporation",
    email: "billing@acme.com",
    vatNumber: "GB123456789",
    isActive: true,
};

const INITIAL_DESTINATIONS: Destination[] = [
    { id: "1", name: "Headquarters", address: "123 Business Park, London EC1A 1BB", icon: "business" },
    { id: "2", name: "Airport Pickup", address: "Heathrow Airport, Terminal 5", icon: "airplane" },
    { id: "3", name: "Client Office", address: "45 Tech Street, Manchester M1 2AB", icon: "briefcase" },
];

const INITIAL_MEMBERS: Member[] = [
    { id: "1", name: "Bruce M.", email: "bruce@acme.com", role: "admin", status: "active", isOwner: true },
    { id: "2", name: "Sarah Johnson", email: "sarah.j@acme.com", role: "admin", status: "active", invitedBy: "Bruce M.", dateInvited: "Jan 12, 2026" },
    { id: "3", name: "Mike Chen", email: "mike.c@acme.com", role: "member", status: "pending", invitedBy: "Sarah Johnson", dateInvited: "Feb 05, 2026" },
];

const INITIAL_PAYMENTS: PaymentMethod[] = [
    { id: "p1", type: "visa", last4: "4242", isDefault: true },
];

const REPORTS: Report[] = [
    { id: "r1", month: "January 2026", rides: 24, amount: "£342.50", date: "Feb 01, 2026" },
    { id: "r2", month: "December 2025", rides: 18, amount: "£215.20", date: "Jan 01, 2026" },
];

export default function CompanyProfileScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const { hasCompanyProfile, setHasCompanyProfile } = useSavedPlacesStore();
    const [company, setCompany] = useState<CompanyAccount | null>(hasCompanyProfile ? INITIAL_COMPANY : null);
    const [destinations, setDestinations] = useState<Destination[]>(hasCompanyProfile ? INITIAL_DESTINATIONS : []);
    const [members, setMembers] = useState<Member[]>(hasCompanyProfile ? INITIAL_MEMBERS : []);

    // Simulate current user (Bruce M. is Owner, Sarah J. is Admin)
    const currentUser = members[0]; // Bruce M.
    const isOwner = currentUser?.isOwner;
    const isAdmin = currentUser?.role === "admin";

    const [showSetup, setShowSetup] = useState(false);
    const [isLanding, setIsLanding] = useState(true);
    const [showAddDestination, setShowAddDestination] = useState(false);

    // Setup form
    const [companyName, setCompanyName] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [vatNumber, setVatNumber] = useState("");

    // Destination form
    const [destName, setDestName] = useState("");
    const [destAddress, setDestAddress] = useState("");

    const handleSetupCompany = () => {
        if (!isOwner) {
            Alert.alert("Permission Denied", "Only the company owner can edit billing details.");
            return;
        }
        setCompany({
            name: companyName,
            email: companyEmail,
            vatNumber: vatNumber || undefined,
            isActive: true,
        });
        setHasCompanyProfile(true);
        setShowSetup(false);
        setCompanyName("");
        setCompanyEmail("");
        setVatNumber("");
    };

    const handleAddDestination = () => {
        if (!isAdmin) return;
        const newDest: Destination = {
            id: Date.now().toString(),
            name: destName,
            address: destAddress,
            icon: "location",
        };
        setDestinations([...destinations, newDest]);
        setShowAddDestination(false);
        setDestName("");
        setDestAddress("");
    };

    const handleDeleteDestination = (dest: Destination) => {
        if (!isAdmin) return;
        Alert.alert("Delete Destination", `Remove "${dest.name}"?`, [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => setDestinations(destinations.filter(d => d.id !== dest.id)) }
        ]);
    };

    const handleDeleteCompany = () => {
        if (!isOwner) {
            Alert.alert("Permission Denied", "Only the company owner can delete the account.");
            return;
        }
        Alert.alert(
            "Delete Company Profile",
            "This will remove your company profile and all associated data. Are you sure?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        setCompany(null);
                        setDestinations([]);
                        setMembers([]);
                        setHasCompanyProfile(false);
                    }
                }
            ]
        );
    };

    // No company setup yet - show landing page or setup screen
    if (!company || showSetup) {
        if (!company && isLanding && !showSetup) {
            return (
                <SafeAreaView className="flex-1 bg-white dark:bg-black">
                    <View className="flex-row items-center px-6 py-4">
                        <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 items-center justify-center">
                            <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                        <View className="items-center px-8">
                            {/* Illustration - Optimized for one-page fit */}
                            <View className="w-full aspect-[16/9] items-center justify-center mb-2">
                                <Image
                                    source={require("../../assets/images/work_hero_themed.png")}
                                    style={{ width: '85%', height: '85%' }}
                                    resizeMode="contain"
                                />
                            </View>

                            <Text className="text-[24px] font-uber-bold text-secondary dark:text-white text-center leading-8 mb-1">
                                The smart choice for corporate travel
                            </Text>
                            <Text className="text-sm font-uber text-accent-gray dark:text-zinc-500 text-center mb-6">
                                Elevate your professional journey with DashDrive
                            </Text>

                            <View className="w-full gap-3 mb-8">
                                <FeatureItem label="Auto-invoice directly to your business account" />
                                <FeatureItem label="Tax-ready digital receipts delivered instantly" />
                                <FeatureItem label="Consolidated monthly statements for easy auditing" />
                                <FeatureItem label="Secure, centralized billing for all your work trips" />
                            </View>

                            <Button
                                label="Get started"
                                onPress={() => { setIsLanding(false); setShowSetup(true); }}
                                className="w-full py-4 rounded-[20px]"
                            />

                            <View className="mt-4 items-center">
                                <Text className="text-[12px] font-uber text-accent-gray dark:text-zinc-500">
                                    Scaling your team?
                                </Text>
                                <TouchableOpacity>
                                    <Text className="text-[12px] font-uber-bold text-primary mt-0.5">
                                        Discover DashDrive Enterprise Solutions
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            );
        }

        return (
            <SafeAreaView className="flex-1 bg-white dark:bg-black">
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="flex-row items-center px-6 mt-4 mb-6">
                        <TouchableOpacity
                            onPress={() => {
                                if (company) {
                                    setShowSetup(false);
                                } else {
                                    setIsLanding(true);
                                    setShowSetup(false);
                                }
                            }}
                            className="h-10 w-10 items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full"
                        >
                            <Ionicons name="arrow-back" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                        </TouchableOpacity>
                        <Text className="flex-1 text-center text-xl font-uber-bold dark:text-white">
                            {company ? (isOwner ? "Edit Company" : "View Billing") : "Claim ride costs"}
                        </Text>
                        <View className="w-10" />
                    </View>

                    <View className="px-6">
                        {!company && (
                            <View className="items-center mb-8">
                                <View className="w-20 h-20 bg-primary/20 rounded-full items-center justify-center mb-4">
                                    <Ionicons name="briefcase" size={40} color="#00ff90" />
                                </View>
                                <Text className="text-lg font-uber-bold dark:text-white text-center mb-2">
                                    Claim your ride costs
                                </Text>
                                <Text className="text-sm font-uber text-accent-gray dark:text-zinc-400 text-center">
                                    Create a company profile to expense business trips, manage your team, and download receipts.
                                </Text>
                            </View>
                        )}

                        <View className="mb-4">
                            <Text className="text-sm font-uber-medium text-accent-gray dark:text-zinc-500 mb-2">Company Name *</Text>
                            <TextInput
                                value={companyName || (company?.name || "")}
                                onChangeText={setCompanyName}
                                editable={isOwner || !company}
                                placeholder="Enter company name"
                                placeholderTextColor="#71717a"
                                className={`bg-zinc-50 dark:bg-zinc-900 px-4 py-4 rounded-2xl font-uber text-base border border-zinc-100 dark:border-zinc-800 text-secondary dark:text-white ${(isOwner || !company) ? "" : "opacity-60"}`}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-uber-medium text-accent-gray dark:text-zinc-500 mb-2">Billing Email *</Text>
                            <TextInput
                                value={companyEmail || (company?.email || "")}
                                onChangeText={setCompanyEmail}
                                editable={isOwner || !company}
                                placeholder="billing@company.com"
                                placeholderTextColor="#71717a"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className={`bg-zinc-50 dark:bg-zinc-900 px-4 py-4 rounded-2xl font-uber text-base border border-zinc-100 dark:border-zinc-800 text-secondary dark:text-white ${(isOwner || !company) ? "" : "opacity-60"}`}
                            />
                        </View>

                        <View className="mb-8">
                            <Text className="text-sm font-uber-medium text-accent-gray dark:text-zinc-500 mb-2">VAT Number (optional)</Text>
                            <TextInput
                                value={vatNumber || (company?.vatNumber || "")}
                                onChangeText={setVatNumber}
                                editable={isOwner || !company}
                                placeholder="GB123456789"
                                placeholderTextColor="#71717a"
                                autoCapitalize="characters"
                                className={`bg-zinc-50 dark:bg-zinc-900 px-4 py-4 rounded-2xl font-uber text-base border border-zinc-100 dark:border-zinc-800 text-secondary dark:text-white ${(isOwner || !company) ? "" : "opacity-60"}`}
                            />
                        </View>

                        {(isOwner || !company) ? (
                            <Button
                                label={company ? "Update Company" : "Create Company Profile"}
                                onPress={handleSetupCompany}
                                disabled={!(companyName || company?.name) || !(companyEmail || company?.email)}
                            />
                        ) : (
                            <View className="flex-row items-center justify-center p-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
                                <Ionicons name="lock-closed" size={16} color="#adadad" />
                                <Text className="ml-2 text-sm font-uber text-accent-gray dark:text-zinc-500">Only the Owner can edit billing details</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <View className="flex-row items-center px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-10 w-10 items-center justify-center"
                >
                    <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-lg font-uber-bold dark:text-white">Company Profile</Text>
                <TouchableOpacity
                    onPress={() => { setCompanyName(company.name); setCompanyEmail(company.email); setVatNumber(company.vatNumber || ""); setShowSetup(true); }}
                    className="h-10 w-10 items-center justify-center"
                >
                    <Ionicons name={isOwner ? "settings-outline" : "eye-outline"} size={22} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View className="px-6 py-8 items-center border-b border-zinc-100 dark:border-zinc-800">
                    <View className="w-20 h-20 bg-primary/10 rounded-3xl items-center justify-center mb-4">
                        <Ionicons name="briefcase" size={40} color="#00ff90" />
                    </View>
                    <Text className="text-2xl font-uber-bold dark:text-white mb-1">{company.name}</Text>
                    <View className={`px-3 py-1 rounded-full flex-row items-center ${isOwner ? "bg-primary/20" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                        <Text className={`text-[10px] font-uber-bold uppercase tracking-wider ${isOwner ? "text-primary" : "text-accent-gray dark:text-zinc-400"}`}>
                            {isOwner ? "Profile Owner" : isAdmin ? "Administrator" : "Team Member"}
                        </Text>
                    </View>
                </View>

                {/* Settings Sections */}
                <View className="px-6 pb-12">
                    <Text className="text-[10px] font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest mt-8 mb-2">Management</Text>

                    <SettingsItem
                        icon="people"
                        label="Team Members"
                        sublabel={`${members.length} members • ${members.filter(m => m.status === 'active').length} active`}
                        onPress={() => router.push({ pathname: "/account/company-members", params: { companyName: company.name } } as any)}
                    />

                    <SettingsItem
                        icon="mail"
                        label="Invitations"
                        sublabel="Manage active and pending invites"
                        onPress={() => router.push("/account/company-invitations" as any)}
                        rightElement={
                            <View className="bg-primary px-2 py-0.5 rounded-full">
                                <Text className="text-[10px] font-uber-bold text-secondary">3</Text>
                            </View>
                        }
                    />

                    <Text className="text-[10px] font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest mt-10 mb-2">Billing & Tax</Text>

                    {isOwner && (
                        <SettingsItem
                            icon="card"
                            label="Payment Method"
                            sublabel={`${INITIAL_PAYMENTS[0].type.toUpperCase()} •••• ${INITIAL_PAYMENTS[0].last4}`}
                            onPress={() => { }}
                        />
                    )}

                    <SettingsItem
                        icon="document-text"
                        label="Monthly Reports"
                        sublabel="Download ride summaries and receipts"
                        onPress={() => { }}
                    />

                    <SettingsItem
                        icon="information-circle"
                        label="Company Details"
                        sublabel={`${company.email}${company.vatNumber ? ` • ${company.vatNumber}` : ''}`}
                        onPress={() => { setCompanyName(company.name); setCompanyEmail(company.email); setVatNumber(company.vatNumber || ""); setShowSetup(true); }}
                    />

                    <Text className="text-[10px] font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest mt-10 mb-2">Fleet & Locations</Text>

                    <SettingsItem
                        icon="location"
                        label="Company Places"
                        sublabel={`${destinations.length} saved destinations`}
                        onPress={() => setShowAddDestination(true)}
                    />

                    {/* Pre-booked destinations inline list if simple enough, or just keep as subpage if complex. 
                        Let's show them as a mini-list here for easy access. */}
                    {destinations.length > 0 && (
                        <View className="mt-2 pl-12">
                            {destinations.map((dest) => (
                                <View key={dest.id} className="py-2 flex-row items-center border-b border-zinc-50 dark:border-zinc-900 last:border-0">
                                    <View className="flex-1">
                                        <Text className="text-sm font-uber-medium dark:text-white">{dest.name}</Text>
                                        <Text className="text-[10px] text-accent-gray dark:text-zinc-500">{dest.address}</Text>
                                    </View>
                                    {isAdmin && (
                                        <TouchableOpacity onPress={() => handleDeleteDestination(dest)} className="p-2">
                                            <Ionicons name="trash-outline" size={16} color="#ef4444" opacity={0.5} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    {showAddDestination && (
                        <View className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 mt-4 border border-zinc-100 dark:border-zinc-800">
                            <TextInput
                                value={destName}
                                onChangeText={setDestName}
                                placeholder="Place name"
                                placeholderTextColor="#71717a"
                                className="bg-white dark:bg-zinc-800 px-4 py-3 rounded-xl font-uber text-base border border-zinc-100 dark:border-zinc-700 text-secondary dark:text-white mb-3"
                            />
                            <TextInput
                                value={destAddress}
                                onChangeText={setDestAddress}
                                placeholder="Full address"
                                placeholderTextColor="#71717a"
                                className="bg-white dark:bg-zinc-800 px-4 py-3 rounded-xl font-uber text-base border border-zinc-100 dark:border-zinc-700 text-secondary dark:text-white mb-3"
                            />
                            <View className="flex-row gap-2">
                                <TouchableOpacity
                                    onPress={() => { setShowAddDestination(false); setDestName(""); setDestAddress(""); }}
                                    className="flex-1 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl items-center"
                                >
                                    <Text className="font-uber-bold text-accent-gray dark:text-zinc-400">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleAddDestination}
                                    disabled={!destName || !destAddress}
                                    className={`flex-1 py-3 rounded-xl items-center ${destName && destAddress ? 'bg-primary' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                                >
                                    <Text className={`font-uber-bold ${destName && destAddress ? 'text-secondary' : 'text-accent-gray'}`}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Danger Zone */}
                    {isOwner && (
                        <>
                            <Text className="text-[10px] font-uber-bold text-accent-gray dark:text-zinc-500 uppercase tracking-widest mt-10 mb-2">Account Actions</Text>
                            <SettingsItem
                                icon="trash"
                                label="Delete Company Profile"
                                sublabel="Permanently remove all data"
                                isDestructive={true}
                                showChevron={false}
                                onPress={handleDeleteCompany}
                            />
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function FeatureItem({ label }: { label: string }) {
    return (
        <View className="flex-row items-start mb-4">
            <View className="w-5 h-5 bg-primary rounded-full items-center justify-center mt-1">
                <Ionicons name="checkmark" size={14} color="black" />
            </View>
            <Text className="ml-4 flex-1 text-base font-uber text-secondary dark:text-zinc-300 leading-6">
                {label}
            </Text>
        </View>
    );
}

const SettingsItem = ({ icon, label, sublabel, onPress, rightElement, showChevron = true, isDestructive = false }: any) => {
    const { colorScheme } = useColorScheme();
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-row items-center py-4 border-b border-zinc-100 dark:border-zinc-800 ${isDestructive ? "" : ""}`}
        >
            <View className={`w-10 h-10 items-center justify-center rounded-xl mr-3 ${isDestructive ? "bg-red-50 dark:bg-red-900/10" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                <Ionicons name={icon} size={20} color={isDestructive ? "#ef4444" : (colorScheme === 'dark' ? '#fff' : '#18181b')} />
            </View>
            <View className="flex-1">
                <Text className={`font-uber-medium text-base ${isDestructive ? "text-red-500" : "dark:text-white"}`}>{label}</Text>
                {sublabel && <Text className="text-xs text-accent-gray dark:text-zinc-500 font-uber">{sublabel}</Text>}
            </View>
            {rightElement}
            {showChevron && !rightElement && <Ionicons name="chevron-forward" size={18} color="#adadad" />}
        </TouchableOpacity>
    );
};
