import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword,signOut } from "firebase/auth";
import { auth } from "../../firebase.init";
import { createContext, useEffect } from "react";
import { useState } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        // console.log(email, password);
        setLoading(true);

        return createUserWithEmailAndPassword(auth,email,password)
    }

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const Logout = () => {
        setLoading(true);
        return signOut(auth);
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Current User: ", currentUser);
            setUser(currentUser);
            setLoading(false);
        })  
        
        return () => unSubscribe();
    },[])

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        Logout,
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;