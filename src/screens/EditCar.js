import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Image } from "react-native";
import PagerView from "react-native-pager-view";
import { IconButton, TextInput, Button, Text, ActivityIndicator } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Dropdown } from "react-native-element-dropdown";
import AppBar from "../components/AppBar";
import { getPeopleData, editCar, getCarDetails } from "../utils/handleFireStore";
import { auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native";

const EditCar = ({ route }) => {
    // Declaring and Initilizing the variables
    const carId = route.params.carId;
    let car;
    const [carName, setCarName] = useState();
    const [carOffer, setCarOffer] = useState();
    const [carYear, setCarYear] = useState();
    const [carColor, setCarColor] = useState();
    const [carVariant, setCarVariant] = useState();
    const [carPassing, setCarPassing] = useState();
    const [carInsurance, setCarInsurance] = useState();
    const [carKM, setCarKM] = useState();
    const [carOwner, setCarOwner] = useState();
    const [carImages, setCarImages] = useState([]);

    const inputs = [
        "Name",
        "Offer",
        "Year",
        "Color",
        "Variant",
        "Passing",
        "KM",
        "Insurance",
    ];
    const isAnyFieldEmpty = !carName || !carOffer || !carYear || !carColor || !carVariant || !carPassing || !carKM || !carInsurance || !carOwner;
    const numericInputs = ["Offer", "Year", "KM"];

    const defaultStateMap = {
        Name: carName,
        Offer: carOffer,
        Year: carYear,
        Color: carColor,
        Variant: carVariant,
        Passing: carPassing,
        KM: carKM,
        Insurance: carInsurance,
        Owner: carOwner,
    };
    const inputStateMap = {
        Name: setCarName,
        Offer: setCarOffer,
        Year: setCarYear,
        Color: setCarColor,
        Variant: setCarVariant,
        Passing: setCarPassing,
        KM: setCarKM,
        Insurance: setCarInsurance,
        Owner: setCarOwner,
    };

    const [people, setPeople] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFocus, setIsFocus] = useState(false);

    const navigation = useNavigation();

    // No permissions request is necessary for launching the image library
    const imagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            // Image is valid, add it to the carImages state
            setCarImages([...carImages, result.uri]);
        } else {
            // Image is invalid, handle the error
            console.log("Invalid image selected.");
        }
    };

    async function fetchData() {
        setLoading(true)
        const userId = auth.currentUser.uid;
        // Getting Car Details
        car = await getCarDetails(carId);
        const peopleData = await getPeopleData(userId);

        // Check if car data is available
        if (!car || !car.data) {
            console.error("Car data not found for ID:", carId);
            setLoading(false);
            return;
        }

        setCarName(car.data.name)
        setCarOffer(car.data.offer)
        setCarYear(car.data.year)
        setCarColor(car.data.color)
        setCarVariant(car.data.variant)
        setCarPassing(car.data.passing)
        setCarKM(car.data.km)
        setCarInsurance(car.data.insurance)
        setCarOwner(car.data.owner)

        const formattedPeopleData = peopleData.map((item) => ({
            label: item.data.name,
            value: item.id,
        }));

        setPeople(formattedPeopleData);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [carId]);


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} size="large" />
            </View>
        );
    }

    const handleNewCar = () => {
        editCar(carId, carName, carOffer, carYear, carColor, carVariant, carPassing, carKM, carInsurance, carOwner);
        navigation.goBack();
    };

    return (
        <>
            <AppBar title="Edit Car" />
            {carImages.length > 0 && (
                <PagerView style={styles.pagerView}>
                    {carImages.map((carImage, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <Image
                                src={carImage}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                    ))}
                </PagerView>
            )}
            {!carImages.length && <View style={styles.emptyPagerView} />}
            {carImages.length === 0 ? (
                <IconButton
                    onPress={() => imagePicker()}
                    icon="file-image-plus"
                    tyle={styles.imageAddButton}
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
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.formContainer}>
                    {inputs.map((input) => (
                        <TextInput
                            key={input}
                            label={input}
                            mode="outlined"
                            value={defaultStateMap[input]}
                            onChangeText={(value) => {
                                const stateUpdateFunction = inputStateMap[input];
                                if (stateUpdateFunction) {
                                    stateUpdateFunction(value);
                                }
                            }}
                            inputMode={numericInputs.includes(input) ? "numeric" : "text"}
                        />
                    ))}
                    {people && people.length > 0 && (
                        <Dropdown
                            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inpuScrollViewrchStyle}
                            iconStyle={styles.iconStyle}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            data={people}
                            search
                            placeholder="Select owner"
                            value={carOwner}
                            onChange={(item) => setCarOwner(item.value)}
                        />
                    )}
                </View>
                <Button
                    mode="contained-tonal"
                    onPress={() => {
                        if (!isAnyFieldEmpty) {
                            handleNewCar();
                        }
                    }}
                    disabled={isAnyFieldEmpty}
                    style={styles.button}
                >
                    Update
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
        minHeight: 200,
        alignSelf: "center",
    },
    smallImageAddButton: {
        minWidth: "95%",
        minHeight: 20, // Adjust the minHeight as needed
        alignSelf: "center",
    },
    pagerView: {
        flex: 1, // Ensure PagerView takes up remaining space
    },
    imageContainer: {
        flex: 1, // Ensure ImageContainer takes up remaining space
    },
    emptyPagerView: {
        flex: 1, // Ensure empty PagerView takes up remaining space
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
    loadingContainer: {
        flex: 1, // Ensure it takes up the full screen
        justifyContent: "center", // Center vertically
        alignItems: "center", // Center horizontally
    },
});

export default EditCar;
