import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Image, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Link } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signIn } = useAuth();
    const colorScheme = useColorScheme() ?? 'light';

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/auth/login', { email, password });
            await signIn(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <RNView style={styles.header}>
                <Image
                    source={{ uri: 'https://img.icons8.com/isometric-folders/100/10B981/delivery.png' }}
                    style={styles.logo}
                />
                <Text style={styles.title}>DashDrive Mart</Text>
                <Text style={styles.subtitle}>Partner Portal</Text>
            </RNView>

            <RNView style={styles.form}>
                <Text style={styles.welcomeText}>Welcome back, Partner</Text>

                <TextInput
                    style={[styles.input, { borderColor: Colors[colorScheme].border, color: Colors[colorScheme].text }]}
                    placeholder="Email Address"
                    placeholderTextColor="#94A3B8"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    style={[styles.input, { borderColor: Colors[colorScheme].border, color: Colors[colorScheme].text }]}
                    placeholder="Password"
                    placeholderTextColor="#94A3B8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: Colors[colorScheme].primary }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Log In</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
            </RNView>

            <RNView style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <Link href="/(auth)/register" asChild>
                    <TouchableOpacity>
                        <Text style={[styles.registerText, { color: Colors[colorScheme].primary }]}>Register</Text>
                    </TouchableOpacity>
                </Link>
            </RNView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#94A3B8',
        marginTop: 4,
    },
    form: {
        width: '100%',
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        height: 56,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
    },
    button: {
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#EF4444',
        marginBottom: 16,
        textAlign: 'center',
    },
    forgotPassword: {
        marginTop: 16,
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: '#94A3B8',
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
    },
    footerText: {
        color: '#94A3B8',
        fontSize: 14,
    },
    registerText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
