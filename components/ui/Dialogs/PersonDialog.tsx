import React, { useState, useEffect } from "react";
import { Button, Dialog, Portal, TextInput, HelperText } from "react-native-paper";
import { addPerson, editPerson, getPersonData } from "@/hooks/handleFireStore";

interface PersonDialogProps {
    visible: boolean;
    onDismiss: () => void;
    personId?: string;
    refreshPeopleList?: () => void;
    hideDialog?: () => void;
}

export default function PersonDialog({ visible, onDismiss, personId, refreshPeopleList, hideDialog }: PersonDialogProps) {
    const [name, setName] = useState<string>("");
    const [number, setNumber] = useState<string>("");
    const [isEditMode, setIsEditMode] = useState<boolean>(!!personId);

    useEffect(() => {
        const fetchPersonData = async () => {
            if (personId) {
                const person = await getPersonData(personId);
                if (person) {
                    setName(person.data.name);
                    setNumber(person.data.number);
                }
            } else {
                setName("");
                setNumber("");
            }
        };

        if (visible) {
            fetchPersonData();
        }
    }, [visible, personId]);

    const handleAction = async () => {
        if (name.trim() !== "" && number.trim().length === 10) {
            if (isEditMode && personId) {
                await editPerson(personId, name, number);
                if (hideDialog) {
                    hideDialog();
                }
            } else {
                await addPerson(name, number);
                if (refreshPeopleList) {
                    refreshPeopleList();
                }
            }
            onDismiss();
        }
    };

    const checkNumber = () => {
        return number.length > 0 && number.length !== 10;
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>{isEditMode ? "Edit Person" : "Add Person"}</Dialog.Title>
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
                    {checkNumber() && (
                        <HelperText type="error">
                            Phone number should have 10 numbers.
                        </HelperText>
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Discard</Button>
                    <Button onPress={handleAction} disabled={checkNumber()}>
                        {isEditMode ? "Save" : "Add"}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

