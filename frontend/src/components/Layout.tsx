import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Ticket, Monitor, LogOut, PlusCircle } from 'lucide-react';
import clsx from 'clsx';

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'My Tickets', path: '/', icon: Ticket },
        { name: 'Create Ticket', path: '/tickets/new', icon: PlusCircle },
    ];

    if (user?.role === 'TECH' || user?.role === 'ADMIN') {
        navItems.unshift({ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard });
        navItems.push({ name: 'Assets', path: '/assets', icon: Monitor });
    }

    return (
        <div className="min-h-screen bg-tech-grid flex">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900/90 backdrop-blur-md border-r border-slate-700 flex flex-col">
                <div className="p-6 border-b border-slate-700">
                    <h1 className="text-2xl font-bold text-indigo-500 flex items-center gap-2">
                        <LayoutDashboard className="h-8 w-8" />
                        SupportFlow
                    </h1>
                </div>

                <div className="p-4 border-b border-slate-700 bg-slate-900/50">
                    <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all',
                                    isActive
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                )}
                            >
                                <Icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 rounded-md hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
