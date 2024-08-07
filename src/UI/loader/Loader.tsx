import React from 'react';
import './Loader.scss';

const Loader: React.FC = () => {
    return (
        <div className="spinner">
            <div className="circle"></div>
        </div>
    );
};

export default Loader;
