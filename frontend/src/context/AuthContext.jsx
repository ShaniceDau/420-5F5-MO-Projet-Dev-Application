import {createContext} from "react";

export const AuthContext = createContext({
    loggedIn: false,
    userId: null,
    email: null,
    login:()=>{},
    logout: ()=>{}
});