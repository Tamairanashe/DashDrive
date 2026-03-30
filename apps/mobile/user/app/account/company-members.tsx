import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";

interface Member {
    id: string;
    name: string;
    email: string;
    role: "admin" | "member";
    status: "active" | "pending";
    isOwner?: boolean;
    avatar?: string;
    invitedBy?: string;
    dateInvited?: string;
}

const INITIAL_MEMBERS: Member[] = [
    { id: "1", name: "Bruce M.", email: "bruce@acme.com", role: "admin", status: "active", isOwner: true },
    { id: "2", name: "Sarah Johnson", email: "sarah.j@acme.com", role: "admin", status: "active", invitedBy: "Bruce M.", dateInvited: "Jan 12, 2026" },
    { id: "3", name: "Mike Chen", email: "mike.c@acme.com", role: "member", status: "pending", invitedBy: "Sarah Johnson", dateInvited: "Feb 05, 2026" },
];

export default function CompanyMembersScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const { companyName } = useLocalSearchParams();
    const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);

    // Simulate current user (Bruce M. is Owner)
    const currentUser = members[0];
    const isOwner = currentUser?.isOwner;
    const isAdmin = currentUser?.role === "admin";

    const [showInvite, setShowInvite] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");

    const handleInvite = () => {
        if (!isAdmin) {
            Alert.alert("Permission Denied", "Only Admins can invite new members.");
            return;
        }
        if (!inviteEmail.includes("@")) return;

        const newMember: Member = {
            id: Date.now().toString(),
            name: inviteEmail.split("@")[0],
            email: inviteEmail,
            role: inviteRole,
            status: "pending",
        };
        setMembers([...members, newMember]);
        setInviteEmail("");
        setShowInvite(false);
        Alert.alert("Invitation Sent", `An invitation has been sent to ${inviteEmail}`);
    };

    const handleRemove = (member: Member) => {
        // Validation: Only Owner can remove Admins. Admins can remove Members.
        if (member.isOwner) {
            Alert.alert("Cannot Remove Owner", "The company owner cannot be removed.");
            return;
        }
        if (!isOwner && member.role === "admin") {
            Alert.alert("Permission Denied", "Only the Superuser can remove other administrators.");
            return;
        }

        Alert.alert(
            "Remove Member",
            `Remove ${member.name} from the company?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => setMembers(members.filter((m: Member) => m.id !== member.id))
                }
            ]
        );
    };

    const handleChangeRole = (member: Member) => {
        if (!isOwner) {
            Alert.alert("Permission Denied", "Only the Superuser can change member roles.");
            return;
        }
        if (member.isOwner) return;

        const newRole = member.role === "admin" ? "member" : "admin";
        Alert.alert(
            "Change Role",
            `Make ${member.name} ${newRole === "admin" ? "an Admin" : "a Member"}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm",
                    onPress: () => setMembers(members.map((m: Member) =>
                        m.id === member.id ? { ...m, role: newRole } : m
                    ))
                }
            ]
        );
    };

    const handleResendInvite = (member: Member) => {
        Alert.alert("Invitation Resent", `A new invitation has been sent to ${member.email}`);
    };

    const owners = members.filter((m: Member) => m.isOwner);
    const admins = members.filter((m: Member) => m.role === "admin" && !m.isOwner);
    const regularMembers = members.filter((m: Member) => m.role === "member");

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <View className="flex-row items-center px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-10 w-10 items-center justify-center"
                >
                    <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                </TouchableOpacity>
                <View className="flex-1 mx-4">
                    <Text className="text-center text-lg font-uber-bold dark:text-white">Team Members</Text>
                    <Text className="text-center text-[10px] text-accent-gray dark:text-zinc-500 font-uber uppercase tracking-wider">{companyName || "Acme Corporation"}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => isAdmin ? setShowInvite(true) : Alert.alert("Restricted", "Only admins can invite members.")}
                    className="h-10 w-10 items-center justify-center"
                >
                    <Ionicons name="person-add-outline" size={22} color={isAdmin ? "#00ff90" : "#adadad"} />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Stats Summary */}
                <View className="flex-row px-6 py-4 border-b border-zinc-50 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/10">
                    <View className="flex-1">
                        <Text className="text-sm font-uber-bold dark:text-white">{members.length}</Text>
                        <Text className="text-[10px] text-accent-gray dark:text-zinc-500 font-uber uppercase">Total Team</Text>
                    </View>
                    <View className="flex-1 items-center border-l border-r border-zinc-100 dark:border-zinc-800">
                        <Text className="text-sm font-uber-bold dark:text-white">{members.filter((m: Member) => m.status === "active").length}</Text>
                        <Text className="text-[10px] text-accent-gray dark:text-zinc-500 font-uber uppercase">Active</Text>
                    </View>
                    <View className="flex-1 items-end">
                        <Text className="text-sm font-uber-bold text-yellow-500">{members.filter((m: Member) => m.status === "pending").length}</Text>
                        <Text className="text-[10px] text-accent-gray dark:text-zinc-500 font-uber uppercase">Pending</Text>
                    </View>
                </View>

                {/* Invite Modal Inline Improvement */}
                {showInvite && (
                    <View className="px-6 py-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="font-uber-bold dark:text-white text-base">Invite to Team</Text>
                            <TouchableOpacity onPress={() => setShowInvite(false)}>
                                <Ionicons name="close" size={22} color="#adadad" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            value={inviteEmail}
                            onChangeText={setInviteEmail}
                            placeholder="colleague@company.com"
                            placeholderTextColor="#71717a"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="bg-white dark:bg-zinc-800 px-4 py-3 rounded-xl font-uber text-base border border-zinc-100 dark:border-zinc-700 text-secondary dark:text-white mb-4"
                        />

                        <View className="flex-row gap-2 mb-6">
                            <TouchableOpacity
                                onPress={() => setInviteRole("member")}
                                className={`flex-1 py-3 rounded-xl items-center border ${inviteRole === "member" ? "bg-primary/10 border-primary" : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700"}`}
                            >
                                <Text className={`font-uber-medium text-sm ${inviteRole === "member" ? "text-primary" : "dark:text-white"}`}>Member</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => isOwner ? setInviteRole("admin") : Alert.alert("Restricted", "Only the Superuser can invite other Admins.")}
                                className={`flex-1 py-3 rounded-xl items-center border ${inviteRole === "admin" ? "bg-primary/10 border-primary" : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700"}`}
                            >
                                <Text className={`font-uber-medium text-sm ${inviteRole === "admin" ? "text-primary" : "dark:text-white"}`}>Administrator</Text>
                            </TouchableOpacity>
                        </View>

                        <Button
                            label="Send Invitation"
                            onPress={handleInvite}
                            disabled={!inviteEmail.includes("@")}
                        />
                    </View>
                )}

                <View className="px-6 pb-20">
                    {/* Simplified List Implementation */}
                    {[
                        { title: "Company Owner", data: owners },
                        { title: `Administrators (${admins.length})`, data: admins },
                        { title: `Team Members (${regularMembers.length})`, data: regularMembers }
                    ].map((section, idx) => section.data.length > 0 && (
                        <View key={idx}>
                            <Text className="text-[10px] font-uber-bold text-accent-gray dark:text-zinc-500 mb-2 mt-8 uppercase tracking-widest">
                                {section.title}
                            </Text>
                            {section.data.map((member: Member) => (
                                <MemberListItem
                                    key={member.id}
                                    member={member}
                                    colorScheme={colorScheme}
                                    onRemove={() => handleRemove(member)}
                                    onChangeRole={() => handleChangeRole(member)}
                                    onResend={() => handleResendInvite(member)}
                                    canManage={member.isOwner ? false : (member.role === 'admin' ? isOwner : isAdmin)}
                                />
                            ))}
                        </View>
                    ))}

                    {members.length === 1 && !showInvite && (
                        <View className="items-center py-20">
                            <View className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl items-center justify-center mb-4">
                                <Ionicons name="people-outline" size={30} color="#adadad" />
                            </View>
                            <Text className="text-lg font-uber-bold dark:text-white mb-1">Expand your team</Text>
                            <Text className="text-xs font-uber text-accent-gray dark:text-zinc-500 text-center mb-8 px-10">
                                Invite colleagues to share this company profile for business rides and expense tracking.
                            </Text>
                            {isAdmin && <Button label="Invite Member" onPress={() => setShowInvite(true)} className="w-48" />}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function MemberListItem({ member, colorScheme, onRemove, onChangeRole, onResend, canManage }: any) {
    const initials = member.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <View className="py-4 border-b border-zinc-100 dark:border-zinc-800">
            <View className="flex-row items-center">
                <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${member.isOwner ? "bg-primary/20" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                    <Text className={`font-uber-bold text-xs ${member.isOwner ? "text-primary" : "dark:text-white"}`}>{initials}</Text>
                </View>
                <View className="flex-1">
                    <View className="flex-row items-center">
                        <Text className="font-uber-medium text-base dark:text-white">{member.name}</Text>
                        {member.status === "pending" && (
                            <View className="ml-2 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">
                                <Text className="text-[8px] font-uber-bold text-yellow-600 dark:text-yellow-500 uppercase">Pending</Text>
                            </View>
                        )}
                    </View>
                    <Text className="text-xs text-accent-gray dark:text-zinc-500 font-uber">{member.email}</Text>
                </View>

                {canManage && (
                    <TouchableOpacity onPress={() => { }} className="p-2">
                        <Ionicons name="ellipsis-vertical" size={18} color="#adadad" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Compact Action Bar - Bolt-style context menu can be complex, so let's use a subtle inline row if managing */}
            {canManage && (
                <View className="flex-row gap-4 mt-3 ml-[52px]">
                    {member.status === "pending" && (
                        <TouchableOpacity onPress={onResend}>
                            <Text className="text-[10px] font-uber-bold text-primary uppercase">Resend</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={onChangeRole}>
                        <Text className="text-[10px] font-uber-bold text-accent-gray dark:text-zinc-500 uppercase">
                            {member.role === "admin" ? "Make Member" : "Make Admin"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onRemove}>
                        <Text className="text-[10px] font-uber-bold text-red-500 uppercase">Remove</Text>
                    </TouchableOpacity>
                </View>
            )}

            {member.invitedBy && !canManage && (
                <View className="mt-1 ml-[52px]">
                    <Text className="text-[9px] text-accent-gray dark:text-zinc-700 font-uber">
                        Joined {member.dateInvited} • Invited by {member.invitedBy}
                    </Text>
                </View>
            )}
        </View>
    );
}

