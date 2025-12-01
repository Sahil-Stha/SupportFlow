import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await client.post('/auth/login', { email, password });
            login(response.data.token);
            toast.success('Successfully logged in!');
            navigate('/');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-tech-grid">
            <div className="bg-slate-800/90 backdrop-blur-sm p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
                <div className="flex justify-center mb-6">
                    <img
                        src="https://pngimg.com/uploads/transformers/transformers_PNG13.png"
                        alt="Transformers Logo"
                        className="h-16 w-auto"
                    />
                </div>
                <h2 className="text-3xl font-bold mb-6 text-center text-white tracking-tight">SupportFlow</h2>
                <p className="text-center text-slate-400 mb-8">Sign in to your account</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300">Email</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="email"
                                required
                                className="block w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300">Password</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="password"
                                required
                                className="block w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02]"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 flex flex-col space-y-2 text-center text-sm">
                    <div className="flex justify-center space-x-4 text-slate-400">
                        <Link to="/register" className="hover:text-indigo-400 transition-colors">Create Account</Link>
                        <span className="text-slate-600">|</span>
                        <button
                            onClick={() => toast('Password reset feature coming soon!', { icon: '🚧' })}
                            className="hover:text-indigo-400 transition-colors"
                        >
                            Forgot Password?
                        </button>
                    </div>
                    <div>
                        <a href="mailto:support@supportflow.com" className="text-slate-500 hover:text-indigo-400 transition-colors">
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
