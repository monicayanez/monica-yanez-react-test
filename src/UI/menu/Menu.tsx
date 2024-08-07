import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useUserStore from '../../user/UserState';
import "./Menu.scss";

const Menu: React.FC = () => {
    const user = useUserStore(state => state.user);
    const setUser = useUserStore(state => state.setUser);
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <ul>
                {!user && <li><NavLink to="/login">Login</NavLink></li>}
                {user && <>
                    <li><NavLink to="/products">Productos</NavLink></li>
                    <li><NavLink to="/users">Usuario</NavLink></li>
                    <li>
                        <NavLink
                            to="/login"
                            onClick={(e) => {
                                e.preventDefault();
                                handleLogout();
                            }}
                        >
                            Logout
                        </NavLink>
                    </li>
                </>}
            </ul>
        </nav>
    );
};

export default Menu;
