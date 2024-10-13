import { useState, useEffect } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { Text, ActivityIndicator, List } from "react-native-paper";
import { auth } from '../../firebase';
import { getPeopleData, subscribeToPeopleDataChanges } from "../utils/handleFireStore";
import { useNavigation } from "@react-navigation/native";

const PeopleList = () => {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const userId = auth.currentUser.uid;
    const navigation = useNavigation();

    const fetchData = async (refresh = false) => {
        setLoading(true);
        setPeople([]);
        const peopleData = await getPeopleData(userId);

        // Merge the existing people data with the updated data
        const updatedPeople = [...people, ...peopleData];

        // Remove any duplicate records based on the person ID
        const uniquePeople = updatedPeople.reduce((unique, person) => {
            if (!unique.some(c => c.id === person.id)) {
                unique.push(person);
            }
            return unique;
        }, []);

        setPeople(uniquePeople);
        setLoading(false);
    }

    useEffect(() => {
        setPeople([]);
        fetchData();
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToPeopleDataChanges(() => {
        setPeople([]);
            fetchData(true);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleListPress = (personId) => {
        navigation.navigate('Person', { personId });
    };

    const onRefresh = () => {
        fetchData(refresh = true);
    };

    if (loading) {
        return <ActivityIndicator animating={true} />;
    }
    return (
        <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            {people.length == 0 ? <Text>No people found.</Text> :
                people.map((person) => (
                    <List.Item
                        title={person.data.name}
                        key={person.id}
                        onPress={() => handleListPress(person.id)}
                    />
                ))}
        </ScrollView>
    )
}

export default PeopleList;
