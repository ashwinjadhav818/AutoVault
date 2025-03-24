import { Button, Dialog, Portal, Text } from 'react-native-paper';

interface DeleteDialogProps {
    visible: boolean;
    onDismiss: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export default function DeleteDialog({
    visible,
    onDismiss,
    onConfirm,
    title,
    message,
}: DeleteDialogProps) {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">{message}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Cancel</Button>
                    <Button onPress={onConfirm}>Delete</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}
