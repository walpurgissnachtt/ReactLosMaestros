import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {mockUsers} from '../constants/mockUsers';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) =>{
        e.preventDefault()
        setError('');

        //Buscar correo y contras si coinciden
        const userFound = mockUsers.find((u) => u.email === email && u.password === password);
        if(userFound){
            //Guardar usuario en el localStorage
            const userToSave = {
                name: userFound.name,
                email: userFound.email,
                rol: userFound.rol
            }
            localStorage.setItem('currentUser',JSON.stringify(userToSave))

            //redireccionamiento dependiendo del rol del usuario
            if(userFound.rol==='admin'){
                navigate('/admin')
            }else{
                navigate("/")
            }
        }else{
            setError('Credenciales invalidas');
        }
    };

    return(
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
                    Ingresar
                </button>
            </form>
        </div>
    );
};
