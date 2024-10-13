import React, { useEffect, useState } from 'react';
import { Text, Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { handleSignUp } from "../utils/handleAuth";

export default SignUp = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation();

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <Text variant="titleLarge">Sign Up</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    mode="outlined"
                    label="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <TextInput
                    mode="outlined"
                    label="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                />
            </View>

            <View style={styles.actionContainer}>
                <Button
                    mode="outlined"
                    style={styles.button}
                    onPress={() => handleSignUp(email, password, navigation)}
                >
                    Register
                </Button>

                <Text
                    onPress={() => { navigation.navigate("Login") }}
                    style={styles.link}
                >
                    Already have a account? Login
                </Text>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        width: "80%"
    },
    actionContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        width: "60%",
        marginTop: 10,
    },
    link: {
        marginTop: 10,
        color: "#337ab7",
        textDecorationLine: "underline",
    }
})
