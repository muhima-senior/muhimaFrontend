import React, { createContext, useState, useContext } from 'react';

const GlobalStoreContext = createContext(null);

export const useGlobalStore = () => {
    const context = useContext(GlobalStoreContext);
    if (context === null) {
        throw new Error('useGlobalStore must be used within a GlobalStoreProvider');
    }
    return context;
};

export const GlobalStoreProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Initialize with null instead of an empty string
    const [userType, setUserType] = useState(null);
    const [userId, setUserId] = useState(null);
    const value = {
        user,
        setUser,
        userType,
        setUserType,
        userId,
        setUserId
    };

    return (
        <GlobalStoreContext.Provider value={value}>
            {children}
        </GlobalStoreContext.Provider>
    );
};