import React from 'react';
import {Navigate} from "react-router-dom";

//Componente para proteger la ruta de administrador (localhost/admin)
interface ProtectedRouteProps{
    children:React.ReactNode;
    allowedRole?: 'admin' | 'normal';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
    const storedUser = localStorage.getItem('currentUser');

    if (!storedUser) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(storedUser);

    if (allowedRole && user.rol !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;