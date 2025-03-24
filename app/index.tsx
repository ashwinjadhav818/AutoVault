import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { isUserLoggedIn } from '@/hooks/handleAuth';
import 'react-native-reanimated';
import '../global.css';

export default function Index() {
    const { isAuthenticated, isLoading } = isUserLoggedIn();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    return <Redirect href="/(tabs)" />;
}
