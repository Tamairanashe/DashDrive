import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui/Button";
import { Card } from "../../src/components/ui/Card";

export default function SchoolRunScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [students, setStudents] = useState([
        { id: '1', name: 'Zoe Chit', age: 8, school: 'St. Andrews Primary', grade: 'Grade 3' },
        { id: '2', name: 'Ethan Chit', age: 11, school: 'St. Andrews Primary', grade: 'Grade 6' },
    ]);

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full">
                    <Ionicons name="arrow-back" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text className="text-xl font-uber-bold dark:text-white">School Run</Text>
                <TouchableOpacity onPress={() => router.push("/school-run/add-student" as any)} className="h-10 w-10 items-center justify-center bg-primary rounded-full">
                    <Ionicons name="add" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
                {/* Hero Banner */}
                <Card className="bg-primary/10 border-primary/20 p-6 mb-8 rounded-[32px]">
                    <View className="flex-row items-center">
                        <View className="flex-1">
                            <Text className="text-primary font-uber-bold text-2xl mb-2">Safe & Reliable</Text>
                            <Text className="text-secondary/60 dark:text-white/60 font-uber-medium">Schedule daily commutes for your little ones with vetted drivers.</Text>
                        </View>
                    </View>
                </Card>

                <Text className="text-secondary dark:text-white font-uber-bold text-xl mb-4">My Students</Text>
                
                {students.map((student) => (
                    <TouchableOpacity key={student.id} onPress={() => router.push(`/school-run/subscription/${student.id}` as any)}>
                        <Card className="mb-4 p-5 flex-row items-center">
                            <View className="h-14 w-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl items-center justify-center mr-4">
                                <Ionicons name="school" size={28} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            </View>
                            <View className="flex-1">
                                <Text className="font-uber-bold text-lg dark:text-white">{student.name}</Text>
                                <Text className="text-zinc-500 font-uber-medium text-sm">{student.school} • {student.grade}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#adadad" />
                        </Card>
                    </TouchableOpacity>
                ))}

                {students.length === 0 && (
                    <View className="py-20 items-center justify-center">
                        <Ionicons name="people-outline" size={64} color="#adadad" />
                        <Text className="text-zinc-500 font-uber-medium mt-4">No students added yet.</Text>
                        <Button 
                            label="Add first student" 
                            onPress={() => router.push("/school-run/add-student" as any)}
                            className="mt-6 w-full"
                        />
                    </View>
                )}

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
