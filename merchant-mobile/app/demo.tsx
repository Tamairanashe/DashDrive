import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { Section } from '../components/layout/Section';
import { Stack } from '../components/layout/Stack';
import { Row } from '../components/layout/Row';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/data/Card';
import { StatsCard } from '../components/data/StatsCard';
import { OrderCard } from '../components/data/OrderCard';
import { ProductCard } from '../components/data/ProductCard';
import { TextInput } from '../components/forms/TextInput';
import { SelectDropdown } from '../components/forms/SelectDropdown';
import { ToggleSwitch } from '../components/forms/ToggleSwitch';
import { Checkbox } from '../components/forms/Checkbox';
import { RadioGroup } from '../components/forms/RadioGroup';
import { Alert } from '../components/feedback/Alert';
import { RevenueChart } from '../components/charts/RevenueChart';
import { OrderStatusStepper } from '../components/merchant/OrderStatusStepper';
import { WalletBalanceCard } from '../components/merchant/WalletBalanceCard';
import { useToast } from '../hooks/useToast';
import { ShoppingBag, Bell, Search, DollarSign } from 'lucide-react-native';

export default function DemoScreen() {
    const { showToast } = useToast();
    const [toggle, setToggle] = useState(false);
    const [check, setCheck] = useState(false);
    const [radio, setRadio] = useState<string | number>('one');
    const [select, setSelect] = useState<string | number>('1');

    return (
        <ScreenContainer title="Component Library Demo">
            <Stack gap="xl">
                <Alert
                    variant="info"
                    title="Component Library v1.0"
                    message="This screen showcases all reusable components in the Dashdrive Mart design system."
                />

                <Section title="Atomic UI Components">
                    <Stack gap="md">
                        <Row gap="md">
                            <Button label="Primary Button" onPress={() => showToast('Clicked Primary!')} />
                            <Button label="Outline" variant="outline" />
                        </Row>
                        <Row gap="md">
                            <IconButton icon={<ShoppingBag size={20} color="#10B981" />} variant="outline" />
                            <Badge label="New Order" variant="success" />
                            <Avatar name="John Doe" size={32} />
                        </Row>
                        <Stack gap="xs">
                            <Text variant="header">Header Text</Text>
                            <Text variant="title2">Title 2 Text</Text>
                            <Text variant="bodyLarge">Body Large Text</Text>
                        </Stack>
                    </Stack>
                </Section>

                <Section title="Dashboard & Data">
                    <Stack gap="md">
                        <StatsCard
                            label="Total Revenue"
                            value="$12,450.00"
                            trend={12}
                            icon={<DollarSign size={20} color="#10B981" />}
                        />
                        <RevenueChart
                            data={[
                                { label: 'Mon', value: 400 },
                                { label: 'Tue', value: 600 },
                                { label: 'Wed', value: 800 },
                                { label: 'Thu', value: 500 },
                                { label: 'Fri', value: 900 },
                            ]}
                        />
                    </Stack>
                </Section>

                <Section title="Forms & Inputs">
                    <Stack gap="md">
                        <TextInput label="Product Name" placeholder="e.g. Sushi Platter" />
                        <SelectDropdown
                            label="Category"
                            options={[
                                { label: 'Japanese', value: '1' },
                                { label: 'Italian', value: '2' },
                                { label: 'Mexican', value: '3' },
                            ]}
                            value={select}
                            onSelect={setSelect}
                        />
                        <ToggleSwitch label="Available for Delivery" value={toggle} onValueChange={setToggle} />
                        <Checkbox label="I agree to terms" checked={check} onPress={() => setCheck(!check)} />
                        <RadioGroup
                            label="Delivery Priority"
                            options={[
                                { label: 'Standard', value: 'one' },
                                { label: 'Express', value: 'two' },
                            ]}
                            value={radio}
                            onSelect={setRadio}
                        />
                    </Stack>
                </Section>

                <Section title="Merchant Specials">
                    <Stack gap="md">
                        <WalletBalanceCard balance="$2,500.00" />
                        <OrderStatusStepper currentStatus="preparing" />
                        <OrderCard
                            orderId="8821"
                            customerName="Alice Green"
                            items={3}
                            total="$45.00"
                            status="preparing"
                            time="10 mins ago"
                        />
                    </Stack>
                </Section>
            </Stack>
        </ScreenContainer>
    );
}
