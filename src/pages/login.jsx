import React, { useState } from "react";
import axios from 'axios';
import "../css/login.css";

const Login = ({ setToken, setUsuario }) => {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState('');
    const ipOptions = ['10.70.131.130', 'localhost'];
    let ipIndex = 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            correo,
            contraseña,
        };

        const handleLogin = (ip) => {
            axios
                .post(`http://${ip}:3000/login`, data)
                .then((response) => {
                    const { token, tipoUsuario } = response.data;
                    setToken(token);
                    setUsuario(tipoUsuario);
                })
                .catch((error) => {
                    if (ipIndex < ipOptions.length - 1) {
                        ipIndex++;
                        handleLogin(ipOptions[ipIndex]);
                    } else {
                        setError('Credenciales invalidas');
                        console.error(error);
                    }
                });
        };

        handleLogin(ipOptions[ipIndex]);
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>Iniciar Sesion</h2>

            {error && <div className="error-message">{error}</div>}

            <label htmlFor="correo"> Correo Electronico:</label>
            <input type="email" id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />

            <label htmlFor="contraseña"> Contraseña:</label>
            <input type="password" id="contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} />

            <button id="login-submit" type="login-submit">Iniciar sesion</button>
        </form>
    );
};

export default Login;
