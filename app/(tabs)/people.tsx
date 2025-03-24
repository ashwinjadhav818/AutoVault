import React, { useState } from "react";
import { View, ScrollView, RefreshControl, StyleSheet } from "react-native";
import PeopleList from "@/components/PeopleList";
import { updatePeopleData } from "@/hooks/handleFireStore";
import { FAB } from "react-native-paper";
import PersonDialog from "@/components/ui/Dialogs/PersonDialog"; // Import the PersonDialog

export default function PeopleScreen() {
    const [loading, setLoading] = useState(false);
    const [isAddDialogVisible, setAddDialogVisible] = useState(false);

    const handleRefresh = () => {
        setLoading(true);
        updatePeopleData();
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={() => handleRefresh()}
                    />
                }
            >
                <PeopleList />
            </ScrollView>

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => setAddDialogVisible(true)}
            />
            <PersonDialog
                visible={isAddDialogVisible}
                onDismiss={() => setAddDialogVisible(false)}
                refreshPeopleList={handleRefresh}
            />
        </View>
    );
}

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
