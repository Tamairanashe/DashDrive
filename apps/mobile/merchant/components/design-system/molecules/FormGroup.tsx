import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../atoms/Input';

interface FormGroupProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
}

export const FormGroup = (props: FormGroupProps) => {
    return (
        <View style={styles.container}>
            <Input {...props} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
});
