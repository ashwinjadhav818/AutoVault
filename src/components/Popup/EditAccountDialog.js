// ProfileEditPopup.js
import React, { useState } from "react";
import { Dialog, Portal, TextInput, Button, HelperText } from "react-native-paper";
import { Alert } from "react-native";
import { handleEditAccount } from "../../utils/handleAuth";
import { auth } from "../../../firebase";

export default EditAccountPopup = ({ visible, onDismiss, fetchUserData }) => {
    const [displayName, setDisplayName] = useState(auth.currentUser.displayName || "");
    const [email, setEmail] = useState(auth.currentUser.email || "");
    const [photoURL, setPhotoURL] = useState(auth.currentUser.photoURL || "");
    const [emailError, setEmailError] = useState("");

    const handleSave = async () => {
        try {
            await handleEditAccount(displayName, email, photoURL, setEmailError);
            onDismiss(); // Close the popup
            fetchUserData(); // Refresh the user data
        } catch (error) {
            Alert.alert("Error", "Could not update profile. Please try again.");
        }
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>Edit Profile</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label="Name"
                        value={displayName}
                        onChangeText={setDisplayName}
                        mode="outlined"
                    />
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        error={!!emailError}
                    />
                    <HelperText type="error" visible={!!emailError}>
                        {emailError}
                    </HelperText>
                    <TextInput
                        label="Photo URL"
                        value={photoURL}
                        onChangeText={setPhotoURL}
                        mode="outlined"
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Cancel</Button>
                    <Button onPress={handleSave}>Save</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};
