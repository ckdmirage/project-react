import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' 
import './app.css'
import './index.css'
import App from './App.jsx'
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:8081";
axios.defaults.withCredentials = true; // 如果你有處理 cookie 或 session

createRoot(document.getElementById('root')).render(

    <App />

)
