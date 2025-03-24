import { StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomNavigation } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";
import AppBar from "@/components/ui/AppBar";
import { PeopleItems } from "@/components/ui/AppBar/headerItems";

export default function TabLayout() {
    return (
        <View style={styles.container}>
            <Tabs
                tabBar={({ navigation, state, descriptors }) => (
                    <BottomNavigation.Bar
                        navigationState={state}
                        onTabPress={({ route, preventDefault }) => {
                            const event = navigation.emit({
                                type: "tabPress",
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (event.defaultPrevented) {
                                preventDefault();
                            } else {
                                navigation.dispatch(
                                    CommonActions.navigate(route.name),
                                );
                            }
                        }}
                        renderIcon={({ route, focused, color }) => {
                            const { options } = descriptors[route.key];
                            if (options.tabBarIcon) {
                                return options.tabBarIcon({
                                    focused,
                                    color,
                                    size: 24,
                                });
                            }
                            return null;
                        }}
                        getLabelText={({ route }) => {
                            const { options } = descriptors[route.key];
                            const label =
                                options.tabBarLabel !== undefined
                                    ? options.tabBarLabel
                                    : options.title !== undefined
                                      ? options.title
                                      : route.name;
                            return label as string;
                        }}
                    />
                )}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        header: () => <AppBar title="Home" />,
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons
                                size={28}
                                name="home-filled"
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="cars"
                    options={{
                        title: "Cars",
                        header: () => <AppBar title="Cars" />,
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons
                                size={28}
                                name="directions-car"
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="search"
                    options={{
                        title: "Search",
                        header: () => <AppBar title="Search" />,
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons
                                size={28}
                                name="search"
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="people"
                    options={{
                        title: "People",
                        header: () => (
                            <AppBar
                                title="People"
                                rightItems={() => PeopleItems()}
                            />
                        ),
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons
                                size={28}
                                name="person"
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="account"
                    options={{
                        title: "Account",
                        header: () => <AppBar title="Account" />,
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons
                                size={28}
                                name="account-circle"
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
