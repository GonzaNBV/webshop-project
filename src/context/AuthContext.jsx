import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../configFirebase';
import { onAuthStateChanged, signOut as firebaseSignOut, signInWithEmailAndPassword } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser , setCurrentUser ] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const ADMIN_EMAIL = "admin@admin.com";

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                if (user.email === ADMIN_EMAIL) {
                    const adminData = { uid: user.uid, email: user.email, isAdmin: true };
                    localStorage.setItem('adminUser ', JSON.stringify(adminData));
                    setCurrentUser (adminData);
                } else {
                    localStorage.removeItem('adminUser ');
                    setCurrentUser (null);
                    firebaseSignOut(auth).catch(() => {});
                }
            } else {
                localStorage.removeItem('adminUser ');
                setCurrentUser (null);
            }
            setLoadingAuth(false);
        });
        return unsubscribe;
    }, [ADMIN_EMAIL]);

    const login = async (email, password) => {
        if (email !== ADMIN_EMAIL) {
            await firebaseSignOut(auth).catch(() => {});
            localStorage.removeItem('adminUser ');
            setCurrentUser (null);
            throw { code: 'auth/invalid-admin-email', message: 'This email is not for an admin account.' };
        }
        setLoadingAuth(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        } finally {
            setLoadingAuth(false);
        }
    };

    const logout = async () => {
        setLoadingAuth(true);
        try {
            await firebaseSignOut(auth);
        } catch (error) {
        } finally {
            setLoadingAuth(false);
        }
    };

    const value = {
        currentUser ,
        loadingAuth,
        login,
        logout,
        isAdmin: currentUser ?.isAdmin || false
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
