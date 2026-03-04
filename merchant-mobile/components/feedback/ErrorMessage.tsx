import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Text } from '../ui/Text';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';

export interface ErrorMessageProps {
    message: string;
    style?: ViewStyle;
}

export const ErrorMessage = ({
    message,
    style,
}: ErrorMessageProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    return (
        <View style={[styles.container, style]}>
            <AlertCircle size={14} color={colors.error} />
            <Text variant="bodySmall" style={[styles.text, { color: colors.error }]}>
                {message}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.xs,
    },
    text: {
        marginLeft: Spacing.xs,
        fontWeight: '500',
    },
});
