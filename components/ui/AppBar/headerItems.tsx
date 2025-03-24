import { useState } from "react";
import { Platform, View, Alert, PermissionsAndroid } from "react-native";
import { Appbar, Card, Menu } from "react-native-paper";
import PersonDialog from "../Dialogs/PersonDialog";
import DeleteDialog from "../Dialogs/DeleteDialog";
import { addPerson, deleteCar, deletePerson } from "@/hooks/handleFireStore";
import { router } from "expo-router";
import { selectContact } from "react-native-select-contact";
import { normalizePhoneNumber } from "@/hooks/helperFunctions";

const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

interface CarItemsProps {
    carId: string;
}

export function CarItems({ carId }: CarItemsProps) {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);

    const openMenu = () => setIsMenuVisible(true);
    const closeMenu = () => setIsMenuVisible(false);

    const handleEditCar = () => {
        closeMenu();
        router.push(`/cars/${carId}/edit`);
    };

    const handleDeleteCar = () => {
        closeMenu();
        setDeleteDialogVisible(true);
    };

    const confirmDelete = () => {
        setDeleteDialogVisible(false);
        deleteCar(carId);
        router.back();
    };

    return (
        <View>
            <Menu
                visible={isMenuVisible}
                onDismiss={closeMenu}
                anchorPosition="bottom"
                anchor={<Appbar.Action icon={MORE_ICON} onPress={openMenu} />}
            >
                <Menu.Item title="Edit" onPress={handleEditCar} />
                <Menu.Item title="Delete" onPress={handleDeleteCar} />
            </Menu>

            <DeleteDialog
                visible={isDeleteDialogVisible}
                onDismiss={() => setDeleteDialogVisible(false)}
                onConfirm={confirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this car?"
            />
        </View>
    );
}

export function PeopleItems() {
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const openMenu = () => setIsMenuVisible(true);
    const closeMenu = () => setIsMenuVisible(false);

    const importPerson = async () => {
        closeMenu();
        try {
            if (Platform.OS === "android") {
                const request = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                );

                if (
                    request === PermissionsAndroid.RESULTS.DENIED ||
                    request === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
                ) {
                    Alert.alert("Permission Denied");
                    return;
                }
            }

            const selection = await selectContact();
            if (selection && selection.phones && selection.phones.length > 0) {
                const contactName = selection.name || "";
                const selectedPhone = selection.phones[0];
                const normalizedNumber = normalizePhoneNumber(
                    selectedPhone.number,
                );
                await addPerson(contactName, normalizedNumber);
            } else {
                Alert.alert("No contact selected");
            }
        } catch (error) {
            console.error("Error selecting contact:", error);
        }
    };

    return (
        <Menu
            visible={isMenuVisible}
            onDismiss={closeMenu}
            anchorPosition="bottom"
            anchor={<Appbar.Action icon={MORE_ICON} onPress={openMenu} />}
        >
            <Menu.Item title="Import Person" onPress={importPerson} />
        </Menu>
    );
}

interface PersonItemsProps {
    personId: string;
}

export function PersonItems({ personId }: PersonItemsProps) {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isEditDialogVisible, setEditDialogVisible] = useState(false);
    const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);

    const openMenu = () => setIsMenuVisible(true);
    const closeMenu = () => setIsMenuVisible(false);

    const handleEditPerson = () => {
        closeMenu();
        setEditDialogVisible(true);
    };

    const handleDeletePerson = () => {
        closeMenu();
        setDeleteDialogVisible(true);
    };

    const confirmDelete = () => {
        setDeleteDialogVisible(false);
        deletePerson(personId);
        router.back();
    };

    return (
        <View>
            <Menu
                visible={isMenuVisible}
                onDismiss={closeMenu}
                anchorPosition="bottom"
                anchor={<Appbar.Action icon={MORE_ICON} onPress={openMenu} />}
            >
                <Menu.Item title="Edit" onPress={handleEditPerson} />
                <Menu.Item title="Delete" onPress={handleDeletePerson} />
            </Menu>

            <PersonDialog
                visible={isEditDialogVisible}
                onDismiss={() => setEditDialogVisible(false)}
                personId={personId}
            />

            <DeleteDialog
                visible={isDeleteDialogVisible}
                onDismiss={() => setDeleteDialogVisible(false)}
                onConfirm={confirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this person?"
            />
        </View>
    );
}
