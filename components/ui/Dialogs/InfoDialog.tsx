import { Dialog, Portal, Text, Button } from "react-native-paper";

interface InfoDialogProps {
    visible: boolean;
    onDismiss: () => void;
    title: string;
    message: string;
    buttonLabel?: string;
}

export default function InfoDialog({
    visible,
    onDismiss,
    title,
    message,
    buttonLabel = "OK",
}: InfoDialogProps) {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    <Text>{message}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>{buttonLabel}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

