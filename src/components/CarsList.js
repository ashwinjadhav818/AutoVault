import { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, Chip, ActivityIndicator } from 'react-native-paper';
import { getCarsData, subscribeToCarsDataChanges } from "../utils/handleFireStore";
import { useNavigation } from '@react-navigation/core';

const CarsList = ({ limit, personId, query }) => {
    const navigation = useNavigation();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async (refresh) => {
        setLoading(true);

        let carsData = await getCarsData(refresh);

        // Apply limit if provided
        if (limit) carsData = carsData.slice(0, limit);

        // Filter by owner if personId is provided
        if (personId) carsData = carsData.filter(car => car.data.owner === personId);

        // Filter by query if provided
        if (query) carsData = carsData.filter(car => car.data.name.toLowerCase().includes(query.toLowerCase()));

        setCars(carsData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [query, personId]);

    useEffect(() => subscribeToCarsDataChanges(() => fetchData(true)), []);

    if (loading) return <ActivityIndicator animating={true} />;

    return (
        <View style={limit === 0 ? styles.container : null}>
            <ScrollView refreshControl={limit !== 0 && <RefreshControl refreshing={loading} onRefresh={() => fetchData(true)} />}>
                {cars.length === 0 ? <Text>No cars found.</Text> :
                    cars.map((car) => (
                        <Card style={styles.cards} key={car.id} onPress={() => navigation.navigate('CarDetails', { carId: car.id })}>
                            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                            <Card.Title title={car.data.name} subtitle={`Offer: ${car.data.offer}`} />
                            <Card.Content>
                                <ScrollView horizontal>
                                    {["year", "color", "variant", "passing", "insurance", "km", "owner"].map(attr => (
                                        <Chip key={attr} style={styles.chip}>
                                            {`${attr.charAt(0).toUpperCase() + attr.slice(1)}: ${car.data[attr]}`}
                                        </Chip>
                                    ))}
                                </ScrollView>
                            </Card.Content>
                        </Card>
                    ))
                }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { height: "auto" },
    cards: { margin: 10 },
    chip: { marginHorizontal: 4 },
});

export default CarsList;
