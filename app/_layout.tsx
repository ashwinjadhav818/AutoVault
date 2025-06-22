import { Stack } from 'expo-router/stack';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider } from '@react-navigation/native';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function Layout() {
    const { paperTheme, navigationTheme } = useThemeColor();

    return (
        <PaperProvider theme={paperTheme}>
            <ThemeProvider value={navigationTheme}>
                <Stack screenOptions={{ headerShown: false }} />
            </ThemeProvider>
        </PaperProvider>
    );
}
