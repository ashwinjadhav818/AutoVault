import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import CarsList from "@/components/CarsList";
import PeopleList from "@/components/PeopleList";
import { Text } from "react-native-paper";
import { updateCarsData, updatePeopleData } from "@/hooks/handleFireStore";

export default function HomeScreen() {
    const [loading, setLoading] = useState(false);
    const handleRefresh = () => {
        setLoading(true);
        updateCarsData();
        updatePeopleData();
        setLoading(false);
    };

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={() => handleRefresh()}
                />
            }
        >
            <Text variant="titleMedium" style={styles.heading}>
                Cars
            </Text>
            <CarsList limit={5} />

            <Text variant="titleMedium" style={styles.heading}>
                People
            </Text>
            <PeopleList limit={2} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    heading: {
        marginTop: 4,
        marginHorizontal: 10,
    },
});
