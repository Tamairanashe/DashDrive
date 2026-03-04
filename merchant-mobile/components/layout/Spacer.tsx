import React from 'react';
import { View } from 'react-native';
import { Spacing } from '../../constants/Spacing';

export interface SpacerProps {
    size?: keyof typeof Spacing;
    horizontal?: boolean;
}

export const Spacer = ({
    size = 'md',
    horizontal = false,
}: SpacerProps) => {
    return (
        <View
            style={{
                width: horizontal ? Spacing[size] : 0,
                height: horizontal ? 0 : Spacing[size]
            }}
        />
    );
};
