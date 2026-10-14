import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {mockUsers} from './constants/mockUsers'

if(!localStorage.getItem('users')){
    localStorage.setItem('users', JSON.stringify(mockUsers));
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
