import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";

export default function AddStudentScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [school, setSchool] = useState("");
    const [grade, setGrade] = useState("");
    const [notes, setNotes] = useState("");

    const handleSave = () => {
        // Logic to save student to platform-backend
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <View className="px-6 pt-4 pb-2 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full mr-4">
                    <Ionicons name="arrow-back" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text className="text-xl font-uber-bold dark:text-white">Add Student</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                <View className="mb-6">
                    <Text className="text-sm font-uber-bold text-zinc-500 mb-2 uppercase">Full Name</Text>
                    <TextInput 
                        placeholder="e.g. Zoe Chit"
                        placeholderTextColor="#adadad"
                        value={name}
                        onChangeText={setName}
                        className="bg-zinc-100 dark:bg-zinc-900 px-5 py-4 rounded-2xl font-uber-medium dark:text-white text-lg"
                    />
                </View>

                <View className="flex-row gap-4 mb-6">
                    <View className="flex-1">
                        <Text className="text-sm font-uber-bold text-zinc-500 mb-2 uppercase">Age</Text>
                        <TextInput 
                            placeholder="8"
                            placeholderTextColor="#adadad"
                            value={age}
                            onChangeText={setAge}
                            keyboardType="numeric"
                            className="bg-zinc-100 dark:bg-zinc-900 px-5 py-4 rounded-2xl font-uber-medium dark:text-white text-lg"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-uber-bold text-zinc-500 mb-2 uppercase">Grade</Text>
                        <TextInput 
                            placeholder="Grade 3"
                            placeholderTextColor="#adadad"
                            value={grade}
                            onChangeText={setGrade}
                            className="bg-zinc-100 dark:bg-zinc-900 px-5 py-4 rounded-2xl font-uber-medium dark:text-white text-lg"
                        />
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-sm font-uber-bold text-zinc-500 mb-2 uppercase">School</Text>
                    <TouchableOpacity 
                        className="bg-zinc-100 dark:bg-zinc-900 px-5 py-4 rounded-2xl flex-row items-center justify-between"
                        onPress={() => {}} // Open school picker
                    >
                        <Text className={school ? "text-lg font-uber-medium dark:text-white" : "text-lg font-uber-medium text-zinc-400"}>
                            {school || "Select School"}
                        </Text>
                        <Ionicons name="school-outline" size={20} color="#adadad" />
                    </TouchableOpacity>
                </View>

                <View className="mb-8">
                    <Text className="text-sm font-uber-bold text-zinc-500 mb-2 uppercase">Special Instructions</Text>
                    <TextInput 
                        placeholder="Allergies, pickup rules, etc."
                        placeholderTextColor="#adadad"
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        className="bg-zinc-100 dark:bg-zinc-900 px-5 py-4 rounded-2xl font-uber-medium dark:text-white text-lg h-32"
                    />
                </View>

                <Button 
                    label="Save Student" 
                    onPress={handleSave}
                    disabled={!name || !age}
                    className="mb-10"
                />
            </ScrollView>
        </SafeAreaView>
    );
}
