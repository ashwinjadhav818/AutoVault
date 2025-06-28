import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Image, Alert } from "react-native";
import {
    IconButton,
    TextInput,
    Button,
    ActivityIndicator,
    Dialog,
    Portal,
    Text,
} from "react-native-paper";
import { CarType as Car, PersonType as Person } from "@/types/types";
import ThemedDropdown from '@/components/ui/ThemedDropdown'; // IMPORT your new ThemedDropdown component
import { addNewCar, getPeopleData } from "@/hooks/handleFireStore";
import { auth } from "@/firebase";
import { useNavigation } from "@react-navigation/native";
import PagerView from "react-native-pager-view";
import { router } from "expo-router";
import { useTheme } from 'react-native-paper';
import { MD3Theme } from 'react-native-paper';


const AddCar: React.FC = () => {
    const theme = useTheme() as MD3Theme;
    const [car, setCar] = useState<Car>({
        name: "",
        offer: 0,
        year: 0,
        color: "",
        variant: "",
        passing: "",
        km: 0,
        insurance: "",
        owner: "",
        images: [],
    });

    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isFocus, setIsFocus] = useState<boolean>(false);

    // Dialog state for "no people" prompt
    const [noPeopleDialogVisible, setNoPeopleDialogVisible] = useState(false);

    const navigation = useNavigation();

    const imagePicker = async () => {
        // Image picker logic here
        return;
    };

    async function fetchData(refresh: boolean) {
        setLoading(true);
        const userId = auth.currentUser?.uid;
        if (userId) {
            const peopleData = await getPeopleData(refresh);
            const formattedPeopleData = peopleData.map((item) => ({
                label: item.data.name,
                value: item.id,
            }));
            setPeople(formattedPeopleData);

            // If no people are found, show the dialog
            if (formattedPeopleData.length === 0) {
                setNoPeopleDialogVisible(true);
            }
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchData(true);
    }, []);

    const handleNewCar = () => {
        addNewCar(
            car.name,
            car.offer,
            car.year,
            car.color,
            car.variant,
            car.passing,
            car.km,
            car.insurance,
            car.owner,
        );
        navigation.goBack();
    };

    const handleInputChange = (field: keyof Car, value: string) => {
        if (field === "offer" || field === "year" || field === "km") {
            const numberValue = Number(value);
            setCar({ ...car, [field]: numberValue });
        } else {
            setCar({ ...car, [field]: value });
        }
    };

    const carFields: (keyof Car)[] = [
        "name",
        "offer",
        "year",
        "color",
        "variant",
        "passing",
        "km",
        "insurance",
    ];

    const numericFields: (keyof Car)[] = ["offer", "year", "km"];

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!loading && people.length === 0) {
        return (
            <Portal>
                <Dialog visible={noPeopleDialogVisible} onDismiss={() => setNoPeopleDialogVisible(false)} style={{ backgroundColor: theme.colors.surface }}>
                    <Dialog.Title style={{ color: theme.colors.onSurface }}>No Owners Found</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                            It looks like there are no people registered as owners.
                            Please add a new person before adding a car.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            setNoPeopleDialogVisible(false);
                            router.push('/(tabs)/people'); // Navigate to your people creation screen
                        }} labelStyle={{ color: theme.colors.primary }}>
                            Go to Add Person
                        </Button>
                        <Button onPress={() => {
                            setNoPeopleDialogVisible(false);
                            navigation.goBack(); // Option to go back
                        }} labelStyle={{ color: theme.colors.outline }}>
                            Cancel
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        );
    }

    return (
        <ScrollView contentContainerStyle={[styles.scrollViewContent, { backgroundColor: theme.colors.background }]}>
            {car.images.length > 0 && (
                <PagerView style={styles.pagerView} initialPage={0}>
                    {car.images.map((carImage, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <Image
                                source={{ uri: carImage }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                    ))}
                </PagerView>
            )}
            {!car.images.length && <View style={styles.emptyPagerView} />}
            {car.images.length === 0 ? (
                <IconButton
                    onPress={() => imagePicker()}
                    icon="file-image-plus"
                    style={[styles.imageAddButton, { backgroundColor: theme.colors.surfaceVariant }]}
                    iconColor={theme.colors.onSurfaceVariant}
                    size={70}
                />
            ) : (
                <IconButton
                    onPress={() => imagePicker()}
                    icon="file-image-plus"
                    style={[styles.smallImageAddButton, { backgroundColor: theme.colors.surfaceVariant }]}
                    iconColor={theme.colors.onSurfaceVariant}
                    size={20}
                />
            )}
            <View style={styles.formContainer}>
                {carFields.map((field) => (
                    <TextInput
                        key={field}
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        mode="outlined"
                        value={
                            typeof car[field] === "number"
                                ? car[field].toString()
                                : typeof car[field] === "string"
                                    ? car[field]
                                    : ""
                        }
                        onChangeText={(value) => handleInputChange(field, value)}
                        inputMode={numericFields.includes(field) ? "numeric" : "text"}
                    />
                ))}
                {people && people.length > 0 && (
                    <ThemedDropdown
                        data={people}
                        value={car.owner}
                        placeholder="Select owner"
                        onChange={(item) => handleInputChange("owner", item.value)}
                        isFocus={isFocus}
                        setIsFocus={setIsFocus}
                    />
                )}
            </View>
            <Button
                mode="contained-tonal"
                onPress={() => {
                    const isAnyFieldEmpty = Object.values(car).some(
                        (value) => !value && value !== "" && value !== 0
                    );
                    if (!isAnyFieldEmpty) {
                        handleNewCar();
                    } else {
                        Alert.alert("Missing Information", "Please fill in all car details.");
                    }
                }}
                disabled={Object.values(car).some((value) => !value && value !== "" && value !== 0)}
                style={styles.button}
            >
                Save
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageAddButton: {
        minWidth: "95%",
        height: 200,
        alignSelf: "center",
    },
    smallImageAddButton: {
        minWidth: "95%",
        minHeight: 20,
        alignSelf: "center",
    },
    pagerView: {
        flex: 1,
    },
    imageContainer: {
        flex: 1,
    },
    emptyPagerView: {
        flex: 1,
    },
    formContainer: {
        paddingHorizontal: 20,
    },
    button: {
        borderRadius: 10,
        marginVertical: 5,
        marginHorizontal: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    }
});

export default AddCar;
