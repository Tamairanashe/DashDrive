import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Spacing } from '../../constants/Spacing';

export interface RowProps {
    children: React.ReactNode;
    gap?: keyof typeof Spacing;
    align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
    wrap?: boolean;
    style?: ViewStyle;
}

export const Row = ({
    children,
    gap = 'md',
    align = 'center',
    justify = 'flex-start',
    wrap = false,
    style,
}: RowProps) => {
    const childrenArray = React.Children.toArray(children).filter(Boolean);

    return (
        <View
            style={[
                {
                    flexDirection: 'row',
                    alignItems: align,
                    justifyContent: justify,
                    flexWrap: wrap ? 'wrap' : 'nowrap'
                },
                style
            ]}
        >
            {childrenArray.map((child, index) => (
                <React.Fragment key={index}>
                    {child}
                    {index < childrenArray.length - 1 && (
                        <View style={{ width: Spacing[gap] }} />
                    )}
                </React.Fragment>
            ))}
        </View>
    );
};
