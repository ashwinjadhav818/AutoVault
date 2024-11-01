import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import PagerView from "react-native-pager-view";
import { ActivityIndicator } from "react-native-paper";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { getCarDetails } from "../utils/handleFireStore";
import AppBar from "../components/AppBar";

const CarDetails = ({ route }) => {
    const [car, setCar] = useState(null);

    const { carId } = route.params;
    const fetchCarDetails = async () => {
        const carDetails = await getCarDetails(carId);
        setCar(carDetails);
    };

    useEffect(() => {
        fetchCarDetails();
    }, []);

    const images = [
        "https://picsum.photos/700",
        "https://picsum.photos/500",
        "https://picsum.photos/600",
        "https://picsum.photos/800",
    ];

    return (
        <>
            <AppBar title="Car Details" carId={carId} />
            <ScrollView>
                {car ? (
                    <>
                        <View style={styles.container}>
                            <PagerView style={styles.pagerView}>
                                {images.map((image, index) => (
                                    <View key={index} style={styles.imageContainer}>
                                        <Image
                                            source={{ uri: image }}
                                            style={styles.image}
                                            resizeMode="contain"
                                        />
                                    </View>
                                ))}
                            </PagerView>
                        </View>

                        <View style={{ padding: 4 }}>
                            <TableView>
                                <Section>
                                    <Cell
                                        title={car.data.name}
                                        titleTextStyle={{ fontSize: 20, textAlign: "center" }}
                                    />
                                    <Cell
                                        cellStyle="RightDetail"
                                        title="Offer"
                                        detail={car.data.offer}
                                    />
                                    <Cell
                                        cellStyle="RightDetail"
                                        title="Year"
                                        detail={car.data.year}
                                    />
                                    <Cell
                                        cellStyle="RightDetail"
                                        title="Color"
                                        detail={car.data.color}
                                    />
                                    <Cell
                                        cellStyle="RightDetail"
                                        title="Variant"
                                        detail={car.data.variant}
                                    />
                                    <Cell
                                        cellStyle="RightDetail"
                                        title="Passing"
                                        detail={car.data.passing}
                                    />
                                    <Cell
                                        cellStyle="RightDetail"
                                        title="Insurance"
                                        detail={car.data.insurance}
                                    />
                                    <Cell
                                        cellStyle="RightDetail"
                                        title="KM"
                                        detail={car.data.km}
                                    />
                                    <Cell
                                        cellStyle="RightDetail"
                                        title="Owner/Dealer"
                                        detail={car.data.owner}
                                    />
                                </Section>
                            </TableView>
                        </View>
                    </>
                ) : (
                    <ActivityIndicator animating={true} />
                )}
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        aspectRatio: 1,
    },
    pagerView: {
        flex: 1,
    },
    imageContainer: {
        flex: 1,
    },
    image: {
        width: "100%",
        height: "100%",
    },
});

export default CarDetails;
