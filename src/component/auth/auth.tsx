import { useState,createContext } from "react";
import type { ReactNode } from "react";


const AuthContext = createContext<any>(null);
interface AuthProviderProps {
    children : ReactNode;
    
}
function AuthProvider( {children}: AuthProviderProps) {
    const [user, setUser] = useState<string | null>(null);

    const login = (email: string) => {
        setUser(email);
    }

    const logout = () => {
        setUser(null);
    }




    return <AuthContext.Provider value={{user, login, logout}}>
        {children}
    </AuthContext.Provider>
}

export {
    AuthProvider
}
