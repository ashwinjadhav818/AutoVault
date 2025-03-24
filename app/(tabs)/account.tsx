import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { TableView, Cell, Section } from "react-native-tableview-simple";
import { auth } from "@/firebase";
import { handleSignOut } from "@/hooks/handleAuth";
import EditAccountDialog from "@/components/ui/Dialogs/EditAccountDialog";

interface UserData {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

export default function Account() {
    const [user, setUser] = useState<UserData>({
        displayName: null,
        email: null,
        photoURL: null,
    });
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const showPopup = () => setVisible(true);
    const hidePopup = () => setVisible(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUser({
                    displayName: currentUser.displayName,
                    email: currentUser.email,
                    photoURL: currentUser.photoURL,
                });
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <ActivityIndicator animating={true} />;

    return (
        <ScrollView>
            <TableView>
                <Section>
                    <Cell
                        cellStyle="RightDetail"
                        title="Name"
                        detail={user.displayName || "N/A"}
                    />
                    <Cell
                        cellStyle="RightDetail"
                        title="Email"
                        detail={user.email || "N/A"}
                    />
                </Section>
            </TableView>

            <View style={styles.buttonContainer}>
                <Button onPress={showPopup} style={styles.button}>Edit Account</Button>
                <Button mode="contained-tonal" onPress={() => handleSignOut()} style={styles.button}>Logout</Button>
            </View>
            <EditAccountDialog visible={visible} onDismiss={hidePopup} fetchData={fetchData} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
    },
    button: {
        borderRadius: 8,
        marginHorizontal: 8,
    }
});
