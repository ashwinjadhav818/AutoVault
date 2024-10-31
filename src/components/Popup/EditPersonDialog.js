import { Portal, Dialog, TextInput, HelperText, Button } from 'react-native-paper';
import { editPerson, getPersonData } from '../../utils/handleFireStore';
import { useState, useEffect } from 'react';

const EditPersonDialog = ({
    personId,
    visible,
    onDismiss,
    hideDialog
}) => {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");

    const handleGetPersonData = async () => {
        const person = await getPersonData(personId);
        setName(person.data.name);
        setNumber(person.data.number);
    }

    useEffect(() => {
        if (visible) {
            handleGetPersonData();
        }
    }, [visible]);

    const handleOnSave = async () => {
        hideDialog();
        await editPerson(personId, name, number);
    }

    const checkNumber = () => {
        return number.length > 0 && number.length !== 10;
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>Edit Person</Dialog.Title>
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
                    />
                    <HelperText type="error" visible={checkNumber()}>
                        Phone number should have 10 numbers.
                    </HelperText>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Discard</Button>
                    <Button onPress={handleOnSave} disabled={checkNumber()}>Save</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default EditPersonDialog;
