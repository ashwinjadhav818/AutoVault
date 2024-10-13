import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Dialog, Portal, TextInput, FAB, HelperText } from 'react-native-paper';
import { addPerson } from "../utils/handleFireStore";
import PeopleList from "../components/PeopleList";

const People = () => {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [visible, setVisible] = useState(false);

    const hideDialog = () => setVisible(false);

    const handleAddPerson = () => {
        if (name.trim() !== "" && number.trim().length === 10) {
            addPerson(name, number);
            setName(""); // Clear the name field after adding the person
            setNumber(""); // Clear the number field after adding the person
            hideDialog(); // Close the dialog after adding the person
            refreshPeopleList(); // Trigger a refresh of the PeopleList
        }
    }

    const [refreshKey, setRefreshKey] = useState(0); // State to force refresh

    const refreshPeopleList = () => {
        setRefreshKey(prevKey => prevKey + 1); // Update the key to force a re-render
    };

    const checkNumber = () => {
        if (number > 999999999 && number < 10000000000) {
            return false;
        } else {
            return true;
        }
    };

    return (
        <View style={styles.container}>

            <PeopleList key={refreshKey} refreshPeopleList={refreshPeopleList} />

            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Add Person</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Name"
                            value={name}
                            mode="outlined"
                            onChangeText={name => setName(name)}
                        />
                        <TextInput
                            label="Number"
                            value={number}
                            mode="outlined"
                            onChangeText={number => setNumber(number)}
                        />
                        <HelperText type="error" visible={checkNumber()}>
                            Phone number should have 10 numbers.
                        </HelperText>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Discard</Button>
                        <Button onPress={handleAddPerson}>Add</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <FAB icon="plus" onPress={() => setVisible(true)} style={styles.fab} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default People;
