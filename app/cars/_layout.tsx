import AppBar from "@/components/ui/AppBar";
import { CarItems } from "@/components/ui/AppBar/headerItems";
import { Stack, useLocalSearchParams } from "expo-router";

export default function CarsLayout() {
    const { id } = useLocalSearchParams();

    return (
        <Stack>
            <Stack.Screen
                name="[id]/index"
                options={{
                    header: () => (
                        <AppBar
                            title="Car Details"
                            carId={id as string}
                            rightItems={(carId: string) => <CarItems carId={carId} />}
                        />
                    ),
                }}
            />
            <Stack.Screen name="[id]/edit" options={{
                header: () => <AppBar title="Edit Car" />
            }} />
            <Stack.Screen name="new" options={{ header: () => <AppBar title="New Car" /> }} />
        </Stack>
    );
}
