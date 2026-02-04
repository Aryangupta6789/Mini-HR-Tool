import React, { createContext, useContext, useState, useEffect } from 'react';
import GlobalLoader from '../components/GlobalLoader';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleStop = () => setIsLoading(false);

        window.addEventListener('api-loading-start', handleStart);
        window.addEventListener('api-loading-end', handleStop);

        return () => {
            window.removeEventListener('api-loading-start', handleStart);
            window.removeEventListener('api-loading-end', handleStop);
        };
    }, []);

    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    return (
        <LoadingContext.Provider value={{ isLoading, showLoader, hideLoader }}>
            {isLoading && <GlobalLoader />}
            {children}
        </LoadingContext.Provider>
    );
};
