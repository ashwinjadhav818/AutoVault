import React, { useEffect, useState } from 'react';
import { Text, Button, TextInput, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { handleLogin } from "../utils/handleAuth";

export default Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        const isValidEmail = email => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        };

        setIsEmailValid(isValidEmail(email));
        setIsPasswordValid(password.length > 0);

        if (isValidEmail(email) && password.length > 0) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [email, password]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <Text variant="titleLarge">Login</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    mode="outlined"
                    label="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    onBlur={() => setEmailTouched(true)}
                    error={!isEmailValid && emailTouched}
                />
                <HelperText
                    type="error"
                    visible={!isEmailValid && emailTouched}
                    style={styles.helperText}
                >
                    Invalid email format.
                </HelperText>
                <TextInput
                    mode="outlined"
                    label="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    onBlur={() => setPasswordTouched(true)}
                    secureTextEntry
                    error={!isPasswordValid && passwordTouched}
                />
                <HelperText
                    type="error"
                    visible={!isPasswordValid && passwordTouched}
                    style={styles.helperText}
                >
                    Password cannot be empty.
                </HelperText>
            </View>

            <View style={styles.actionContainer}>
                <Button
                    mode="outlined"
                    style={styles.button}
                    onPress={() => handleLogin(email, password, navigation)}
                    disabled={isButtonDisabled}
                >
                    Login
                </Button>

                <Text
                    onPress={() => { navigation.navigate("SignUp") }}
                    style={styles.link}
                >
                    Create an account
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
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
    },
    helperText: {
        // height: 15,
        // fontSize: 10,
    }
});
