import React, { useState } from 'react';
import useUserStore from '../UserState';
import "./UserPage.scss";

const UserPage: React.FC = () => {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const [newEmail, setNewEmail] = useState(user || '');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSave = () => {
        if (newEmail.trim() === '') {
            setMessage({ type: 'error', text: 'El email no puede estar vacío.' });
            return;
        }
        if (!validateEmail(newEmail)) {
            setMessage({ type: 'error', text: 'El correo debe tener la estructura correo@dominio.com.' });
            return;
        }
        setUser(newEmail);
        setMessage({ type: 'success', text: '¡Email actualizado exitosamente!' });
    };

    return (
        <div className="userPageContainer">
            <h2>Usuario</h2>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />
            </div>
            <button onClick={handleSave}>Guardar</button>
            {message && (
                <p className={message.type === 'success' ? 'successMessage' : 'errorMessage'}>
                    {message.text}
                </p>
            )}
        </div>
    );
};

export default UserPage;
