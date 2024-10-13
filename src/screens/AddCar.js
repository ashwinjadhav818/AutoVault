import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Image } from "react-native";
// import PagerView from "react-native-pager-view";
import { IconButton, TextInput, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Dropdown } from "react-native-element-dropdown";
import AppBar from "../components/AppBar";
import { addNewCar, getPeopleData } from "../utils/handleFireStore";
import { auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native";

const AddCar = () => {
    const [carName, setCarName] = useState("");
    const [carOffer, setCarOffer] = useState("");
    const [carYear, setCarYear] = useState("");
    const [carColor, setCarColor] = useState("");
    const [carVarient, setCarVarient] = useState("");
    const [carPassing, setCarPassing] = useState("");
    const [carInsurance, setCarInsurance] = useState("");
    const [carKM, setCarKM] = useState("");
    const [carOwner, setCarOwner] = useState("");
    const [carImages, setCarImages] = useState([]);

    const inputs = [
        "Name",
        "Offer",
        "Year",
        "Color",
        "Varient",
        "Passing",
        "KM",
        "Insurance",
    ];
    const numericInputs = ["Offer", "Year", "KM"];
    const inputStateMap = {
        Name: setCarName,
        Offer: setCarOffer,
        Year: setCarYear,
        Color: setCarColor,
        Varient: setCarVarient,
        Passing: setCarPassing,
        KM: setCarKM,
        Insurance: setCarInsurance,
        Owner: setCarOwner,
    };

    const [people, setPeople] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFocus, setIsFocus] = useState(false);

    const userId = auth.currentUser.uid;
    const navigation = useNavigation();

    // No permissions request is necessary for launching the image library
    const imagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            // Image is valid, add it to the carImages state
            setCarImages([...carImages, result.uri]);
        } else {
            // Image is invalid, handle the error
            console.log("Invalid image selected.");
        }
    };

    async function fetchData() {
        const userId = auth.currentUser.uid;
        const peopleData = await getPeopleData(userId);
        const formattedPeopleData = peopleData.map((item) => ({
            label: item.data.name,
            value: item.data.name,
        }));
        setPeople(formattedPeopleData);
    }

    useEffect(() => {
        fetchData();
        setLoading(true);
    }, []);

    const handleNewCar = () => {
        addNewCar(carName, carOffer, carYear, carColor, carVarient, carPassing, carKM, carInsurance, carOwner);
        navigation.goBack();
    };

    return (
        <>
            <AppBar title="Add Car" />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
                    {inputs.map((input) => (
                        <TextInput
                            key={input}
                            label={input}
                            mode="outlined"
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
                            key={people}
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
                        const isAnyFieldEmpty =
                            !carName ||
                            !carOffer ||
                            !carYear ||
                            !carColor ||
                            !carVarient ||
                            !carPassing ||
                            !carKM ||
                            !carInsurance ||
                            !carOwner;

                        if (!isAnyFieldEmpty) {
                            handleNewCar();
                        }
                    }}
                    disabled={
                        !carName ||
                        !carOffer ||
                        !carYear ||
                        !carColor ||
                        !carVarient ||
                        !carPassing ||
                        !carKM ||
                        !carInsurance ||
                        !carOwner
                    }
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
});

export default AddCar;
