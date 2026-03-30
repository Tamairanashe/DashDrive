import { useWindowDimensions } from "react-native";

export const useDeviceType = () => {
    const { width } = useWindowDimensions();

    const isTablet = width >= 768;
    const isPhone = width < 768;

    return { isTablet, isPhone };
};
