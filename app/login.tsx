import React, { useState } from "react";
import { Keyboard, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { TextInput, Button, Text, HelperText, useTheme } from "react-native-paper";
import { MD3Theme } from "react-native-paper";
import { handleLogin } from "@/hooks/handleAuth";

const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export default function Login() {
    const theme = useTheme() as MD3Theme;

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

    const themedStyles = getThemedStyles(theme);

    return (
        <View style={themedStyles.container}>
            <View style={themedStyles.formContainer}>
                <View style={themedStyles.header}>
                    <Image source={require("@/assets/images/adaptive-icon.png")} style={themedStyles.icon} />
                    <Text variant="headlineMedium" style={themedStyles.title}>
                        Log in
                    </Text>
                    <Text style={themedStyles.bodyText}>Welcome back! Please enter your details.</Text>
                </View>

                <View style={themedStyles.inputContainer}>
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

                <View style={themedStyles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        loading={isLoading}
                        disabled={isLoading}
                        style={themedStyles.button}
                    >
                        {isLoading ? "Logging in..." : "Log in"}
                    </Button>

                    <View style={themedStyles.signupContainer}>
                        <Text style={themedStyles.bodyText}>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => router.push("/signup")}>
                            <Text style={themedStyles.signupLink}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const getThemedStyles = (theme: MD3Theme) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: theme.colors.background,
    },
    formContainer: {
        width: "100%",
        maxWidth: 440,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness * 2,
        padding: 24,
        elevation: 2,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    header: {
        alignItems: "center",
        marginBottom: 16,
    },
    icon: {
        width: 150,
        height: 64,
        marginBottom: 16,
    },
    title: {
        marginBottom: 8,
        color: theme.colors.onSurface,
    },
    bodyText: {
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 16,
        gap: 16,
    },
    buttonContainer: {
        width: "100%",
    },
    button: {
        width: "100%",
        borderRadius: theme.roundness,
    },
    signupContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 16,
    },
    signupLink: {
        color: theme.colors.primary,
        marginLeft: 4,
        fontWeight: 'bold',
    },
});
