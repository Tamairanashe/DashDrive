import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../../components/Themed';
import { Colors } from '../theme/colors';
import { useSLASettings } from '../store/useSLASettings';

interface SlaTimerProps {
    createdAt: string;
    status: string;
}

export default function SlaTimer({ createdAt, status }: SlaTimerProps) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        // If order is already completed or canceled, don't tick
        if (['completed', 'unfulfilled'].includes(status)) {
            const start = new Date(createdAt).getTime();
            const end = new Date().getTime(); // This should ideally be the completion_at time
            setElapsed(Math.floor((end - start) / 1000));
            return;
        }

        const interval = setInterval(() => {
            const start = new Date(createdAt).getTime();
            const now = new Date().getTime();
            setElapsed(Math.floor((now - start) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [createdAt, status]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const { warningMinutes, breachMinutes } = useSLASettings();

    const getTimerColor = () => {
        if (['completed', 'unfulfilled'].includes(status)) return Colors.textMuted;

        const minutes = elapsed / 60;
        if (minutes < warningMinutes) return Colors.primary; // Healthy
        if (minutes < breachMinutes) return Colors.preparing; // Warning
        return Colors.rejected; // Breach
    };

    return (
        <View style={[styles.container, { borderColor: getTimerColor() }]}>
            <Text style={[styles.timerText, { color: getTimerColor() }]}>
                {formatTime(elapsed)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        minWidth: 50,
        alignItems: 'center',
    },
    timerText: {
        fontSize: 12,
        fontWeight: '800',
        fontFamily: 'Outfit-Bold',
    },
});
