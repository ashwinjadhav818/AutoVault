import { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, Chip, ActivityIndicator } from 'react-native-paper';
import { getCarsData,subscribeToCarsDataChanges } from "../utils/handleFireStore";
import { useNavigation } from '@react-navigation/core';

const CarsList = ({ limit, personName }) => {
    const navigation = useNavigation();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async (refresh=false) => {
      setLoading(true);
      let carsData = await getCarsData(refresh);
      if (limit) {
        carsData = carsData.slice(0, limit);
      }
      if (personName) {
        carsData = carsData.filter(car => car.data.owner === personName);
      }
      
      // Merge the existing car data with the updated data
      const updatedCars = [...cars, ...carsData];
      
      // Remove any duplicate records based on the car ID
      const uniqueCars = updatedCars.reduce((unique, car) => {
        if (!unique.some(c => c.id === car.id)) {
          unique.push(car);
        }
        return unique;
      }, []);
      
      setCars(uniqueCars);
      setLoading(false);
    }

    useEffect(() => {
        setCars([]);
        fetchData();
    }, []);

    useEffect(() => {
      const unsubscribe = subscribeToCarsDataChanges(() => {
        setCars([]);
        fetchData(true);
      });
    
      return () => {
        unsubscribe();
      };
    }, []);

    const handleCardPress = (carId) => {
        navigation.navigate('CarDetails', { carId });
    };

    const onRefresh = () => {
        setCars([]);
        fetchData(refresh=true);
    };

    if (loading) {
        return <ActivityIndicator animating={true} />;
    } 

    return (
        <View style={limit === 0 ? styles.container : null}>
            <ScrollView refreshControl={limit != 0 ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : null }
        >
                {cars.length == 0 ? <Text>No cars found.</Text> :
                    cars.map((car) => (
                        <Card style={styles.cards} key={car.id} onPress={() => handleCardPress(car.id)}>
                            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                            <Card.Title title={car.data.name} subtitle={`Offer: ${car.data.offer}`} />
                            <Card.Content>
                                <ScrollView horizontal={true}>
                                    <Chip onPress={() => { }} style={styles.chip}>{`Year: ${car.data.year}`}</Chip>
                                    <Chip onPress={() => { }} style={styles.chip}>{`Color: ${car.data.color}`}</Chip>
                                    <Chip onPress={() => { }} style={styles.chip}>{`Varient: ${car.data.varient}`}</Chip>
                                    <Chip onPress={() => { }} style={styles.chip}>{`Passing: ${car.data.passing}`}</Chip>
                                    <Chip onPress={() => { }} style={styles.chip}>{`Insurance: ${car.data.insurance}`}</Chip>
                                    <Chip onPress={() => { }} style={styles.chip}>{`KM: ${car.data.km}km`}</Chip>
                                    <Chip onPress={() => { }} style={styles.chip}>{`Owner/Dealer: ${car.data.owner}`}</Chip>
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
    container: {
        height: "auto"
    },
    cards: {
        margin: 10,
    },
    chip: {
        marginHorizontal: 4
    },
    noCars: {
        color: "darkGray",
        align: "center"
    }
});

export default CarsList;
