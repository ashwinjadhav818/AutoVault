import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Image } from "react-native";
import { IconButton, TextInput, Button, ActivityIndicator } from "react-native-paper";
// import * as ImagePicker from "expo-image-picker";
import { Dropdown } from "react-native-element-dropdown";
import { getPeopleData, editCar, getCarDetails } from "@/hooks/handleFireStore";
import { auth } from "@/firebase";
import PagerView from "react-native-pager-view";
import { router, useLocalSearchParams } from "expo-router";
import { CarType } from "@/types/types";

interface Person {
    label: string;
    value: string;
}


export default function EditCar() {
    const { id } = useLocalSearchParams();
    const carId = id as string;

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
        // let result = await ImagePicker.launchImageLibraryAsync({
        //     mediaTypes: ImagePicker.MediaTypeOptions.All,
        //     allowsEditing: true,
        //     aspect: [4, 3],
        //     quality: 1,
        // });
        //
        // if (!result.canceled && result.assets && result.assets.length > 0) {
        //     setCar({ ...car, images: [...car.images, result.assets[0].uri] });
        // } else {
        //     console.log("Invalid image selected.");
        // }
    };

    async function fetchData() {
        setLoading(true);
        const userId = auth.currentUser?.uid;
        if (userId) {
            const carData = await getCarDetails(carId);
            const peopleData = await getPeopleData(false);

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
        fetchData();
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
            <View>
                <ActivityIndicator animating={true} size="large" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
                    style={styles.imageAddButton}
                    size={70}
                />
            ) : (
                <IconButton
                    onPress={() => imagePicker()}
                    icon="file-image-plus"
                    style={styles.smallImageAddButton}
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
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        key={people.length.toString()}
                        iconStyle={styles.iconStyle}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        data={people}
                        search
                        placeholder="Select owner"
                        value={car.owner}
                        onChange={(item) => handleInputChange("owner", item.value)}
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
    dropdown: {
        backgroundColor: "white",
        color: "gray",
        height: 50,
        borderColor: "darkgray",
        borderWidth: 1.5,
        borderRadius: 5,
        paddingHorizontal: 8,
        marginVertical: 4,
    },
    label: {
        position: "absolute",
        backgroundColor: "gray",
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
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

