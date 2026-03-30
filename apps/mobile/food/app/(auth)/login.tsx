import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Text } from '../../components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter your credentials');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;
            // Success will be handled by the layout's auth listener
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
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="fast-food" size={80} color="#00ff90" />
                    </View>
                    <Text style={styles.title}>DashFood Manager</Text>
                    <Text style={styles.subtitle}>Enterprise Restaurant Solutions</Text>
                </View>

                <View style={styles.form}>
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
                            placeholder="Password"
                            placeholderTextColor="#48484A"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <Pressable
                        style={[styles.loginButton, loading && styles.disabledButton]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000000" />
                        ) : (
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        )}
                    </Pressable>

                    <Pressable style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </Pressable>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>New branch? </Text>
                    <Pressable onPress={() => router.push('/(auth)/register')}>
                        <Text style={styles.footerAction}>Request Access</Text>
                    </Pressable>
                </View>
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
        paddingHorizontal: 32,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoContainer: {
        width: 120,
        height: 120,
        borderRadius: 30,
        backgroundColor: '#1C1C1E',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
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
    loginButton: {
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
    loginButtonText: {
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
    forgotPassword: {
        alignItems: 'center',
        marginTop: 20,
    },
    forgotPasswordText: {
        color: '#8E8E93',
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
    },
    footerText: {
        color: '#8E8E93',
        fontSize: 15,
        fontWeight: '500',
    },
    footerAction: {
        color: '#00ff90',
        fontSize: 15,
        fontWeight: '700',
    },
});
