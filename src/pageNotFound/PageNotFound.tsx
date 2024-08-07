import React from 'react';
import { Link } from 'react-router-dom';
import './PageNotFound.scss';
import notFound from "../resources/images/404.svg";

const NotFoundPage: React.FC = () => {
    return (
        <div className="notFound">
            <img src={notFound} alt={"page not found"} />
            <h1>Page Not Found</h1>
            <p>Sorry! The page you are looking for doesn't exist</p>
            <Link to="/">Go to Home</Link>
        </div>
    );
};

export default NotFoundPage;
