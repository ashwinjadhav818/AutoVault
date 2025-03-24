import React, { FC, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
    getPeopleData,
    subscribeToPeopleDataChanges,
} from "@/hooks/handleFireStore";
import { Text, ActivityIndicator, List } from "react-native-paper";
import { router } from "expo-router";

interface PeopleListProps {
    limit?: number;
    query?: string;
}

interface People {
    id: string;
    data: {
        name: string;
        number: string;
    };
}

export default function PeopleList({ limit, query }: PeopleListProps) {
    const [people, setPeople] = useState<People[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async (refresh: boolean) => {
        setLoading(true);
        try {
            let peopleData = await getPeopleData(refresh);

            if (limit) peopleData = peopleData.slice(0, limit);
            if (query) {
                const lowercaseQuery = query.toLowerCase();
                peopleData = peopleData.filter((person) =>
                    person.data.name.toLowerCase().includes(lowercaseQuery),
                );
            }

            const uniquePeople = peopleData.filter(
                (person, index, self) =>
                    index === self.findIndex((p) => p.id === person.id),
            );

            setPeople(uniquePeople);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching people data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(true);
    }, [query]);

    useEffect(() => {
        const unsubscribe = subscribeToPeopleDataChanges(() => fetchData(true));
        return () => unsubscribe();
    }, []);

    if (loading)
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} />
            </View>
        );

    const handlePersonPress = (id: string) => {
        router.navigate(`/people/${id}`);
    };

    return (
        <View>
            {people.length === 0 ? (
                <Text>No people found.</Text>
            ) : (
                people.map((person) => (
                    <List.Item
                        key={person.id}
                        title={person.data.name}
                        onPress={() => handlePersonPress(person.id)}
                    />
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
