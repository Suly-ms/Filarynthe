import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:14285/api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginAction } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { username, password });
            loginAction(res.data.user, res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur de connexion');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-gray-100 bg-[var(--color-dark-bg)]">
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-[var(--color-primary)] to-blue-700 rounded-2xl shadow-lg shadow-blue-500/20">
                        <Layers className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Fila<span className="text-[var(--color-primary)]">rynthe</span>
                    </h1>
                </div>
                <p className="text-gray-400 font-medium tracking-wide mt-2">Connectez-vous à votre coffre-fort</p>
            </div>

            <div className="w-full max-w-md bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
                {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-xl mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">Nom d'utilisateur</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-xl bg-gray-900 border border-[var(--color-dark-border)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">Mot de passe</label>
                        <input
                            type="password"
                            className="w-full p-3 rounded-xl bg-gray-900 border border-[var(--color-dark-border)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 mt-2 bg-[var(--color-primary)] hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg transition-colors"
                    >
                        Se connecter
                    </button>

                    <p className="text-gray-400 text-center mt-2 text-sm">
                        Pas encore de compte ? <Link to="/register" className="text-[var(--color-primary)] hover:underline">S'inscrire</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
