import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import PeopleList from "../components/PeopleList";
import AddPersonDialog from "../components/Popup/AddPersonDialog"; // Import the new dialog component

const People = () => {
    const [visible, setVisible] = useState(false);

    const hideDialog = () => {
        setVisible(false);
    };

    const [refreshKey, setRefreshKey] = useState(0); // State to force refresh

    const refreshPeopleList = () => {
        setRefreshKey(prevKey => prevKey + 1); // Update the key to force a re-render
    };

    return (
        <View style={styles.container}>
            <PeopleList key={refreshKey} refreshPeopleList={refreshPeopleList} />

            <AddPersonDialog
                visible={visible}
                onDismiss={hideDialog}
                refreshPeopleList={refreshPeopleList}
            />

            <FAB icon="plus" onPress={() => setVisible(true)} style={styles.fab} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default People;
