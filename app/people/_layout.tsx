import AppBar from "@/components/ui/AppBar";
import { PersonItems } from "@/components/ui/AppBar/headerItems";
import { Stack, useLocalSearchParams } from "expo-router";

export default function PeopleLayout() {
    const { id } = useLocalSearchParams();

    return (
        <Stack>
            <Stack.Screen
                name="[id]"
                options={{
                    header: () => (
                        <AppBar
                            title="Person Details"
                            personId={id as string}
                            rightItems={(personId: string) => (
                                <PersonItems personId={personId} />
                            )}
                        />
                    ),
                }}
            />
        </Stack>
    );
}
