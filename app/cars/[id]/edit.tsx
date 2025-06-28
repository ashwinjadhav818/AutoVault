import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Image } from "react-native";
import { IconButton, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { ThemedDropdown } from '@/components/ui/ThemedDropdown';
import { getPeopleData, editCar, getCarDetails } from "@/hooks/handleFireStore";
import { auth } from "@/firebase";
import PagerView from "react-native-pager-view";
import { router, useLocalSearchParams } from "expo-router";
import { CarType } from "@/types/types";
import { useTheme } from 'react-native-paper';
import { MD3Theme } from 'react-native-paper';

interface Person {
    label: string;
    value: string;
}

export default function EditCar() {
    const { id } = useLocalSearchParams();
    const carId = id as string;

    const theme = useTheme() as MD3Theme;

    const [car, setCar] = useState<CarType>({
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

    const [people, setPeople] = useState<Person[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isFocus, setIsFocus] = useState<boolean>(false);

    const imagePicker = async () => {
    };

    async function fetchData(refresh: boolean) {
        setLoading(true);
        const userId = auth.currentUser?.uid;
        if (userId) {
            const carData = await getCarDetails(carId);
            const peopleData = await getPeopleData(refresh);

            if (carData && carData.data) {
                setCar({
                    name: carData.data.name,
                    offer: carData.data.offer,
                    year: carData.data.year,
                    color: carData.data.color,
                    variant: carData.data.variant,
                    passing: carData.data.passing,
                    km: carData.data.km,
                    insurance: carData.data.insurance,
                    owner: carData.data.owner,
                    images: carData.data.images || [],
                });
            }

            const formattedPeopleData = peopleData.map((item: any) => ({
                label: item.data.name,
                value: item.id,
            }));

            setPeople(formattedPeopleData);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchData(true);
    }, [carId]);

    const handleEditCar = () => {
        editCar(carId, car.name, car.offer, car.year, car.color, car.variant, car.passing, car.km, car.insurance, car.owner);
        router.back();
    };

    const handleInputChange = (field: keyof CarType, value: string) => {
        const numberValue = Number(value);
        if (field === "offer" || field === "year" || field === "km") {
            setCar({ ...car, [field]: numberValue });
        } else {
            setCar({ ...car, [field]: value });
        }
    };

    const carFields: (keyof CarType)[] = [
        "name",
        "offer",
        "year",
        "color",
        "variant",
        "passing",
        "km",
        "insurance",
    ];

    const numericFields: (keyof CarType)[] = ["offer", "year", "km"];

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={[styles.scrollViewContent, { backgroundColor: theme.colors.background }]}>
            {car.images?.length > 0 && <PagerView style={styles.pagerView} initialPage={0}>
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
            }
            {!car.images?.length && <View style={styles.emptyPagerView} />}
            {car.images?.length === 0 ? (
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
                    const isAnyFieldEmpty = Object.values(car).some((value) => !value && value !== "");
                    if (!isAnyFieldEmpty) {
                        handleEditCar();
                    }
                }}
                disabled={Object.values(car).some((value) => !value && value !== "")}
                style={styles.button}
            >
                Update
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
        marginVertical: 4,
    },
    smallImageAddButton: {
        minWidth: "95%",
        minHeight: 20,
        alignSelf: "center",
    },
    pagerView: {
        flex: 1,
        minHeight: 200,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyPagerView: {
        flex: 1,
        alignSelf: 'center',
        width: '95%',
        borderRadius: 5,
        marginVertical: 4,
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
