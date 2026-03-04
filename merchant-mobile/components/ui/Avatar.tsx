import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';
import { Text } from './Text';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Radius } from '../../constants/Radius';

export interface AvatarProps {
    source?: ImageSourcePropType;
    name?: string;
    size?: number;
    rounded?: boolean;
    style?: ViewStyle;
}

export const Avatar = ({
    source,
    name,
    size = 40,
    rounded = true,
    style,
}: AvatarProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const getInitials = (str?: string) => {
        if (!str) return '';
        const parts = str.split(' ');
        if (parts.length > 1) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    const renderContent = () => {
        if (source) {
            return (
                <Image
                    source={source}
                    style={{ width: size, height: size, borderRadius: rounded ? size / 2 : Radius.sm }}
                />
            );
        }

        return (
            <View
                style={[
                    styles.placeholder,
                    {
                        backgroundColor: colors.primary + '20',
                        width: size,
                        height: size,
                        borderRadius: rounded ? size / 2 : Radius.sm
                    },
                ]}
            >
                <Text
                    variant="bodyMedium"
                    style={{ color: colors.primary, fontWeight: '700', fontSize: size * 0.4 }}
                >
                    {getInitials(name)}
                </Text>
            </View>
        );
    };

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
