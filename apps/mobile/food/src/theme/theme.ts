import { MD3DarkTheme } from "react-native-paper";
import { Colors } from "./colors";

export const DashFoodDarkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: Colors.primary,
        background: Colors.background,
        surface: Colors.surface,
        onSurface: Colors.textPrimary,
        outline: Colors.border,
        elevation: {
            ...MD3DarkTheme.colors.elevation,
            level1: Colors.surface,
            level2: Colors.card,
        }
    },
};
