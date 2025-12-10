import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Ticket, Monitor, LogOut, PlusCircle } from 'lucide-react';
import clsx from 'clsx';

import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import { Sun, Moon, Bell } from 'lucide-react';

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const { socket } = useSocket();
    const [notifications, setNotifications] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (socket) {
            socket.on('ticket_created', (data: any) => {
                setNotifications(prev => [...prev, `New ticket: ${data.title}`]);
            });
        }
    }, [socket]);

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
        <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-tech-grid text-white' : 'bg-gray-50 text-slate-900'}`}>
            {/* Sidebar */}
            <div className={`w-64 border-r flex flex-col ${theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className={`p-6 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                    <h1 className="text-2xl font-bold text-indigo-500 flex items-center gap-2">
                        <LayoutDashboard className="h-8 w-8" />
                        SupportFlow
                    </h1>
                </div>

                <div className={`p-4 border-b ${theme === 'dark' ? 'border-slate-700 bg-slate-900/50' : 'border-gray-200 bg-gray-50'}`}>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{user?.firstName} {user?.lastName}</p>
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
                                        : theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-gray-100 hover:text-slate-900'
                                )}
                            >
                                <Icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} space-y-2`}>
                    <div className="flex items-center justify-between px-4 py-2">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-700/50 transition-colors">
                            {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
                        </button>
                        <div className="relative">
                            <Bell className={`h-5 w-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`} />
                            {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                            )}
                        </div>
                    </div>
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
