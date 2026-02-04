import React from 'react';

const GlobalLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
                <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-200">Loading...</p>
            </div>
        </div>
    );
};

export default GlobalLoader;
