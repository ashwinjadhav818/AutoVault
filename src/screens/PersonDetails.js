import { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import AppBar from "../components/AppBar";
import CarsList from "../components/CarsList";
import { getPersonData, subscribeToPeopleDataChanges, getPeopleData } from "../utils/handleFireStore";

export default PersonDetails = ({ route }) => {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [loading, setLoading] = useState(true);
    const { personId } = route.params;

    const fetchData = async () => {
        setLoading(true);
        try {
            await getPeopleData(); // Ensure people data is fetched first
            const person = await getPersonData(personId);

            if (person) {
                setName(person.data.name);
                setNumber(person.data.number);
            } else {
                console.warn("No person data found for ID:", personId);
                setName("");
                setNumber("");
            }
        } catch (error) {
            console.error("Error fetching person data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [personId]);

    useEffect(() => {
        const unsubscribe = subscribeToPeopleDataChanges(fetchData);
        return () => unsubscribe();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <AppBar title="Person Details" personId={personId} />

            <View style={styles.contentContainer}>
                <Text variant="titleMedium">Details</Text>
                <TableView>
                    <Section>
                        {loading ? (
                            <ActivityIndicator animating={true} />
                        ) : (
                            <>
                                <Cell
                                    cellStyle="RightDetail"
                                    title="Name"
                                    detail={name}
                                />
                                <Cell
                                    cellStyle="RightDetail"
                                    title="Phone Number"
                                    detail={number}
                                />
                            </>
                        )}
                    </Section>
                </TableView>

                <Text variant="titleMedium">Cars</Text>
                {loading ? (
                    <ActivityIndicator animating={true} />
                ) : (
                    <CarsList personId={personId} />
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 8,
    },
});
