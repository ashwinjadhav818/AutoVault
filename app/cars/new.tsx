import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Image } from "react-native";
import { IconButton, TextInput, Button } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { addNewCar, getPeopleData } from "@/hooks/handleFireStore";
import { auth } from "@/firebase";
import { useNavigation } from "@react-navigation/native";
import PagerView from "react-native-pager-view";

interface Car {
    name: string;
    offer: number | null;
    year: number | null;
    color: string;
    variant: string;
    passing: string;
    km: number | null;
    insurance: string;
    owner: string;
    images: string[];
}

interface Person {
    label: string;
    value: string;
}

const AddCar: React.FC = () => {
    const [car, setCar] = useState<Car>({
        name: "",
        offer: null,
        year: null,
        color: "",
        variant: "",
        passing: "",
        km: null,
        insurance: "",
        owner: "",
        images: [],
    });

    const [people, setPeople] = useState<Person[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isFocus, setIsFocus] = useState<boolean>(false);

    const navigation = useNavigation();

    const imagePicker = async () => {
        // Import: import * as ImagePicker from "expo-image-picker";
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
        //
        return
    };

    async function fetchData() {
        const userId = auth.currentUser?.uid;
        if (userId) {
            const peopleData = await getPeopleData(false);
            const formattedPeopleData = peopleData.map((item) => ({
                label: item.data.name,
                value: item.id,
            }));
            setPeople(formattedPeopleData);
        }
    }

    useEffect(() => {
        fetchData();
        setLoading(true);
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
            car.owner
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

    return (
        <>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
                        const isAnyFieldEmpty = Object.values(car).some(
                            (value) => !value && value !== ""
                        );
                        if (!isAnyFieldEmpty) {
                            handleNewCar();
                        }
                    }}
                    disabled={Object.values(car).some((value) => !value && value !== "")}
                    style={styles.button}
                >
                    Save
                </Button>
            </ScrollView>
        </>
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

export default AddCar;
