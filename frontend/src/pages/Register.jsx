import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await axios.post('http://localhost:14285/api/auth/register', { username, password });
            setSuccess('Inscription réussie ! Redirection en cours...');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.error || "Erreur lors de l'inscription");
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
                <p className="text-gray-400 font-medium tracking-wide mt-2">Créez votre coffre-fort</p>
            </div>

            <div className="w-full max-w-md bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>
                {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-xl mb-4 text-center">{error}</div>}
                {success && <div className="bg-green-500/20 border border-green-500 text-green-100 p-3 rounded-xl mb-4 text-center">{success}</div>}

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
                            minLength="6"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 mt-2 bg-[var(--color-primary)] hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg transition-colors"
                    >
                        S'inscrire
                    </button>

                    <p className="text-gray-400 text-center mt-2 text-sm">
                        Déjà un compte ? <Link to="/login" className="text-[var(--color-primary)] hover:underline">Se connecter</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
