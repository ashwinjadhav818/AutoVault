import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { addUserDoc } from "./handleFireStore";

const handleLogin = async (email, password, navigation) => {
    await signInWithEmailAndPassword(auth, email, password, navigation)
        .then(() => {
            navigation.replace("Home");
        })
        .catch(error => {
            if (error.code === "auth/invalid-email")
                alert("Invalid email format.");
            else if (error.code === "auth/user-disabled")
                alert("User account is disabled.");
            else if (error.code === "auth/user-not-found")
                alert("User not found.");
            else if (error.code === "auth/wrong-password")
                alert("Incorrect password.");
            else if (error.code === "auth/too-many-requests")
                alert("Too many attempts. Try again later.");
            else if (error.code === "auth/network-request-failed")
                alert("Network request failed.");
            else if (error.code === "auth/internal-error")
                alert("Server error.");
            else if (error.code === "auth/invalid-user-token")
                alert("Invalid user token.");
            else if (error.code === "auth/requires-recent-login")
                alert("Credential too old, please log in again.");
            else if (error.code === "auth/invalid-credential")
                alert("Invalid credential.");
            else if (error.code === "auth/account-exists-with-different-credential")
                alert("Account exists with different credential.");
            else if (error.code === "auth/user-mismatch")
                alert("User mismatch.");
            else if (error.code === "auth/user-signed-out")
                alert("User has signed out.");
            else
                alert(error.message);
        });
}

const handleSignUp = async (email, password, navigation) => {
    await createUserWithEmailAndPassword(auth, email, password, navigation)
        .then(() => {
            { addUserDoc() }
            navigation.replace("Home");
        })
        .catch(error => {
            if (error.code === "auth/email-already-in-use")
                alert("Email is already registered.");
            else if (error.code === "auth/invalid-email")
                alert("Invalid email format.");
            else if (error.code === "auth/weak-password")
                alert("Password is too weak.");
            else if (error.code === "auth/network-request-failed")
                alert("Network request failed.");
            else if (error.code === "auth/operation-not-allowed")
                alert("Operation not allowed.");
            else if (error.code === "auth/invalid-api-key")
                alert("Invalid API key.");
            else if (error.code === "auth/internal-error")
                alert("Server error.");
            else if (error.code === "auth/missing-android-pkg-name")
                alert("Missing Android package name.");
            else if (error.code === "auth/missing-ios-bundle-id")
                alert("Missing iOS bundle ID.");
            else if (error.code === "auth/invalid-credential")
                alert("Invalid credential.");
            else if (error.code === "auth/quota-exceeded")
                alert("Quota exceeded.");
            else if (error.code === "auth/too-many-requests")
                alert("Too many attempts. Try again later.");
            else if (error.code === "auth/user-disabled")
                alert("User account is disabled.");
            else if (error.code === "auth/user-not-found")
                alert("User not found.");
            else
                alert(error.message);
        });
}

const handleSignOut = (navigation) => {
    auth.signOut()
        .then(() => {
            navigation.navigate("Login");
        })
        .catch(error => {
            alert(error.message)
        });
}

export { handleLogin, handleSignUp, handleSignOut };
