module.exports = {
    name: "AutoVault",
    slug: "AutoVault",
    version: "0.1.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    android: {
        package: "com.ashwinjadhav818.AutoVault",
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
        adaptiveIcon: {
            foregroundImage: "./assets/adaptive-icon.png",
            backgroundColor: "#ffffff"
        }
    },
    plugins: [
        "@react-native-firebase/app",
        "@react-native-firebase/auth",
        "./plugins/selectContact.js"
    ],
    extra: {
        eas: {
            projectId: "b37e22f1-6581-4c24-9467-a639ee327151"
        }
    }
};
