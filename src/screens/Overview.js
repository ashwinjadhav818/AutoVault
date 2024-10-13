import { StyleSheet, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import CarsList from "../components/CarsList";
import PeopleList from "../components/PeopleList";

export default Page = () => {
    return (
        <ScrollView>
            <Text variant="titleMedium" style={styles.heading}>Cars</Text>
            <CarsList limit={5} />
            <Text variant="titleMedium" style={styles.heading}>People</Text>
            <PeopleList limit={5} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    heading: {
        marginHorizontal: 12,
    }
})
