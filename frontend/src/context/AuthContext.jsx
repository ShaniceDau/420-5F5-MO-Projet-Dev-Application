import { createContext } from "react";

export const AuthContext = createContext({
    loggedIn: false,
    userId: null,
    email: null,
    role: null,
    login: () => {},
    logout: () => {},
});