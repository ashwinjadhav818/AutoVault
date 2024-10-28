import React, { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './firebase';
import Home from './src/screens/Home';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import Search from './src/screens/Search';
import CarDetails from './src/screens/CarDetails';
import AddCar from './src/screens/AddCar';
import EditCar from './src/screens/EditCar';
import Person from './src/screens/PersonDetails';
import EditPerson from './src/screens/EditPerson';

const Stack = createNativeStackNavigator();

const App = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    // Handle user state changes
    const onAuthStateChanged = (user) => {
        setUser(user);
        if (initializing) setInitializing(false);
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(onAuthStateChanged);
        return unsubscribe; // unsubscribe on unmount
    }, []);

    if (initializing) return null; // Render loading spinner or splash screen while initializing

    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    {user ? (
                        <>
                            <Stack.Screen
                                name="Home"
                                component={Home}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="CarDetails"
                                component={CarDetails}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="Search"
                                component={Search}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="AddCar"
                                component={AddCar}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="EditCar"
                                component={EditCar}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="Person"
                                component={Person}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="EditPerson"
                                component={EditPerson}
                                options={{ headerShown: false }}
                            />
                        </>
                    ) : (
                        <>
                            <Stack.Screen
                                name="Login"
                                component={Login}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="SignUp"
                                component={SignUp}
                                options={{ headerShown: false }}
                            />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
};

export default App;
