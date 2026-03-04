import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../data/Card';
import { Text } from '../ui/Text';
import { Row } from '../layout/Row';
import { Button } from '../ui/Button';
import { Wallet, ArrowUpRight, Plus } from 'lucide-react-native';
import { useColorScheme } from '../useColorScheme';
import Colors from '../../constants/Colors';
import { Spacing } from '../../constants/Spacing';

export interface WalletBalanceCardProps {
    balance: string;
    onWithdraw?: () => void;
    onTopUp?: () => void;
}

export const WalletBalanceCard = ({
    balance,
    onWithdraw,
    onTopUp,
}: WalletBalanceCardProps) => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    const colors = Colors[theme];

    return (
        <Card style={styles.card} padding="lg" shadow="md">
            <Row justify="space-between" align="center">
                <View>
                    <Text variant="caption" color="tabIconDefault" style={styles.label}>
                        Total Balance
                    </Text>
                    <Text variant="header" style={styles.balance}>
                        {balance}
                    </Text>
                </View>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                    <Wallet size={24} color={colors.primary} />
                </View>
            </Row>

            <Row style={styles.actions} gap="md">
                <Button
                    label="Withdraw"
                    variant="primary"
                    size="sm"
                    onPress={onWithdraw}
                    style={styles.actionButton}
                    icon={<ArrowUpRight size={16} color="#FFFFFF" />}
                />
                <Button
                    label="Top Up"
                    variant="secondary"
                    size="sm"
                    onPress={onTopUp}
                    style={styles.actionButton}
                    icon={<Plus size={16} color={colors.text} />}
                />
            </Row>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1E293B', // Darker theme for the wallet card to make it pop
    },
    label: {
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.xs,
    },
    balance: {
        fontWeight: '800',
        color: '#FFFFFF',
    },
    iconContainer: {
        padding: Spacing.md,
        borderRadius: 16,
    },
    actions: {
        marginTop: Spacing.xl,
    },
    actionButton: {
        flex: 1,
    },
});
