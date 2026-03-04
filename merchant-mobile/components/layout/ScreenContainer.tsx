import React from 'react';
import { View, StyleSheet, ViewStyle, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { Text } from '../ui/Text';

export interface ScreenContainerProps {
    children: React.ReactNode;
    title?: string;
    scrollable?: boolean;
    withPadding?: boolean;
    style?: ViewStyle;
}

export const ScreenContainer = ({
    children,
    title,
    scrollable = true,
    withPadding = true,
    style,
}: ScreenContainerProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const content = (
        <View
            style={[
                styles.content,
                withPadding && styles.padded,
                style
            ]}
        >
            {title && (
                <Text variant="header" style={styles.title}>
                    {title}
                </Text>
            )}
            {children}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
            {scrollable ? (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {content}
                </ScrollView>
            ) : (
                content
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    padded: {
        paddingHorizontal: Spacing.lg,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: Spacing.huge,
    },
    title: {
        marginTop: Spacing.lg,
        marginBottom: Spacing.xl,
    },
});
