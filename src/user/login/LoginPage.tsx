import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../UserState';
import "./LoginPage.scss";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailInstruction, setEmailInstruction] = useState(true);
    const [passwordInstructions, setPasswordInstructions] = useState({
        minLength: false,
        maxLength: false,
        uppercase: false,
        lowercase: false,
        specialChar: false,
        number: false,
    });
    const [confirmPasswordInstruction, setConfirmPasswordInstruction] = useState(false);
    const setUser = useUserStore((state) => state.setUser);
    const navigate = useNavigate();

    useEffect(() => {
        setEmailInstruction(!validateEmail(email));
    }, [email]);

    useEffect(() => {
        const instructions = {
            minLength: password.length >= 6,
            maxLength: password.length <= 12,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            specialChar: /[^a-zA-Z0-9]/.test(password),
            number: /\d/.test(password),
        };
        setPasswordInstructions(instructions);
    }, [password]);

    useEffect(() => {
        setConfirmPasswordInstruction(password !== confirmPassword);
    }, [password, confirmPassword]);

    const handleLogin = () => {
        setUser(email);
        navigate('/products');
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const getInstructionStyle = (isValid: boolean) => ({
        color: isValid ? 'green' : 'red',
    });

    const isPasswordValid = Object.values(passwordInstructions).every((v) => v);
    const isFormValid = validateEmail(email) && isPasswordValid && password === confirmPassword;

    return (
        <div className="loginPage">
            <div className="loginContainer">
                <h2>Login</h2>
                <div>
                    <p>Email:</p>
                    <div className="inputAndInstructions">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailInstruction && (
                            <span style={getInstructionStyle(!emailInstruction)} className="instructions">
                                El correo debe tener la estructura correo@dominio.com
                            </span>
                        )}
                    </div>
                </div>
                <div>
                    <p>Contraseña:</p>
                    <div className="inputAndInstructions">
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="instructions">
                            <span style={getInstructionStyle(passwordInstructions.minLength)}>
                                Mínimo 6 caracteres
                            </span>
                            <span style={getInstructionStyle(passwordInstructions.maxLength)}>
                                Máximo 12 caracteres
                            </span>
                            <span style={getInstructionStyle(passwordInstructions.uppercase)}>
                                Al menos una letra mayúscula
                            </span>
                            <span style={getInstructionStyle(passwordInstructions.lowercase)}>
                                Al menos una letra minúscula
                            </span>
                            <span style={getInstructionStyle(passwordInstructions.specialChar)}>
                                Al menos un carácter especial
                            </span>
                            <span style={getInstructionStyle(passwordInstructions.number)}>
                                Al menos un número
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <p>Confirmar contraseña:</p>
                    <div className="inputAndInstructions">
                        <input
                            type="password"
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {confirmPasswordInstruction && (
                            <span style={getInstructionStyle(!confirmPasswordInstruction)} className="instructions">
                                Las contraseñas deben coincidir
                            </span>
                        )}
                    </div>
                </div>
                <button onClick={handleLogin} disabled={!isFormValid}>
                    Login
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
