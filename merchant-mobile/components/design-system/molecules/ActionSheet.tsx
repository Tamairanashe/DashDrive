import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, useColorScheme, Animated, Pressable } from 'react-native';
import { Body, Title } from '../atoms/Typography';
import Colors from '@/constants/Colors';

interface ActionItem {
    label: string;
    onPress: () => void;
    variant?: 'default' | 'danger';
    icon?: React.ReactNode;
}

interface ActionSheetProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    actions: ActionItem[];
}

export const ActionSheet = ({ visible, onClose, title, actions }: ActionSheetProps) => {
    const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
    const themeColors = Colors[colorScheme];
    const [slideAnim] = React.useState(new Animated.Value(300));

    React.useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 8,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 300,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <Pressable style={styles.overlay} onPress={onClose}>
                <Animated.View
                    style={[
                        styles.sheet,
                        { backgroundColor: themeColors.card, transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={[styles.handle, { backgroundColor: themeColors.border }]} />
                    {title && <Title style={styles.title}>{title}</Title>}

                    <View style={styles.actionsContainer}>
                        {actions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    action.onPress();
                                    onClose();
                                }}
                                style={[
                                    styles.actionButton,
                                    { borderBottomWidth: index === actions.length - 1 ? 0 : 1, borderBottomColor: themeColors.border }
                                ]}
                            >
                                {action.icon && <View style={styles.icon}>{action.icon}</View>}
                                <Body style={{ color: action.variant === 'danger' ? themeColors.error : themeColors.text }}>
                                    {action.label}
                                </Body>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Body style={styles.cancelText}>Cancel</Body>
                    </TouchableOpacity>
                </Animated.View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 40,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    actionsContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    icon: {
        marginRight: 16,
    },
    cancelButton: {
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    cancelText: {
        fontWeight: '700',
        color: '#94A3B8',
    },
});
