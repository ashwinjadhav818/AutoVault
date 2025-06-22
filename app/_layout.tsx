import { Stack } from 'expo-router/stack';
import { PaperProvider } from 'react-native-paper';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useColorScheme } from 'react-native';

export default function Layout() {
    const paperTheme = useThemeColor();


    const colorScheme = useColorScheme();

    return (
        <PaperProvider theme={paperTheme}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }} />
            </ThemeProvider>
        </PaperProvider>
    );
}
