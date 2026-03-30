import React, { useEffect } from "react";
import {
    Image,
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { StyledIonicons } from "../../lib/interop";

interface SocialAuthModalProps {
    visible: boolean;
    provider: "apple" | "google" | "facebook" | null;
    onClose: () => void;
    onContinue: () => void;
}

export const SocialAuthModal: React.FC<SocialAuthModalProps> = ({
    visible,
    provider,
    onClose,
    onContinue,
}) => {
    const translateY = useSharedValue(600);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            translateY.value = withSpring(0, { damping: 20, stiffness: 120 });
            opacity.value = withTiming(1, { duration: 300 });
        } else {
            translateY.value = withTiming(600, { duration: 300 });
            opacity.value = withTiming(0, { duration: 300 });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    // Early return AFTER all hooks to comply with Rules of Hooks
    if (!provider && !visible) return null;

    const getProviderStyle = () => {
        const p = provider || "google";
        switch (p) {
            case "google":
                return {
                    name: "Google",
                    logo: <StyledIonicons name="logo-google" size={24} color="#EA4335" />,
                    id: "gis-examples.glitch.me",
                    domain: "google.com",
                };
            case "apple":
                return {
                    name: "Apple",
                    logo: <StyledIonicons name="logo-apple" size={24} color="#000000" />,
                    id: "DashDrive",
                    domain: "apple.com",
                };
            case "facebook":
                return {
                    name: "Facebook",
                    logo: <StyledIonicons name="logo-facebook" size={24} color="#1877F2" />,
                    id: "DashDrive",
                    domain: "facebook.com",
                };
            default:
                return { name: "", logo: null, id: "", domain: "" };
        }
    };

    const style = getProviderStyle();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Animated.View
                    style={[
                        {
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.4)",
                        },
                        backdropStyle,
                    ]}
                >
                    <Pressable style={{ flex: 1 }} onPress={onClose} />
                </Animated.View>

                <Animated.View
                    style={[
                        {
                            backgroundColor: "#fff",
                            borderTopLeftRadius: 32,
                            borderTopRightRadius: 32,
                            paddingHorizontal: 24,
                            paddingTop: 24,
                            paddingBottom: 48,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: -10 },
                            shadowOpacity: 0.1,
                            shadowRadius: 20,
                            elevation: 20,
                        },
                        animatedStyle,
                    ]}
                >
                    {/* Header */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                            {style.logo}
                            <Text
                                style={{ marginLeft: 12, fontSize: 15, fontWeight: "500", color: "#3f3f46" }}
                                numberOfLines={1}
                            >
                                Sign in to DashDrive
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
                            <StyledIonicons name="close" size={24} color="#71717a" />
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={{ height: 1, backgroundColor: "#f4f4f5", marginBottom: 32 }} />

                    {/* User Profile */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 32 }}>
                        <View style={{ height: 56, width: 56, borderRadius: 28, backgroundColor: "#f4f4f5", overflow: "hidden" }}>
                            <Image
                                source={{ uri: "https://i.pravatar.cc/150?u=elisa" }}
                                style={{ height: "100%", width: "100%" }}
                            />
                        </View>
                        <View style={{ marginLeft: 16 }}>
                            <Text style={{ fontSize: 17, fontWeight: "700", color: "#000" }}>
                                Elisa Beckett
                            </Text>
                            <Text style={{ fontSize: 15, fontWeight: "500", color: "#71717a" }}>
                                elisa.g.beckett@gmail.com
                            </Text>
                        </View>
                    </View>

                    {/* Button */}
                    <TouchableOpacity
                        style={{ backgroundColor: "#1a73e8", height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", marginBottom: 24 }}
                        onPress={onContinue}
                        activeOpacity={0.8}
                    >
                        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                            Continue as Elisa
                        </Text>
                    </TouchableOpacity>

                    {/* Footer Legal */}
                    <Text style={{ fontSize: 13, fontWeight: "500", color: "#71717a", lineHeight: 20 }}>
                        To continue, {style.domain} will share your name, email address, and profile picture with this site. See this site's {" "}
                        <Text style={{ color: "#2563eb", textDecorationLine: "underline" }}>privacy policy</Text> and {" "}
                        <Text style={{ color: "#2563eb", textDecorationLine: "underline" }}>terms of service</Text>.
                    </Text>
                </Animated.View>
            </View>
        </Modal>
    );
};
