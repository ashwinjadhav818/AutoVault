import { useState, useEffect } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { Text, ActivityIndicator, List } from "react-native-paper";
import { getPeopleData, subscribeToPeopleDataChanges } from "../utils/handleFireStore";
import { useNavigation } from "@react-navigation/native";

const PeopleList = ({ query }) => {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const fetchData = async (refresh) => {
        setLoading(true);
        let peopleData = await getPeopleData(refresh);

        if (query) {
            const lowercaseQuery = query.toLowerCase();
            peopleData = peopleData.filter(person => 
                person.data.name.toLowerCase().includes(lowercaseQuery)
            );
        }

        const uniquePeople = peopleData.filter((person, index, self) =>
            index === self.findIndex(p => p.id === person.id)
        );

        setPeople(uniquePeople);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [query]);

    useEffect(() => {
        const unsubscribe = subscribeToPeopleDataChanges(() => fetchData(true));
        return () => unsubscribe();
    }, []);

    if (loading) return <ActivityIndicator animating={true} />;

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchData(true)} />}>
            {people.length === 0 ? (
                <Text>No people found.</Text>
            ) : (
                people.map(person => (
                    <List.Item
                        title={person.data.name}
                        key={person.id}
                        onPress={() => navigation.navigate('Person', { personId: person.id })}
                    />
                ))
            )}
        </ScrollView>
    );
};

export default PeopleList;
