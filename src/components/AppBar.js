import { useState } from 'react';
import { Appbar, Menu, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';
import { useRoute } from '@react-navigation/native';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { selectContact } from 'react-native-select-contact';
import { addPerson, deleteCar, deletePerson } from '../utils/handleFireStore';
import EditPersonDialog from './Popup/EditPersonDialog';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const AppBar = ({ title, index, carId, personId }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [visibleDialog, setVisibleDialog] = useState(false);

    const hideDialog = () => setVisibleDialog(false);

    // Access the name of the current screen/page
    const currentPageName = route.name;

    // Menu Control Variables
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    // Conditional rendering based on title
    const renderBackAction = () => {
        if (title !== "Home" && title !== "Cars" && title !== "People" && title !== "Search" && title !== "Account") {
            return <Appbar.BackAction onPress={() => navigation.goBack()} />;
        }
    };

    const handleDeleteCar = () => {
        deleteCar(carId);
        navigation.goBack();
    }

    const handleEditCar = () => {
        closeMenu();
        navigation.navigate("EditCar", { carId });
    }

    const handleEditPerson = () => {
        setVisibleDialog(true);
        closeMenu();
    }

    const handleDeletePerson = () => {
        deletePerson(personId);
        navigation.goBack();
    }

    const checkNumber = () => {
        return number.length !== 10;
    };

    const normalizePhoneNumber = (number) => {
        const cleanedNumber = number.replace(/\D/g, "");
        if (cleanedNumber.length === 10) {
            return cleanedNumber;
        } else if (cleanedNumber.length > 10) {
            return cleanedNumber.slice(-10);
        }
        return "";
    };

    const importPerson = async () => {
        closeMenu();
        try {
            if (Platform.OS === 'android') {
                const request = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                );

                if (request === PermissionsAndroid.RESULTS.DENIED ||
                    request === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    Alert.alert("Permission Denied");
                    return;
                }
            }

            const selection = await selectContact();
            if (selection && selection.phones && selection.phones.length > 0) {
                const contactName = selection.name || "";
                const selectedPhone = selection.phones[0];
                const normalizedNumber = normalizePhoneNumber(selectedPhone.number || "");
                await addPerson(contactName, normalizedNumber);
            } else {
                Alert.alert("No contact selected");
            }
        } catch (error) {
            console.error("Error selecting contact:", error);
        }
    };

    // Define menu items based on conditions
    const menuItems = [
        index === 2 ? { title: "Import Person", action: importPerson, icon: "import" } : null,
        currentPageName === "CarDetails" ? { title: "Edit Car", action: handleEditCar, icon: "clipboard-edit-outline" } : null,
        currentPageName === "CarDetails" ? { title: "Delete Car", action: handleDeleteCar, icon: "trash-can-outline" } : null,
        currentPageName === "Person" ? { title: "Edit Person", action: handleEditPerson, icon: "clipboard-edit-outline" } : null,
        currentPageName === "Person" ? { title: "Delete Person", action: handleDeletePerson, icon: "trash-can-outline" } : null,
    ].filter(item => item !== null); // Remove null items

    return (
        <Appbar.Header>
            {renderBackAction()}
            <Appbar.Content title={title} />
            {menuItems.length > 0 && (
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={<Appbar.Action icon={MORE_ICON} onPress={openMenu} />}
                    anchorPosition="bottom"
                >
                    {menuItems.map((item, index) => (
                        <Menu.Item
                            key={index}
                            leadingIcon={item.icon}
                            onPress={item.action}
                            title={item.title}
                        />
                    ))}
                </Menu>
            )}
            <EditPersonDialog
                visible={visibleDialog}
                onDismiss={hideDialog}
                name={name}
                setName={setName}
                number={number}
                setNumber={setNumber}
                checkNumber={checkNumber}
                onSave={handleEditPerson}
            />
        </Appbar.Header>
    );
};

export default AppBar;
