import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { Heading, Title, Subtitle, Body, Caption } from '@/components/design-system/atoms/Typography';
import { Button } from '@/components/design-system/atoms/Button';
import { Input } from '@/components/design-system/atoms/Input';
import { Badge, Tag } from '@/components/design-system/atoms/Badge';
import { Switch, CheckBox } from '@/components/design-system/atoms/Selection';
import { SearchBar } from '@/components/design-system/molecules/SearchBar';
import { ListItem } from '@/components/design-system/molecules/ListItem';
import { StatsGrid } from '@/components/design-system/organisms/StatsGrid';
import { ActionSheet } from '@/components/design-system/molecules/ActionSheet';
import { NotificationItem } from '@/components/design-system/molecules/NotificationItem';
import { Select } from '@/components/design-system/atoms/Select';
import { ConfirmDialog } from '@/components/design-system/organisms/ConfirmDialog';
import { OrderCard } from '@/components/design-system/organisms/OrderCard';
import { Search, Mail, Lock, Plus, Settings, Bell, DollarSign, Package, Trash, Edit } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function DesignSystemScreen() {
    const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
    const themeColors = Colors[colorScheme];
    const [inputValue, setInputValue] = useState('');
    const [sheetVisible, setSheetVisible] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectValue, setSelectValue] = useState('pending');

    return (
        <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <Stack.Screen options={{ title: 'Design System', headerShown: true }} />

            <View style={styles.section}>
                <Title style={styles.sectionTitle}>Typography</Title>
                <Heading>Heading Text</Heading>
                <Title>Title Text</Title>
                <Subtitle>Subtitle Text</Subtitle>
                <Body>Body Text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Body>
                <Caption>Caption Text - Used for secondary info</Caption>
            </View>

            <View style={styles.section}>
                <Title style={styles.sectionTitle}>Buttons</Title>
                <View style={styles.row}>
                    <Button label="Primary" onPress={() => { }} />
                    <Button label="Secondary" variant="secondary" onPress={() => { }} />
                </View>
                <View style={styles.row}>
                    <Button label="Outline" variant="outline" onPress={() => { }} />
                    <Button label="Ghost" variant="ghost" onPress={() => { }} />
                </View>
                <Button label="Danger" variant="danger" onPress={() => { }} style={styles.fullWidth} />
                <Button label="With Icon" icon={<Plus size={18} color="#fff" />} onPress={() => { }} style={styles.fullWidth} />
                <Button label="Loading..." loading onPress={() => { }} style={styles.fullWidth} />
            </View>

            <View style={styles.section}>
                <Title style={styles.sectionTitle}>Selection & Controls</Title>
                <Subtitle style={{ marginBottom: 12 }}>Switch & CheckBox</Subtitle>
                <View style={styles.row}>
                    <Switch value={true} onValueChange={() => { }} />
                    <CheckBox checked={true} onChange={() => { }} />
                    <CheckBox checked={false} onChange={() => { }} />
                </View>

                <Subtitle style={{ marginVertical: 12 }}>Select</Subtitle>
                <Select
                    label="Status Filter"
                    value={selectValue}
                    options={[
                        { label: 'Pending Orders', value: 'pending' },
                        { label: 'Ready for Pickup', value: 'ready' },
                        { label: 'Cancelled', value: 'cancelled' },
                    ]}
                    onSelect={setSelectValue}
                />
            </View>

            <View style={styles.section}>
                <Title style={styles.sectionTitle}>Molecules & Actions</Title>
                <Subtitle style={{ marginBottom: 12 }}>SearchBar</Subtitle>
                <SearchBar value="" onChangeText={() => { }} placeholder="Search orders..." />

                <Subtitle style={{ marginVertical: 12 }}>ListItem & ActionSheet</Subtitle>
                <ListItem
                    title="Merchant Action Menu"
                    subtitle="Tap to see actions"
                    icon={<Settings size={20} color={themeColors.primary} />}
                    showChevron
                    onPress={() => setSheetVisible(true)}
                />

                <ActionSheet
                    visible={sheetVisible}
                    onClose={() => setSheetVisible(false)}
                    title="Product Actions"
                    actions={[
                        { label: 'Edit Product', icon: <Edit size={20} color={themeColors.text} />, onPress: () => console.log('Edit') },
                        { label: 'Delete Product', icon: <Trash size={20} color={themeColors.error} />, variant: 'danger', onPress: () => console.log('Delete') },
                    ]}
                />

                <Subtitle style={{ marginVertical: 12 }}>NotificationItem</Subtitle>
                <NotificationItem
                    type="order"
                    title="New Order Received"
                    message="Order #5521 from John Doe is pending preparation."
                    time="2m ago"
                    onPress={() => { }}
                />
                <NotificationItem
                    type="success"
                    title="Payout Successful"
                    message="Your withdrawal of $120.00 has been processed."
                    time="1h ago"
                    read
                    onPress={() => { }}
                />
            </View>

            <View style={styles.section}>
                <Title style={styles.sectionTitle}>Organisms & Modals</Title>
                <Subtitle style={{ marginBottom: 12 }}>ConfirmDialog</Subtitle>
                <Button label="Show Danger Dialog" variant="outline" onPress={() => setDialogVisible(true)} />
                <ConfirmDialog
                    visible={dialogVisible}
                    onClose={() => setDialogVisible(false)}
                    onConfirm={() => setDialogVisible(false)}
                    title="Delete Product?"
                    message="This action cannot be undone. All data for this product will be permanently removed."
                    variant="danger"
                    confirmLabel="Delete"
                />
                <Subtitle style={{ marginBottom: 12 }}>StatsGrid</Subtitle>
                <StatsGrid
                    stats={[
                        { label: 'Revenue', value: '$4.2k', icon: <DollarSign size={20} color={themeColors.primary} />, trend: { value: '+12%', isPositive: true } },
                        { label: 'Orders', value: '156', icon: <Package size={20} color={themeColors.primary} />, trend: { value: '-2%', isPositive: false } },
                    ]}
                />

                <Subtitle style={{ marginVertical: 12 }}>OrderCard</Subtitle>
                <OrderCard
                    order={{
                        id: 'ord_1234',
                        customerName: 'Tamaira Merchant',
                        total: 45.50,
                        status: 'PREPARING',
                        itemCount: 3,
                        createdAt: new Date().toISOString(),
                    }}
                    onPress={() => { }}
                />
            </View>

            <View style={styles.section}>
                <Title style={styles.sectionTitle}>Inputs</Title>
                <Input
                    label="Email Address"
                    placeholder="Enter your email"
                    value={inputValue}
                    onChangeText={setInputValue}
                    icon={<Mail size={20} color="#64748B" />}
                />
                <Input
                    label="Password"
                    placeholder="Enter password"
                    secureTextEntry
                    value=""
                    onChangeText={() => { }}
                    icon={<Lock size={20} color="#64748B" />}
                />
                <Input
                    label="Search"
                    placeholder="Search items..."
                    value=""
                    onChangeText={() => { }}
                    icon={<Search size={20} color="#64748B" />}
                />
                <Input
                    label="Error State"
                    value="invalid input"
                    onChangeText={() => { }}
                    error="This field is required"
                />
            </View>

            <View style={styles.section}>
                <Title style={styles.sectionTitle}>Badges & Tags</Title>
                <View style={styles.row}>
                    <Badge label="Pending" variant="warning" />
                    <Badge label="Active" variant="success" />
                    <Badge label="Error" variant="error" />
                    <Badge label="Gray" variant="gray" />
                </View>
                <View style={[styles.row, { marginTop: 12 }]}>
                    <Tag label="Product" variant="primary" />
                    <Tag label="Inventory" variant="success" />
                    <Tag label="Default" variant="gray" />
                </View>
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 32,
        backgroundColor: 'transparent',
    },
    sectionTitle: {
        marginBottom: 16,
        opacity: 0.6,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
        flexWrap: 'wrap',
        backgroundColor: 'transparent',
    },
    fullWidth: {
        width: '100%',
        marginBottom: 12,
    },
});
