import { useColorScheme } from "nativewind";
import React from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    interpolateColor,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from "react-native-reanimated";
import { StyledIonicons } from "../lib/interop";

interface ThemeSwitcherProps {
    selectedMode: 'light' | 'dark' | 'system';
    onSelect: (mode: 'light' | 'dark' | 'system') => void;
    mini?: boolean;
}

const AnimatedIonicons = Animated.createAnimatedComponent(StyledIonicons);

export function ThemeSwitcher({
    selectedMode,
    onSelect,
    mini = false
}: ThemeSwitcherProps) {
    const modes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const activeIndex = modes.indexOf(selectedMode);
    const [containerWidth, setContainerWidth] = React.useState(0);

    const translationX = useSharedValue(activeIndex);

    React.useEffect(() => {
        translationX.value = withSpring(activeIndex, { damping: 20, stiffness: 120 });
    }, [activeIndex]);

    const activeIndexOnStart = useSharedValue(activeIndex);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            activeIndexOnStart.value = translationX.value;
        })
        .onUpdate((event) => {
            const padding = 4;
            const thumbWidth = (containerWidth - (padding * 2)) / 3;
            if (thumbWidth > 0) {
                const deltaIndex = event.translationX / thumbWidth;
                translationX.value = Math.max(0, Math.min(2, activeIndexOnStart.value + deltaIndex));
            }
        })
        .onEnd(() => {
            const finalIndex = Math.round(translationX.value);
            translationX.value = withSpring(finalIndex);
            runOnJS(onSelect)(modes[finalIndex]);
        });

    const tapGesture = Gesture.Tap()
        .onEnd((event) => {
            const padding = 4;
            const thumbWidth = (containerWidth - (padding * 2)) / 3;
            if (thumbWidth > 0) {
                const tappedIndex = Math.floor((event.x - padding) / thumbWidth);
                if (tappedIndex >= 0 && tappedIndex < 3) {
                    translationX.value = withSpring(tappedIndex);
                    runOnJS(onSelect)(modes[tappedIndex]);
                }
            }
        });

    const composedGesture = Gesture.Race(panGesture, tapGesture);

    const thumbStyle = useAnimatedStyle(() => {
        const padding = 4;
        const thumbWidth = (containerWidth - (padding * 2)) / 3;
        return {
            transform: [{ translateX: translationX.value * thumbWidth }],
            width: thumbWidth || '33.33%',
            opacity: containerWidth > 0 ? 1 : 0
        };
    });

    return (
        <GestureDetector gesture={composedGesture}>
            <View
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
                className={`flex-row items-center bg-gray-50/50 dark:bg-zinc-800/30 p-1 rounded-full relative ${mini ? 'h-10 w-[140px]' : 'h-14 w-full'} overflow-hidden border border-gray-100/30 dark:border-zinc-700/10`}
            >
                <Animated.View
                    style={[
                        thumbStyle,
                        {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2
                        }
                    ]}
                    className="absolute top-1 bottom-1 left-1 bg-white dark:bg-zinc-700 rounded-full"
                />

                {modes.map((mode) => (
                    <ThemeButton
                        key={mode}
                        mode={mode}
                        myIndex={modes.indexOf(mode)}
                        activeIndexShared={translationX}
                        mini={mini}
                    />
                ))}
            </View>
        </GestureDetector>
    );
}

function ThemeButton({
    mode,
    myIndex,
    activeIndexShared,
    mini
}: {
    mode: 'light' | 'dark' | 'system',
    myIndex: number,
    activeIndexShared: any,
    mini?: boolean
}) {
    const icons = { light: 'sunny-outline', dark: 'moon-outline', system: 'settings-outline' };
    const labels = { light: 'Light', dark: 'Dark', system: 'System' };
    const { colorScheme } = useColorScheme();

    const iconStyle = useAnimatedStyle(() => {
        const distance = Math.abs(activeIndexShared.value - myIndex);
        const isActive = distance < 0.5;

        return {
            color: interpolateColor(
                distance,
                [0, 0.5],
                ['#00ff90', colorScheme === 'dark' ? '#71717a' : '#adadad']
            ),
            transform: [{ scale: withSpring(isActive ? 1.1 : 1) }]
        };
    });

    return (
        <View className="flex-1 items-center justify-center flex-row h-full z-10">
            <AnimatedIonicons
                name={icons[mode] as any}
                size={mini ? 14 : 18}
                style={iconStyle}
            />
            {!mini && (
                <Text className={`ml-2 font-uber-bold text-[10px] uppercase tracking-tighter ${colorScheme === 'dark' ? 'text-white' : 'text-secondary'}`}>
                    {labels[mode]}
                </Text>
            )}
        </View>
    );
}
