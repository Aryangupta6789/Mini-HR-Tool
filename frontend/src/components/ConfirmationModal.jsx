import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", isDestructive = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-auto my-6 z-50 px-4">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-gray-800 outline-none focus:outline-none overflow-hidden animate-fade-in-down transition-colors">
                    {/* Header */}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 dark:border-gray-700 rounded-t">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                            {title}
                        </h3>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={onClose}
                        >
                            <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                ×
                            </span>
                        </button>
                    </div>
                    {/* Body */}
                    <div className="relative p-6 flex-auto">
                        <p className="my-4 text-gray-500 dark:text-gray-400 text-base leading-relaxed">
                            {message}
                        </p>
                    </div>
                    {/* Footer */}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 dark:border-gray-700 rounded-b gap-3">
                        <button
                            className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-xs leading-tight uppercase rounded shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md focus:bg-gray-200 dark:focus:bg-gray-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-300 active:shadow-lg transition duration-150 ease-in-out"
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className={`px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out ${
                                isDestructive 
                                    ? 'bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-800' 
                                    : 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800'
                            }`}
                            type="button"
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
