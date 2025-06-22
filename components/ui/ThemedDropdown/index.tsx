import React from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTheme } from 'react-native-paper';
import { MD3Theme } from 'react-native-paper';

interface DropdownData {
    label: string;
    value: string;
}

interface ThemedDropdownProps {
    data: DropdownData[];
    value: string;
    placeholder: string;
    onChange: (item: DropdownData) => void;
    isFocus: boolean;
    setIsFocus: (isFocused: boolean) => void;
}

export function ThemedDropdown({ data, value, placeholder, onChange, isFocus, setIsFocus }: ThemedDropdownProps) {
    const theme = useTheme() as MD3Theme;

    const themedStyles = getThemedStyles(theme);

    console.log(theme.colors)

    return (
        <Dropdown
            style={[themedStyles.dropdown, isFocus && { borderColor: theme.colors.primary }]} // Use theme.colors.primary for focus
            placeholderStyle={themedStyles.placeholderStyle}
            selectedTextStyle={themedStyles.selectedTextStyle}
            inputSearchStyle={themedStyles.inputSearchStyle}
            iconStyle={themedStyles.iconStyle}
            activeColor={theme.colors.elevation.level3}
            maxHeight={300}
            labelField="label"
            valueField="value"
            data={data}
            search
            placeholder={placeholder}
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={onChange}
            containerStyle={themedStyles.dropdownContainer}
            itemTextStyle={themedStyles.itemTextStyle}
        // Optional: You might want to theme the dropdown's overlay
        // flatListProps={{ style: { backgroundColor: theme.colors.surface } }} // Example for FlatList in dropdown
        // renderLeftIcon={() => ( // Example of a themed icon
        //     <MaterialCommunityIcons
        //         style={themedStyles.icon}
        //         color={isFocus ? theme.colors.primary : theme.colors.onSurfaceVariant}
        //         name="account"
        //         size={20}
        //     />
        // )}
        />
    );
};

const getThemedStyles = (theme: MD3Theme) =>
    StyleSheet.create({
        dropdown: {
            height: 50,
            borderColor: theme.colors.outline,
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 8,
            marginVertical: 6,
            backgroundColor: theme.colors.background,
        },
        placeholderStyle: {
            fontSize: 16,
            color: theme.colors.onSurfaceVariant,
        },
        selectedTextStyle: {
            fontSize: 16,
            color: theme.colors.onSurface,
        },
        iconStyle: {
            width: 20,
            height: 20,
            tintColor: theme.colors.onSurfaceVariant,
        },
        inputSearchStyle: {
            height: 40,
            fontSize: 16,
            color: theme.colors.onSurface,
            backgroundColor: theme.colors.surfaceContainer,
        },
        dropdownContainer: {
            backgroundColor: theme.colors.surfaceContainer,
            borderColor: theme.colors.outline,
            borderWidth: 1,
            borderRadius: 5,
        },
        itemTextStyle: {
            color: theme.colors.onSurface,
        },
        activeColorStyle: {
            backgroundColor: theme.colors.elevation.level1,
        }
    });

export default ThemedDropdown;
