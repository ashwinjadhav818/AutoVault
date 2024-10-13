import { View, StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import CarsList from "../components/CarsList";
import { useNavigation } from "@react-navigation/native";

export default Cars = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <CarsList />
            <FAB icon="plus" onPress={() => { navigation.navigate("AddCar") }} style={styles.fab} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
}) 
