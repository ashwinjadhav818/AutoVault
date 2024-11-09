// AddPersonDialog.js
import React, { useState } from "react";
import { Button, Dialog, Portal, TextInput, HelperText } from "react-native-paper";
import { addPerson } from "../../utils/handleFireStore";

const AddPersonDialog = ({ visible, onDismiss, refreshPeopleList }) => {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");

    const handleAddPerson = () => {
        if (name.trim() !== "" && number.trim().length === 10) {
            addPerson(name, number);
            setName(""); // Clear the name field after adding the person
            setNumber(""); // Clear the number field after adding the person
            onDismiss(); // Close the dialog after adding the person
            refreshPeopleList(); // Trigger a refresh of the PeopleList
        }
    };

    const checkNumber = () => {
        return number.length > 0 && number.length !== 10;
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>Add Person</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label="Name"
                        value={name}
                        mode="outlined"
                        onChangeText={setName}
                    />
                    <TextInput
                        label="Number"
                        value={number}
                        mode="outlined"
                        onChangeText={setNumber}
                        inputMode="numeric"
                    />
                    <HelperText type="error" visible={checkNumber()}>
                        Phone number should have 10 numbers.
                    </HelperText>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Discard</Button>
                    <Button onPress={handleAddPerson}>Add</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default AddPersonDialog;
