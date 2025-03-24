import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import {
    getPersonData,
    subscribeToPeopleDataChanges,
    getPeopleData,
} from "@/hooks/handleFireStore";
import { useLocalSearchParams } from "expo-router";
import CarsList from "@/components/CarsList";

export default function PersonDetails() {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [loading, setLoading] = useState(true);
    const params = useLocalSearchParams();
    const personId = params.id as string;

    const fetchData = async () => {
        setLoading(true);
        try {
            await getPeopleData(false);
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 8,
    },
});
