import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './user/login/LoginPage';
import PageNotFound from './pageNotFound/PageNotFound';
import ProductsList from "./products/productsList/ProductsList";
import UserPage from "./user/userPage/UserPage";
import ProductItem from "./products/productItem/ProductItem";
import ProductForm from "./products/createForm/ProductForm";
import Menu from './UI/menu/Menu';
import useUserStore from './user/UserState';
import ProtectedRoute from './utils/ProtectedRoute';

const App: React.FC = () => {
    const isLoggedIn = useUserStore(state => state.isLoggedIn);
    const startInactivityTimer = useUserStore(state => state.startInactivityTimer);

    useEffect(() => {
        const handleActivity = () => {
            startInactivityTimer();
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keypress', handleActivity);
        window.addEventListener('click', handleActivity);
        window.addEventListener('scroll', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keypress', handleActivity);
            window.removeEventListener('click', handleActivity);
            window.removeEventListener('scroll', handleActivity);
        };
    }, [startInactivityTimer]);

    return (
        <>
            {isLoggedIn && <Menu />}
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<PageNotFound />} />

                {/* Protected Routes */}
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                            <UserPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products"
                    element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                            <ProductsList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products/:id"
                    element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                            <ProductItem />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products/create"
                    element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                            <ProductForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/products/edit/:id"
                    element={
                        <ProtectedRoute isLoggedIn={isLoggedIn}>
                            <ProductForm />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
};

export default App;
