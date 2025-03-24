import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Searchbar, Chip } from "react-native-paper";
import CarsList from "@/components/CarsList";
import PeopleList from "@/components/PeopleList";

export default function Search() {
    const [searchQuery, setSearchQuery] = useState("");
    const [onlyCars, setOnlyCars] = useState(false);
    const [onlyPeople, setOnlyPeople] = useState(false);

    const handleCarsChip = () => {
        setOnlyCars((prev) => !prev);
        setOnlyPeople(false);
    };

    const handlePeopleChip = () => {
        setOnlyPeople((prev) => !prev);
        setOnlyCars(false);
    };

    return (
        <ScrollView>
            <Searchbar
                placeholder="Search"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchbar}
            />
            <View style={styles.chipContainer}>
                <Chip
                    icon="car"
                    style={styles.chip}
                    onPress={handleCarsChip}
                    selected={onlyCars}
                    showSelectedOverlay={true}
                >
                    Cars
                </Chip>
                <Chip
                    icon="card-account-details-outline"
                    style={styles.chip}
                    onPress={handlePeopleChip}
                    selected={onlyPeople}
                    showSelectedOverlay={true}
                >
                    People
                </Chip>
            </View>

            {!onlyPeople && (
                <>
                    <Text variant="titleMedium" style={styles.heading}>
                        Cars
                    </Text>
                    <CarsList
                        query={searchQuery}
                        limit={searchQuery === "" ? 5 : undefined}
                    />
                </>
            )}

            {!onlyCars && (
                <>
                    <Text variant="titleMedium" style={styles.heading}>
                        People
                    </Text>
                    <PeopleList
                        query={searchQuery}
                        limit={searchQuery === "" ? 5 : undefined}
                    />
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    searchbar: {
        margin: 10,
        marginBottom: 12,
        borderRadius: 12,
    },
    heading: {
        marginHorizontal: 12,
    },
    chipContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginHorizontal: 8,
    },
    chip: {
        marginHorizontal: 4,
    },
});
