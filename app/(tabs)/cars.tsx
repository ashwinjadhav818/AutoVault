import { useState } from "react";
import { router } from "expo-router";
import { RefreshControl, ScrollView, View, StyleSheet } from "react-native";
import CarsList from "@/components/CarsList";
import { updateCarsData } from "@/hooks/handleFireStore";
import { FAB } from "react-native-paper";

export default function CarsPage() {
    const [loading, setLoading] = useState(false);

    const handleRefresh = () => {
        setLoading(true);
        updateCarsData();
        setLoading(false);
    };

    const handleAddCar = () => {
        router.navigate("/cars/new");
    }

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
                }
            >
                <CarsList />
            </ScrollView>
            <FAB icon="plus" style={styles.fab} onPress={() => handleAddCar()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

