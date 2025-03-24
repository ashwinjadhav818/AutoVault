import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Image } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { getCarDetails, getPersonData, subscribeToCarsDataChanges } from "@/hooks/handleFireStore";
import { useLocalSearchParams } from "expo-router";
import PagerView from 'react-native-pager-view';
import { TableView, Section, Cell } from 'react-native-tableview-simple';
import { CarType } from "@/types/types";

interface Car {
    id: string;
    data: CarType
}

export default function CarPage() {
    const [car, setCar] = useState<Car | null>(null);
    const [ownerName, setOwnerName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const { id } = useLocalSearchParams();

    const fetchData = async () => {
        setLoading(true);
        try {
            if (!id) {
                console.error("Car ID is undefined");
                return;
            }
            const carDetails = await getCarDetails(id as string);
            if (carDetails) {
                setCar(carDetails);

                if (car?.data.owner !== carDetails.data.owner) {
                    const ownerDetails = await getPersonData(carDetails.data.owner);
                    setOwnerName(ownerDetails ? ownerDetails.data.name : "Unknown Owner");
                }
            } else {
                console.warn(`No car data found for ID: ${id}`);
                setCar(null);
                setOwnerName("");
            }
        } catch (error) {
            console.error("Error fetching car details:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    useEffect(() => {
        const unsubscribe = subscribeToCarsDataChanges(fetchData);
        return () => unsubscribe();
    }, []);


    if (loading || !car) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} />
            </View>
        );
    }

    const images = [
        "https://picsum.photos/700",
        "https://picsum.photos/500",
        "https://picsum.photos/600",
        "https://picsum.photos/800",
    ];

    return (
        <ScrollView>
            <View style={styles.container}>
                <PagerView style={styles.pagerView}>
                    {images.map((image, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <Image
                                source={{ uri: image }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </View>
                    ))}
                </PagerView>
            </View>
            <TableView>
                <Section>
                    <Cell title="Name" cellStyle="RightDetail" detail={car.data.name} />
                    <Cell title="Offer" cellStyle="RightDetail" detail={String(car.data.offer)} />
                    <Cell title="Owner" cellStyle="RightDetail" detail={ownerName} />
                    <Cell title="Year" cellStyle="RightDetail" detail={String(car.data.year)} />
                    <Cell title="Color" cellStyle="RightDetail" detail={car.data.color} />
                    <Cell title="Variant" cellStyle="RightDetail" detail={car.data.variant} />
                    <Cell title="Passing" cellStyle="RightDetail" detail={car.data.passing} />
                    <Cell title="Insurance" cellStyle="RightDetail" detail={car.data.insurance} />
                    <Cell title="KM" cellStyle="RightDetail" detail={String(car.data.km)} />
                </Section>
            </TableView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
