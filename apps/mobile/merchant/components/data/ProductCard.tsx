import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { Card } from './Card';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { Row } from '../layout/Row';
import { Stack } from '../layout/Stack';
import { IconButton } from '../ui/IconButton';
import { Spacing } from '../../constants/Spacing';
import { Radius } from '../../constants/Radius';
import { MoreVertical, Edit2 } from 'lucide-react-native';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';

export interface ProductCardProps {
    id: string;
    name: string;
    price: string;
    stock: number;
    image?: ImageSourcePropType;
    isActive?: boolean;
    onEdit?: () => void;
    onPress?: () => void;
}

export const ProductCard = ({
    id,
    name,
    price,
    stock,
    image,
    isActive = true,
    onEdit,
    onPress,
}: ProductCardProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const isLowStock = stock < 10 && stock > 0;
    const isOutOfStock = stock === 0;

    return (
        <Card onPress={onPress} style={styles.card} padding="none">
            <Row align="stretch">
                <View style={styles.imageContainer}>
                    {image ? (
                        <Image source={image} style={styles.image} />
                    ) : (
                        <View style={[styles.placeholder, { backgroundColor: colors.border }]} />
                    )}
                </View>

                <Stack style={styles.content} justify="space-between">
                    <Row justify="space-between" align="flex-start">
                        <Stack gap="xxs" style={{ flex: 1 }}>
                            <Text variant="bodyLarge" style={styles.name} numberOfLines={1}>
                                {name}
                            </Text>
                            <Text variant="title3" color="primary">
                                {price}
                            </Text>
                        </Stack>
                        <IconButton
                            icon={<Edit2 size={18} color={colors.tabIconDefault} />}
                            onPress={onEdit}
                            size="sm"
                        />
                    </Row>

                    <Row justify="space-between" align="center">
                        <Row gap="xs">
                            <Badge
                                label={isOutOfStock ? 'Out of Stock' : (isLowStock ? 'Low Stock' : `${stock} in stock`)}
                                variant={isOutOfStock ? 'error' : (isLowStock ? 'warning' : 'gray')}
                                size="sm"
                            />
                            {!isActive && (
                                <Badge label="Hidden" variant="gray" size="sm" outline />
                            )}
                        </Row>
                    </Row>
                </Stack>
            </Row>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: Spacing.md,
        overflow: 'hidden',
    },
    imageContainer: {
        width: 100,
        height: 100,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
        padding: Spacing.md,
    },
    name: {
        fontWeight: '600',
    },
});
