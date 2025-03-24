import { useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    updateEmail
} from "@react-native-firebase/auth";
import { auth } from "@/firebase";
import { addUserDoc } from "@/hooks/handleFireStore";
import { router } from 'expo-router';

export const handleLogin = async (
    email: string,
    password: string,
): Promise<void> => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        router.replace("/(tabs)");
    } catch (error: any) {
        const errorCode = error.code;
        switch (errorCode) {
            case "auth/invalid-email":
                alert("Invalid email format.");
                break;
            case "auth/user-disabled":
                alert("User account is disabled.");
                break;
            case "auth/user-not-found":
                alert("User not found.");
                break;
            case "auth/wrong-password":
                alert("Incorrect password.");
                break;
            case "auth/too-many-requests":
                alert("Too many attempts. Try again later.");
                break;
            case "auth/network-request-failed":
                alert("Network request failed.");
                break;
            case "auth/internal-error":
                alert("Server error.");
                break;
            case "auth/invalid-user-token":
                alert("Invalid user token.");
                break;
            case "auth/requires-recent-login":
                alert("Credential too old, please log in again.");
                break;
            case "auth/invalid-credential":
                alert("Invalid credential.");
                break;
            case "auth/account-exists-with-different-credential":
                alert("Account exists with different credential.");
                break;
            case "auth/user-mismatch":
                alert("User mismatch.");
                break;
            case "auth/user-signed-out":
                alert("User has signed out.");
                break;
            default:
                alert(error);
        }
    }
};

export const handleSignUp = async (
    email: string,
    password: string,
): Promise<void> => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        await addUserDoc();
        router.replace("/(tabs)");
    } catch (error: any) {
        const errorCode = error.code;
        switch (errorCode) {
            case "auth/email-already-in-use":
                alert("Email is already registered.");
                break;
            case "auth/invalid-email":
                alert("Invalid email format.");
                break;
            case "auth/weak-password":
                alert("Password is too weak.");
                break;
            case "auth/network-request-failed":
                alert("Network request failed.");
                break;
            case "auth/operation-not-allowed":
                alert("Operation not allowed.");
                break;
            case "auth/invalid-api-key":
                alert("Invalid API key.");
                break;
            case "auth/internal-error":
                alert("Server error.");
                break;
            case "auth/missing-android-pkg-name":
                alert("Missing Android package name.");
                break;
            case "auth/missing-ios-bundle-id":
                alert("Missing iOS bundle ID.");
                break;
            case "auth/invalid-credential":
                alert("Invalid credential.");
                break;
            case "auth/quota-exceeded":
                alert("Quota exceeded.");
                break;
            case "auth/too-many-requests":
                alert("Too many attempts. Try again later.");
                break;
            case "auth/user-disabled":
                alert("User account is disabled.");
                break;
            case "auth/user-not-found":
                alert("User not found.");
                break;
            default:
                alert(error);
        }
    }
};

export const handleSignOut = async (): Promise<void> => {
    try {
        await auth.signOut();
        router.replace('/login');
        console.log("Logout successful.");
    } catch (error: unknown) {
        alert((error as Error).message);
    }
};

export const handleEditAccount = async (
    displayName: string,
    email: string,
    photoURL: string,
    setEmailError: (message: string) => void
): Promise<void> => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("No user is logged in.");

        if (displayName !== currentUser.displayName || photoURL !== currentUser.photoURL) {
            await updateProfile(currentUser, {
                displayName,
                photoURL,
            });
        }

        if (email !== currentUser.email) {
            await updateEmail(currentUser, email);
        }

        console.log("Profile updated successfully.");
    } catch (error: any) {
        if (error === "auth/requires-recent-login") {
            setEmailError("You need to re-authenticate to change your email.");
        } else {
            console.error("Error updating profile:", error);
        }
    }
};

export const isUserLoggedIn = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
            setIsLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return { isAuthenticated, isLoading };
} 
