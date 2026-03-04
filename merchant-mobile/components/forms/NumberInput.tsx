import React from 'react';
import { TextInput, TextInputProps } from './TextInput';

export interface NumberInputProps extends Omit<TextInputProps, 'keyboardType'> {
    allowDecimal?: boolean;
}

export const NumberInput = ({
    allowDecimal = true,
    ...props
}: NumberInputProps) => {
    return (
        <TextInput
            keyboardType={allowDecimal ? 'decimal-pad' : 'number-pad'}
            {...props}
        />
    );
};
