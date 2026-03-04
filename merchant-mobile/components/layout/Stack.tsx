import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Spacing } from '../../constants/Spacing';

export interface StackProps {
    children: React.ReactNode;
    gap?: keyof typeof Spacing;
    align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
    style?: ViewStyle;
}

export const Stack = ({
    children,
    gap = 'md',
    align = 'stretch',
    justify = 'flex-start',
    style,
}: StackProps) => {
    const childrenArray = React.Children.toArray(children).filter(Boolean);

    return (
        <View style={[{ alignItems: align, justifyContent: justify }, style]}>
            {childrenArray.map((child, index) => (
                <React.Fragment key={index}>
                    {child}
                    {index < childrenArray.length - 1 && (
                        <View style={{ height: Spacing[gap] }} />
                    )}
                </React.Fragment>
            ))}
        </View>
    );
};
