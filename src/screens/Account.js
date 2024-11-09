import { useState, useEffect } from "react";
import { Button, ActivityIndicator } from "react-native-paper";
import EditAccountDialog from "../components/Popup/EditAccountDialog";
import { auth } from "../../firebase";
import { Cell, Section, TableView } from "react-native-tableview-simple";
import { StyleSheet } from "react-native";
import { handleSignOut } from "../utils/handleAuth";

export default Account = () => {
    const [user, setUser] = useState(null);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const showPopup = () => setVisible(true);
    const hidePopup = () => setVisible(false);

    const fetchUserData = async () => {
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
        fetchUserData();
    }, []); // Only run once when the component mounts

    if (loading) return <ActivityIndicator animating={true} />;

    return (
        <>
            {user ? (
                <>
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
                </>
            ) : null}

            <Button onPress={showPopup} contentStyle={styles.buttonContent}>Edit Account</Button>
            <Button onPress={() => handleSignOut()} contentStyle={styles.buttonContent} textColor="#ff0f0f">Logout</Button>
            <EditAccountDialog visible={visible} onDismiss={hidePopup} fetchUserData={fetchUserData} />
        </>
    );
}

const styles = StyleSheet.create({
    buttonContent: {
        flexDirection: "row",
        justifyContent: "flex-start",
    },
});
