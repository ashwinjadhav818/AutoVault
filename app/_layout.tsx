import { Stack } from 'expo-router/stack';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider } from '@react-navigation/native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
    const { paperTheme, navigationTheme } = useThemeColor();

    return (
        <PaperProvider theme={paperTheme}>
            <ThemeProvider value={navigationTheme}>
                <StatusBar style="auto" />
                <Stack screenOptions={{ headerShown: false }} />
            </ThemeProvider>
        </PaperProvider>
    );
}
