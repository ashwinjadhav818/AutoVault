import { Portal, Dialog, TextInput, HelperText, Button } from 'react-native-paper';

const EditPersonDialog = ({ 
    visible, 
    onDismiss, 
    name, 
    setName, 
    number, 
    setNumber, 
    checkNumber, 
    onSave 
}) => (
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
                <Button onPress={onSave}>Add</Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>
);

export default EditPersonDialog;
