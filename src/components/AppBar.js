import { useState } from 'react';
import { Appbar, Menu, Portal, Dialog, TextInput, HelperText, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';
import { useRoute } from '@react-navigation/native';
import { handleSignOut } from '../utils/handleAuth';
import { Platform } from 'react-native';
import { deleteCar, deletePerson } from '../utils/handleFireStore';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const AppBar = ({ title, carId, personId }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [visibleDialog, setVisibleDialog] = useState(false);

    const hideDialog = () => setVisible(false);

    // Access the name of the current screen/page
    const currentPageName = route.name;

    // Menu Control Variables
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    // Conditional rendering based on title
    const renderBackAction = () => {
        if (title !== "Home" && title !== "Cars" && title !== "People" && title !== "Search") {
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
        if (number > 999999999 && number < 10000000000) {
            return false;
        } else {
            return true;
        }
    };

    return (
        <Appbar.Header>
            {renderBackAction()}
            <Appbar.Content title={title} />
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={<Appbar.Action icon={MORE_ICON} onPress={openMenu} />}
                anchorPosition="bottom"
            >
                {currentPageName === "CarDetails" ? <Menu.Item leadingIcon="clipboard-edit-outline" onPress={() => handleEditCar()} title="Edit Car" /> : null}
                {currentPageName === "CarDetails" ? <Menu.Item leadingIcon="trash-can-outline" onPress={() => handleDeleteCar()} title="Delete Car" /> : null}
                {currentPageName === "Person" ? <Menu.Item leadingIcon="clipboard-edit-outline" onPress={() => handleEditPerson()} title="Edit Person" /> : null}
                {currentPageName === "Person" ? <Menu.Item leadingIcon="trash-can-outline" onPress={() => handleDeletePerson()} title="Delete Person" /> : null}
                <Menu.Item leadingIcon="logout" onPress={() => handleSignOut(navigation)} title="Logout" />
            </Menu>
            <Portal>
                <Dialog visible={visibleDialog} onDismiss={hideDialog}>
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
                        <Button onPress={handleEditPerson}>Add</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* TODO: Add a search button to open search page. */}
        </Appbar.Header>
    );
};

export default AppBar;
