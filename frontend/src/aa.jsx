import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestConnection = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/test');
                setMessage(response.data.message);
            } catch (error) {
                console.error('Error al conectar con el backend:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Test de Conexión</h1>
            <p>{message || 'Cargando...'}</p>
        </div>
    );
};

export default TestConnection;
