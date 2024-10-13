import { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, ActivityIndicator, Button, Dialog, Portal, TextInput, FAB } from "react-native-paper";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import AppBar from "../components/AppBar";
import CarsList from "../components/CarsList";
import { getPersonData, updatePerson } from "../utils/handleFireStore";

export default PersonDetails = ({ route }) => {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const { personId } = route.params;
    const [visible, setVisible] = useState(false);

    const hideDialog = () => setVisible(false);

    async function fetchData() {
        const personData = await getPersonData(personId);
        setName(personData.data.name);
        setNumber(personData.data.number);
    }
    const handleEditPerson = () => {
        if (name.trim() !== "" && number.trim().length === 10) {
            updatePerson(personId, name, number);
            setName(""); // Clear the name field after adding the person
            setNumber(""); // Clear the number field after adding the person
            hideDialog(); // Close the dialog after adding the person
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <AppBar title="Person Details" personId={personId} />

            <View style={styles.contentContainer}>
                <Text variant="titleMedium">Details</Text>
                <TableView>
                    <Section>
                        {name && number ? (
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
                        ) : (
                            <ActivityIndicator animating={true} />
                        )}
                    </Section>
                </TableView>

                <Text variant="titleMedium">Cars</Text>
                {name || number ? <CarsList personName={name} /> : <ActivityIndicator animating={true} />}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 8,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
