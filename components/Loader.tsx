import React from 'react';

const Loader: React.FC = () => (
    <div className="flex justify-center items-center py-12">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
);

export default Loader;