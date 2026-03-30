import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, G, Text as SvgText, Circle, Line } from 'react-native-svg';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { Text } from '../ui/Text';
import { Card } from '../data/Card';

export interface ChartData {
    label: string;
    value: number;
}

export interface OrdersChartProps {
    data: ChartData[];
    title?: string;
    height?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const OrdersChart = ({
    data,
    title = 'Order Trends',
    height = 200,
}: OrdersChartProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const chartWidth = SCREEN_WIDTH - Spacing.lg * 4;
    const chartHeight = height - 60;
    const maxValue = Math.max(...data.map(d => d.value), 10);

    const points = data.map((item, index) => {
        const x = (index / (data.length - 1)) * chartWidth;
        const y = chartHeight - (item.value / maxValue) * chartHeight;
        return `${x},${y}`;
    });

    const pathContent = `M ${points.join(' L ')}`;

    return (
        <Card>
            {title && (
                <Text variant="title3" style={styles.title}>
                    {title}
                </Text>
            )}
            <View style={{ height }}>
                <Svg width={chartWidth} height={height}>
                    <G y={0}>
                        {/* Simple Line Path */}
                        <Path
                            d={pathContent}
                            fill="none"
                            stroke={colors.primary}
                            strokeWidth="3"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />

                        {data.map((item, index) => {
                            const x = (index / (data.length - 1)) * chartWidth;
                            const y = chartHeight - (item.value / maxValue) * chartHeight;

                            return (
                                <G key={index}>
                                    <Circle
                                        cx={x}
                                        cy={y}
                                        r="4"
                                        fill="#FFFFFF"
                                        stroke={colors.primary}
                                        strokeWidth="2"
                                    />
                                    <SvgText
                                        x={x}
                                        y={chartHeight + 20}
                                        fontSize="10"
                                        fill={colors.tabIconDefault}
                                        textAnchor="middle"
                                    >
                                        {item.label}
                                    </SvgText>
                                </G>
                            );
                        })}
                    </G>
                </Svg>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    title: {
        marginBottom: Spacing.lg,
        fontWeight: '700',
    },
});
