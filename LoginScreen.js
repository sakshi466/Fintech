import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, Snackbar } from "react-native-paper";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { Chrome, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarType, setSnackbarType] = useState("success");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");


    const showSnackbar = (message, type = "success") => {
        setSnackbarMessage(message);
        setSnackbarType(type);
        setSnackbarVisible(true);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError("Email is required");
            return false;
        } else if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address");
            return false;
        }
        setEmailError("");
        return true;
    };

    const validatePassword = (password) => {
        if (!password) {
            setPasswordError("Password is required");
            return false;
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            showSnackbar(`Welcome ${result.user.displayName || 'back'}!`);
            setTimeout(() => {
                navigation.navigate("MutualFundDashboard");
            }, 1000);
        } catch (error) {
            console.log("Google login error: ", error);
            showSnackbar("Failed to login with Google. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async () => {
        setEmailError("");
        setPasswordError("");

        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                showSnackbar("Logged in successfully!");
                setTimeout(() => {
                    navigation.navigate("MutualFundDashboard");
                }, 1500);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                showSnackbar("Account created successfully!");
                setTimeout(() => {
                    setIsLogin(true);
                    setEmail("");
                    setPassword("");
                }, 1500);
            }
        } catch (error) {
            let errorMessage = "An error occurred";
            switch (error.code) {
                case "auth/email-already-in-use":
                    errorMessage = "This email is already registered. Please login instead.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Please enter a valid email address.";
                    break;
                case "auth/weak-password":
                    errorMessage = "Password should be at least 6 characters.";
                    break;
                case "auth/wrong-password":
                    errorMessage = "Incorrect password. Please try again.";
                    break;
                case "auth/user-not-found":
                    errorMessage = "No account found with this email. Please sign up.";
                    break;
                case "auth/network-request-failed":
                    errorMessage = "Network error. Please check your internet connection.";
                    break;
                case "auth/too-many-requests":
                    errorMessage = "Too many failed attempts. Please try again later.";
                    break;
                default:
                    errorMessage = "Authentication failed. Please try again.";
            }
            showSnackbar(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.loginContainer}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logo}>
                        <Text style={styles.logoG}>A</Text>
                        <Text style={styles.logoO1}>m</Text>
                        <Text style={styles.logoO2}>p</Text>
                        <Text style={styles.logoG}>h</Text>
                        <Text style={styles.logoL}>i</Text>
                        <Text style={styles.logoE}>i</Text>
                    </Text>
                    <Text style={styles.subtitle}>
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </Text>
                    <Text style={styles.subtext}>
                        {isLogin ? "Sign in to continue to your dashboard" : "Sign up to get started with our platform"}
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Mail size={20} color="#6b7280" style={styles.inputIcon} />
                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (emailError) validateEmail(text);
                            }}
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            disabled={loading}
                            mode="outlined"
                            outlineColor={emailError ? "#ef4444" : "#dadce0"}
                            activeOutlineColor={emailError ? "#ef4444" : "#1a73e8"}
                            error={!!emailError}
                        />
                    </View>
                    {emailError ? (
                        <Text style={styles.errorText}>
                            <AlertCircle size={12} color="#ef4444" /> {emailError}
                        </Text>
                    ) : null}

                    <View style={styles.inputContainer}>
                        <Lock size={20} color="#6b7280" style={styles.inputIcon} />
                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (passwordError) validatePassword(text);
                            }}
                            style={styles.input}
                            secureTextEntry={!showPassword}
                            disabled={loading}
                            mode="outlined"
                            outlineColor={passwordError ? "#ef4444" : "#dadce0"}
                            activeOutlineColor={passwordError ? "#ef4444" : "#1a73e8"}
                            error={!!passwordError}
                            right={
                                <TextInput.Icon
                                    icon={({ size, color }) => (
                                        showPassword ? 
                                            <EyeOff size={size} color={color} /> : 
                                            <Eye size={size} color={color} />
                                    )}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            }
                        />
                    </View>
                    {passwordError ? (
                        <Text style={styles.errorText}>
                            <AlertCircle size={12} color="#ef4444" /> {passwordError}
                        </Text>
                    ) : null}

                    {isLogin && (
                        <TouchableOpacity>
                            <Text style={styles.forgotPassword}>Forgot password?</Text>
                        </TouchableOpacity>
                    )}

                    <Button 
                        mode="contained" 
                        onPress={handleAuth} 
                        style={styles.authButton} 
                        loading={loading} 
                        disabled={loading}
                        labelStyle={styles.authButtonLabel}
                    >
                        {isLogin ? "Sign In" : "Create Account"}
                    </Button>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or continue with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <Button 
                        mode="outlined" 
                        onPress={handleGoogleLogin} 
                        style={styles.googleButton} 
                        disabled={loading}
                        icon={({ size }) => <Chrome size={size} color="#4285F4" />}
                        labelStyle={styles.googleButtonText}
                    >
                        Google
                    </Button>

                    <View style={styles.switchContainer}>
                        <Text style={styles.switchText}>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                        </Text>
                        <TouchableOpacity 
                            onPress={() => {
                                setIsLogin(!isLogin);
                                setEmail("");
                                setPassword("");
                                setEmailError("");
                                setPasswordError("");
                            }}
                            disabled={loading}
                        >
                            <Text style={styles.switchAction}>
                                {isLogin ? "Sign up" : "Sign in"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                style={{
                    backgroundColor: snackbarType === "success" ? "#10B981" : "#EF4444",
                    borderRadius: 8,
                    marginBottom: 16
                }}
                action={{
                    label: "Dismiss",
                    onPress: () => setSnackbarVisible(false),
                }}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    loginContainer: {
        width: '100%',
        maxWidth: 450,
        padding: 32,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    logoG: { color: '#4285F4' },
    logoO1: { color: '#EA4335' },
    logoO2: { color: '#FBBC05' },
    logoL: { color: '#34A853' },
    logoE: { color: '#EA4335' },
    subtitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtext: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 8,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    inputIcon: {
        position: 'absolute',
        top: 18,
        left: 12,
        zIndex: 1,
    },
    input: {
        backgroundColor: 'transparent',
        paddingLeft: 40,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: -12,
        marginBottom: 16,
        marginLeft: 12,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    forgotPassword: {
        color: '#1a73e8',
        textAlign: 'right',
        marginBottom: 24,
        fontSize: 14,
    },
    authButton: {
        backgroundColor: '#1a73e8',
        borderRadius: 8,
        paddingVertical: 8,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    authButtonLabel: {
        fontSize: 16,
        fontWeight: '600',
        paddingVertical: 4,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e5e7eb',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#6b7280',
        fontSize: 14,
    },
    googleButton: {
        borderColor: '#e5e7eb',
        borderRadius: 8,
        marginBottom: 32,
    },
    googleButtonText: {
        color: '#4285F4',
        fontSize: 16,
        fontWeight: '500',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchText: {
        color: '#6b7280',
        marginRight: 6,
    },
    switchAction: {
        color: '#1a73e8',
        fontWeight: '600',
    },
});