import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, G, Text as SvgText, Line } from 'react-native-svg';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';
import { Text } from '../ui/Text';
import { Card } from '../data/Card';

export interface ChartData {
    label: string;
    value: number;
}

export interface RevenueChartProps {
    data: ChartData[];
    title?: string;
    height?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const RevenueChart = ({
    data,
    title = 'Revenue Growth',
    height = 200,
}: RevenueChartProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const chartWidth = SCREEN_WIDTH - Spacing.lg * 4;
    const chartHeight = height - 60;
    const maxValue = Math.max(...data.map(d => d.value), 100);
    const barWidth = (chartWidth / data.length) * 0.7;
    const gap = (chartWidth / data.length) * 0.3;

    return (
        <Card>
            {title && (
                <Text variant="title3" style={styles.title}>
                    {title}
                </Text>
            )}
            <View style={{ height }}>
                <Svg width={chartWidth} height={height}>
                    <G y={chartHeight}>
                        {/* Grid Lines */}
                        {[0, 0.5, 1].map((p, i) => (
                            <Line
                                key={i}
                                x1="0"
                                y1={-p * chartHeight}
                                x2={chartWidth}
                                y2={-p * chartHeight}
                                stroke={colors.border}
                                strokeWidth="1"
                                strokeDasharray="4, 4"
                            />
                        ))}

                        {data.map((item, index) => {
                            const barHeight = (item.value / maxValue) * chartHeight;
                            const x = index * (barWidth + gap);

                            return (
                                <G key={index}>
                                    <Rect
                                        x={x}
                                        y={-barHeight}
                                        width={barWidth}
                                        height={barHeight}
                                        fill={colors.primary}
                                        rx={Radius.xs}
                                    />
                                    <SvgText
                                        x={x + barWidth / 2}
                                        y={20}
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

const Radius = { xs: 4 }; // Local constant as placeholder if needed

const styles = StyleSheet.create({
    title: {
        marginBottom: Spacing.lg,
        fontWeight: '700',
    },
});
