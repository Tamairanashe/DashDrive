import React from 'react';
import { View, StyleSheet, Modal, useColorScheme, TouchableOpacity } from 'react-native';
import { Title, Body } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface ConfirmDialogProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'primary' | 'danger';
    loading?: boolean;
}

export const ConfirmDialog = ({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = 'primary',
    loading = false,
}: ConfirmDialogProps) => {
    const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
    const themeColors = Colors[colorScheme];

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={[styles.dialog, { backgroundColor: themeColors.card }]}>
                    {variant === 'danger' && (
                        <View style={[styles.iconContainer, { backgroundColor: themeColors.error + '15' }]}>
                            <AlertTriangle size={32} color={themeColors.error} />
                        </View>
                    )}

                    <Title style={styles.title}>{title}</Title>
                    <Body style={styles.message}>{message}</Body>

                    <View style={styles.buttonRow}>
                        <Button
                            label={cancelLabel}
                            onPress={onClose}
                            variant="secondary"
                            style={styles.button}
                            disabled={loading}
                        />
                        <Button
                            label={confirmLabel}
                            onPress={onConfirm}
                            variant={variant === 'danger' ? 'danger' : 'primary'}
                            style={styles.button}
                            loading={loading}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    dialog: {
        width: '100%',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 12,
    },
    message: {
        textAlign: 'center',
        color: '#94A3B8',
        marginBottom: 32,
        lineHeight: 22,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
        backgroundColor: 'transparent',
    },
    button: {
        flex: 1,
    },
});
