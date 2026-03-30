import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { Text } from '../ui/Text';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';

export type StepStatus = 'pending' | 'preparing' | 'ready' | 'delivered';

export interface OrderStatusStepperProps {
    currentStatus: StepStatus;
}

const STEPS: { key: StepStatus; label: string }[] = [
    { key: 'pending', label: 'Pending' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'delivered', label: 'Delivered' },
];

export const OrderStatusStepper = ({
    currentStatus,
}: OrderStatusStepperProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    const currentIndex = STEPS.findIndex(s => s.key === currentStatus);

    return (
        <View style={styles.container}>
            {STEPS.map((step, index) => {
                const isCompleted = index < currentIndex;
                const isActive = index === currentIndex;
                const isLast = index === STEPS.length - 1;

                return (
                    <View key={step.key} style={styles.stepWrapper}>
                        <View style={styles.stepContainer}>
                            <View
                                style={[
                                    styles.circle,
                                    {
                                        backgroundColor: isCompleted || isActive ? colors.primary : colors.border,
                                        borderColor: colors.primary,
                                    },
                                    isActive && styles.activeCircle
                                ]}
                            >
                                {isCompleted ? (
                                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                                ) : (
                                    <Text variant="bodySmall" style={{ color: isActive ? '#FFFFFF' : colors.tabIconDefault, fontWeight: '700' }}>
                                        {index + 1}
                                    </Text>
                                )}
                            </View>

                            {!isLast && (
                                <View
                                    style={[
                                        styles.line,
                                        { backgroundColor: isCompleted ? colors.primary : colors.border }
                                    ]}
                                />
                            )}
                        </View>
                        <Text
                            variant="caption"
                            style={[
                                styles.label,
                                { color: isActive ? colors.primary : colors.text, fontWeight: isActive ? '700' : '500' }
                            ]}
                        >
                            {step.label}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
    },
    stepWrapper: {
        alignItems: 'center',
        flex: 1,
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    circle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    activeCircle: {
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    line: {
        flex: 1,
        height: 2,
        marginHorizontal: -14,
        zIndex: 0,
    },
    label: {
        marginTop: Spacing.xs,
        textAlign: 'center',
    },
});
