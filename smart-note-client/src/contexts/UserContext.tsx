import { createContext, useState } from 'react';
import { UserResponse } from '../shared/models/user';

interface IUserContext {
    userReponse: UserResponse;
    setUserResponse: (user: UserResponse) => void;
}

const UserContext = createContext<IUserContext | null>(null);

const UserProvider = ({ children }: any) => {
    const getUserFromLocalStorage = (): UserResponse => {
        return JSON.parse(localStorage.getItem('current_user') || 'false');
    };
    const [userReponse, setUserResponse] = useState<UserResponse>(getUserFromLocalStorage());

    const value = {
        userReponse,
        setUserResponse,
    };

    return <UserContext.Provider value={value as IUserContext}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
