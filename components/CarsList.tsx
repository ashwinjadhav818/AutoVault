import { useEffect, useState } from "react";
import { router } from "expo-router";
import { View, ScrollView, Pressable, StyleSheet, Image } from "react-native";
import {
    getCarsData,
    getPersonData,
    subscribeToCarsDataChanges,
} from "@/hooks/handleFireStore";
import { Text, Card, Chip, ActivityIndicator } from "react-native-paper";
import { CarType } from "@/types/types";

interface Car {
    id: string;
    data: CarType;
}

interface CarsListProps {
    limit?: number;
    personId?: string;
    query?: string;
}

export default function CarsList({ limit, personId, query }: CarsListProps) {
    const [cars, setCars] = useState<Car[]>([]);
    const [owners, setOwners] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async (refresh: boolean) => {
        setLoading(true);
        try {
            let carsData = await getCarsData(refresh);

            carsData = carsData.filter(
                (car, index, self) =>
                    index === self.findIndex((c) => c.id === car.id),
            );

            if (limit) carsData = carsData.slice(0, limit);
            if (personId)
                carsData = carsData.filter(
                    (car) => car.data.owner === personId,
                );
            if (query)
                carsData = carsData.filter((car) =>
                    car.data.name.toLowerCase().includes(query.toLowerCase()),
                );

            const ownersData = await Promise.all(
                carsData.map(async (car) => {
                    try {
                        const ownerData = await getPersonData(car.data.owner);
                        return {
                            carId: car.id,
                            ownerName: ownerData
                                ? ownerData.data.name
                                : "Unknown Owner",
                        };
                    } catch (ownerError) {
                        console.error("Error getting owner data:", ownerError);
                        return { carId: car.id, ownerName: "Unknown Owner" };
                    }
                }),
            );

            const ownersMap = ownersData.reduce<{ [key: string]: string }>(
                (acc, { carId, ownerName }) => {
                    acc[carId] = ownerName;
                    return acc;
                },
                {},
            );

            setCars(carsData);
            setOwners(ownersMap);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching cars data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(false);

        const unsubscribe = subscribeToCarsDataChanges(() => fetchData(true));

        return () => unsubscribe();
    }, [query, personId]);

    if (loading)
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} />
            </View>
        );

    const handleCarPress = (id: string) => {
        router.navigate(`/cars/${id}`);
    };

    return (
        <View>
            {cars.length === 0 ? (
                <Text>No cars found.</Text>
            ) : (
                cars.map((car) => (
                    <Card key={car.id} style={styles.cards}>
                        <Pressable
                            android_ripple={{ radius: 256, borderless: true }}
                            onPress={() => {
                                handleCarPress(car.id);
                            }}
                        >
                            <Image
                                source={{ uri: "https://picsum.photos/700" }}
                                style={styles.image}
                            />
                            <View style={styles.infoContainer}>
                                <Text variant="headlineMedium">
                                    {car.data.name}
                                </Text>
                                <Text>{car.data.offer}</Text>

                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.chipContainer}
                                    scrollEnabled={true}
                                >
                                    <View style={styles.chipRow}>
                                        {[
                                            "year",
                                            "color",
                                            "variant",
                                            "passing",
                                            "insurance",
                                            "km",
                                        ].map((attr) => (
                                            <Chip
                                                key={attr}
                                                style={styles.chip}
                                            >
                                                {`${attr.charAt(0).toUpperCase() + attr.slice(1)}: ${car.data[attr as keyof typeof car.data]}`}
                                            </Chip>
                                        ))}
                                        <Chip style={styles.chip}>
                                            Owner: {owners[car.id] || "Unknown"}
                                        </Chip>
                                    </View>
                                </ScrollView>
                            </View>
                        </Pressable>
                    </Card>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    cards: { margin: 10 },
    infoContainer: { paddingHorizontal: 15 },
    chipContainer: {
        flex: 999,
        marginVertical: 8,
        marginBottom: 10,
        marginLeft: -4,
        borderRadius: 8,
    },
    chip: { marginHorizontal: 4 },
    chipRow: { flexDirection: "row" },
    image: { marginBottom: 8, height: 180, width: "100%", borderRadius: 8 },
});
