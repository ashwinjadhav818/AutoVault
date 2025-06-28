import { useColorScheme } from 'react-native';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export function useThemeColor() {
    const colorScheme = useColorScheme();
    const { theme } = useMaterial3Theme();

    // Base Paper Themes
    const baseDarkPaperTheme = { ...MD3DarkTheme, colors: theme.dark };
    const baseLightPaperTheme = { ...MD3LightTheme, colors: theme.light };

    const paperTheme = colorScheme === 'dark' ? baseDarkPaperTheme : baseLightPaperTheme;


    // Create  React Navigation theme based on the Paper/Material 3 theme
    const navigationTheme = {
        dark: paperTheme.dark,
        colors: {
            primary: paperTheme.colors.primary,
            background: paperTheme.colors.background,
            card: paperTheme.colors.surfaceContainer,
            text: paperTheme.colors.onBackground,
            border: paperTheme.colors.outlineVariant,
            notification: paperTheme.colors.error,
        },
        fonts: paperTheme.fonts,
    };

    return { paperTheme, navigationTheme };
}
