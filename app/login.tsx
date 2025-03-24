import React, { useState } from "react";
import { Keyboard, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { TextInput, Button, Text, HelperText } from "react-native-paper";
import { handleLogin } from "@/hooks/handleAuth";

const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export default function Login() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: LoginSchemaType) => {
        setIsLoading(true);
        Keyboard.dismiss();

        try {
            await handleLogin(data.email, data.password);
        } catch (error: any) {
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.header}>
                    <Image source={require("@/assets/images/adaptive-icon.png")} style={styles.icon} />
                    <Text variant="headlineMedium" style={styles.title}>
                        Log in
                    </Text>
                    <Text>Welcome back! Please enter your details.</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Controller
                        defaultValue=""
                        name="email"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <View>
                                <TextInput
                                    label="Email"
                                    value={value}
                                    mode="outlined"
                                    onChangeText={onChange}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    error={!!errors?.email}
                                />
                                {errors?.email && (
                                    <HelperText type="error" visible={!!errors?.email}>
                                        {errors.email.message}
                                    </HelperText>
                                )}
                            </View>
                        )}
                    />

                    <Controller
                        defaultValue=""
                        name="password"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <View>
                                <TextInput
                                    label="Password"
                                    value={value}
                                    mode="outlined"
                                    onChangeText={onChange}
                                    secureTextEntry={!showPassword}
                                    right={
                                        <TextInput.Icon
                                            icon={showPassword ? "eye" : "eye-off"}
                                            onPress={() => setShowPassword(!showPassword)}
                                        />
                                    }
                                    error={!!errors?.password}
                                />
                                {errors?.password && (
                                    <HelperText type="error" visible={!!errors?.password}>
                                        {errors.password.message}
                                    </HelperText>
                                )}
                            </View>
                        )}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        loading={isLoading}
                        disabled={isLoading}
                        style={styles.button}
                    >
                        {isLoading ? "Logging in..." : "Log in"}
                    </Button>

                    <View style={styles.signupContainer}>
                        <Text>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => router.push("/signup")}>
                            <Text style={styles.signupLink}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 16,
    },
    formContainer: {
        width: "100%",
        maxWidth: 440,
    },
    header: {
        alignItems: "center",
        marginBottom: 16,
    },
    icon: {
        width: 150,
        height: 64,
    },
    title: {
        marginBottom: 8,
    },
    inputContainer: {
        marginBottom: 16,
    },
    buttonContainer: {
        width: "100%",
    },
    button: {
        width: "100%",
    },
    signupContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 16,
    },
    signupLink: {
        color: "blue",
        marginLeft: 4,
    },
});
