import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { Text } from '../../components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleRegister = async () => {
        console.log('--- CALLING handleRegister ---');
        if (!email || !password || !name) {
            setError('All fields are required');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            console.log('--- Register Attempt ---');
            console.log('Email:', email);

            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: 'dashfoodmobile://home',
                    data: {
                        full_name: name,
                    }
                }
            });

            console.log('Supabase Response Data:', data);
            if (authError) {
                console.error('Supabase Auth Error:', authError);
                throw authError;
            }

            setError('Verification link sent! 📧 Check your email inbox to confirm your account.');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#00ff90" />
                        <Text style={styles.backText}>Back to Login</Text>
                    </Pressable>

                    <View style={styles.header}>
                        <Text style={styles.title}>Request Access</Text>
                        <Text style={styles.subtitle}>Join the DashFood Enterprise network</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor="#48484A"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Work Email"
                                placeholderTextColor="#48484A"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Create Password"
                                placeholderTextColor="#48484A"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        {error && <Text style={[styles.errorText, error.includes('sent') && { color: '#00ff90' }]}>{error}</Text>}

                        <Pressable
                            style={[styles.registerButton, loading && styles.disabledButton]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#000000" />
                            ) : (
                                <Text style={styles.registerButtonText}>Submit Request</Text>
                            )}
                        </Pressable>
                    </View>

                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle-outline" size={20} color="#00ff90" />
                        <Text style={styles.infoText}>
                            Access is subject to verification. Our enterprise team will contact you within 24 hours.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 32,
        paddingTop: 20,
        paddingBottom: 40,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    backText: {
        color: '#00ff90',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 4,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        fontWeight: '500',
        marginTop: 8,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 60,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    registerButton: {
        backgroundColor: '#00ff90',
        height: 60,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        shadowColor: '#00ff90',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    disabledButton: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: '700',
    },
    errorText: {
        color: '#FF453A',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 255, 144, 0.05)',
        padding: 16,
        borderRadius: 16,
        marginTop: 40,
        alignItems: 'flex-start',
    },
    infoText: {
        color: '#00ff90',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 12,
        flex: 1,
        lineHeight: 18,
    },
});
