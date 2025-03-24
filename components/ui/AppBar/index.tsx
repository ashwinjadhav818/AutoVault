import { Appbar } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";

interface AppBarProps {
    title: string;
    index?: number;
    carId?: string;
    personId?: string;
    rightItems?: Function;
}

export default function AppBar({
    title,
    carId,
    personId,
    rightItems,
}: AppBarProps) {
    const navigation = useNavigation();
    const route = useRoute();

    // Conditional rendering based on title
    const renderBackAction = () => {
        if (
            title !== "Home" &&
            title !== "Cars" &&
            title !== "People" &&
            title !== "Search" &&
            title !== "Account"
        ) {
            return <Appbar.BackAction onPress={() => navigation.goBack()} />;
        }
    };

    return (
        <Appbar.Header>
            {renderBackAction()}
            <Appbar.Content title={title} />

            {rightItems ? (
                <>
                    {carId == undefined &&
                        personId == undefined &&
                        rightItems()}
                    {carId !== undefined && rightItems(carId)}
                    {personId !== undefined && rightItems(personId)}
                </>
            ) : null}
        </Appbar.Header>
    );
}
