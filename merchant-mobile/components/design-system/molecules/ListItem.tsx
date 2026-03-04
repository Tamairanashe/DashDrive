import React from 'react';
import { TouchableOpacity, View, StyleSheet, useColorScheme } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Body, Caption } from '../atoms/Typography';
import Colors from '@/constants/Colors';

interface ListItemProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showChevron?: boolean;
    disabled?: boolean;
}

export const ListItem = ({
    title,
    subtitle,
    icon,
    onPress,
    rightElement,
    showChevron = false,
    disabled = false,
}: ListItemProps) => {
    const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
    const themeColors = Colors[colorScheme];

    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
            style={[
                styles.container,
                { backgroundColor: themeColors.card, borderColor: themeColors.border },
                disabled && { opacity: 0.5 },
            ]}
        >
            <View style={styles.leftContent}>
                {icon && <View style={styles.iconWrapper}>{icon}</View>}
                <View style={styles.textWrapper}>
                    <Body style={styles.title}>{title}</Body>
                    {subtitle && <Caption style={styles.subtitle}>{subtitle}</Caption>}
                </View>
            </View>

            <View style={styles.rightContent}>
                {rightElement}
                {showChevron && <ChevronRight size={20} color="#64748B" />}
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        marginBottom: 8,
        borderWidth: 1,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'transparent',
    },
    iconWrapper: {
        marginRight: 16,
        backgroundColor: 'transparent',
    },
    textWrapper: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    title: {
        fontWeight: '600',
    },
    subtitle: {
        marginTop: 2,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        gap: 8,
    },
});
