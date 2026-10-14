export interface User {
    name: string;
    email: string;
    rol: 'normal' | 'admin';
    password?: string;
}

export const mockUsers = [
    {
        name:"Cliente",
        email:"cliente@correo.com",
        rol:"normal",
        password:"cliente123"
    },
    {
        name:"Admin",
        email:"admin@losmaestros.cl",
        rol:"admin",
        password:"admin123"
    }
]
