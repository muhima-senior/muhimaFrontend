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
    const categories = [
        { id: '1', name: 'Carpenter', icon: '🪚'},
        { id: '2', name: 'Cleaner', icon: '🧹'},
        { id: '4', name: 'Electrician', icon: '⚡' },
        { id: '5', name: 'AC Repair', icon: '❄️'},
        { id: '6', name: 'Plumber', icon: '🔧'},
        { id: '8', name: 'Pool Maintainance', icon: '🏊'},
        { id: '3', name: 'Gardener', icon: '👨‍🌾'},
        { id: '7', name: 'Painter', icon: '🎨'},
      ];      
    const value = {
        user,
        setUser,
        userType,
        setUserType,
        userId,
        setUserId,
        categories
    };

    return (
        <GlobalStoreContext.Provider value={value}>
            {children}
        </GlobalStoreContext.Provider>
    );
};