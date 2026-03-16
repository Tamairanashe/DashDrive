import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { cssInterop } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";

// Map className to style for SafeAreaView
cssInterop(SafeAreaView, {
    className: "style",
});

export const StyledSafeAreaView = SafeAreaView;

// For icons, cssInterop is more robust for NativeWind v4
cssInterop(Ionicons, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
            fontSize: "size",
        },
    },
});
export const StyledIonicons = Ionicons;

cssInterop(FontAwesome5, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
            fontSize: "size",
        },
    },
});
export const StyledFontAwesome5 = FontAwesome5;

cssInterop(MaterialCommunityIcons, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
            fontSize: "size",
        },
    },
});
export const StyledMaterialCommunityIcons = MaterialCommunityIcons;

cssInterop(MaterialIcons, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
            fontSize: "size",
        },
    },
});
export const StyledMaterialIcons = MaterialIcons;

cssInterop(FontAwesome, {
    className: {
        target: "style",
        nativeStyleToProp: {
            color: true,
            fontSize: "size",
        },
    },
});
export const StyledFontAwesome = FontAwesome;
import { TextInput } from "react-native";

cssInterop(TextInput, {
    className: "style",
});
export const StyledTextInput = TextInput;
