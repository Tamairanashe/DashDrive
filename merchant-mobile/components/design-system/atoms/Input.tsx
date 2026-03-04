import React from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    TextStyle,
    ViewStyle,
    useColorScheme
} from 'react-native';
import Colors from '@/constants/Colors';

interface InputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    error?: string;
    icon?: React.ReactNode;
    rightElement?: React.ReactNode;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    style?: ViewStyle | ViewStyle[];
    inputStyle?: TextStyle | TextStyle[];
    onBlur?: () => void;
    onFocus?: () => void;
}

export const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    error,
    icon,
    rightElement,
    keyboardType = 'default',
    style,
    inputStyle,
    onBlur,
    onFocus,
}: InputProps) => {
    const colorScheme = (useColorScheme() ?? 'dark') as 'light' | 'dark';
    const themeColors = Colors[colorScheme];

    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={[styles.label, { color: themeColors.text }]}>{label}</Text>}
            <View style={[
                styles.inputWrapper,
                {
                    backgroundColor: themeColors.card,
                    borderColor: error ? themeColors.error : isFocused ? themeColors.primary : themeColors.border,
                    borderWidth: 1.5,
                }
            ]}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#64748B"
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    onFocus={() => {
                        setIsFocused(true);
                        onFocus?.();
                    }}
                    onBlur={() => {
                        setIsFocused(false);
                        onBlur?.();
                    }}
                    style={[
                        styles.input,
                        { color: themeColors.text },
                        inputStyle
                    ]}
                />
                {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
            </View>
            {error && <Text style={[styles.errorText, { color: themeColors.error }]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        paddingHorizontal: 12,
        height: 56,
    },
    iconContainer: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    rightElement: {
        marginLeft: 10,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});
