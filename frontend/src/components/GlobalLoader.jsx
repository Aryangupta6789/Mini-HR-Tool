import React from 'react';

const GlobalLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-md transition-all duration-300">
            <div className="relative flex flex-col items-center justify-center p-8 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
                {/* Gradient Spinner */}
                <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500/30 rounded-full animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-cyan-400 border-r-blue-500 rounded-full animate-spin"></div>
                </div>
                
                {/* Text */}
                <h3 className="mt-6 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-wide animate-pulse">
                    Processing...
                </h3>
                <p className="mt-2 text-xs text-gray-200 dark:text-gray-400 font-light tracking-widest text-center uppercase">
                    Mini HR Tool
                </p>
            </div>
        </div>
    );
};

export default GlobalLoader;
