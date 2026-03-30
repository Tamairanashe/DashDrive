import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { supabase } from '../lib/supabase';
import { Lock, Mail, ChevronRight, LayoutDashboard } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LayoutDashboard size={48} color="#00FF90" />
          </View>
          <Text style={styles.title}>DashDrive</Text>
          <Text style={styles.subtitle}>Admin Console</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Admin Email"
              placeholderTextColor="#48484A"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock size={20} color="#8E8E93" style={styles.inputIcon} />
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

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <>
                <Text style={styles.buttonText}>Authorize Access</Text>
                <ChevronRight size={20} color="#000000" />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Secure Enterprise Environment</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#00FF90',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    height: 64,
    paddingHorizontal: 16,
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
  button: {
    backgroundColor: '#00FF90',
    height: 64,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: '#FF453A',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    marginTop: 48,
    alignItems: 'center',
  },
  footerText: {
    color: '#3A3A3C',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
