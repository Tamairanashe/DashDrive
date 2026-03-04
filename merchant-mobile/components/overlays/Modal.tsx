import React from 'react';
import {
    Modal as RNModal,
    StyleSheet,
    View,
    TouchableOpacity,
    ViewStyle,
    Dimensions,
    Platform
} from 'react-native';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { Radius } from '../../constants/Radius';
import { Shadows } from '../../constants/Shadows';
import { Text } from '../ui/Text';
import { IconButton } from '../ui/IconButton';
import { X } from 'lucide-react-native';

export interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'full';
    style?: ViewStyle;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const Modal = ({
    visible,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    style,
}: ModalProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const getWidth = () => {
        switch (size) {
            case 'sm': return SCREEN_WIDTH * 0.7;
            case 'md': return SCREEN_WIDTH * 0.85;
            case 'lg': return SCREEN_WIDTH * 0.92;
            case 'full': return SCREEN_WIDTH;
            default: return SCREEN_WIDTH * 0.85;
        }
    };

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={[
                        styles.content,
                        {
                            backgroundColor: colors.card,
                            width: getWidth(),
                            maxHeight: '80%',
                        },
                        style
                    ]}
                >
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            {title && (
                                <Text variant="title3" style={{ color: colors.text }}>
                                    {title}
                                </Text>
                            )}
                        </View>
                        <IconButton
                            icon={<X size={20} color={colors.text} />}
                            onPress={onClose}
                            variant="ghost"
                            size="sm"
                        />
                    </View>

                    <View style={styles.body}>
                        {children}
                    </View>

                    {footer && (
                        <View style={[styles.footer, { borderTopColor: colors.border }]}>
                            {footer}
                        </View>
                    )}
                </TouchableOpacity>
            </TouchableOpacity>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        borderRadius: Radius.lg,
        overflow: 'hidden',
        ...Shadows.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.sm,
    },
    titleContainer: {
        flex: 1,
    },
    body: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.lg,
    },
    footer: {
        padding: Spacing.lg,
        borderTopWidth: 1,
    },
});
