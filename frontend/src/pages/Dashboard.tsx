import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Ticket, Monitor, AlertCircle } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await client.get('/stats/overview');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!stats) return <div>Failed to load dashboard</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 overflow-hidden shadow-lg rounded-xl transition-all hover:scale-[1.02]">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 p-3 bg-indigo-500/10 rounded-lg">
                                <Ticket className="h-6 w-6 text-indigo-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-slate-400 truncate">Total Tickets</dt>
                                    <dd className="text-2xl font-bold text-white">{stats.totalTickets}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 overflow-hidden shadow-lg rounded-xl transition-all hover:scale-[1.02]">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 p-3 bg-amber-500/10 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-amber-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-slate-400 truncate">Open Tickets</dt>
                                    <dd className="text-2xl font-bold text-white">{stats.openTickets}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 overflow-hidden shadow-lg rounded-xl transition-all hover:scale-[1.02]">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 p-3 bg-emerald-500/10 rounded-lg">
                                <Monitor className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-slate-400 truncate">Total Assets</dt>
                                    <dd className="text-2xl font-bold text-white">{stats.totalAssets}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tickets by Status */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 shadow-lg rounded-xl p-6">
                    <h3 className="text-lg leading-6 font-medium text-white mb-6">Tickets by Status</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.ticketsByStatus}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                    cursor={{ fill: '#334155', opacity: 0.4 }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="value" fill="#6366f1" name="Tickets" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Assets by Status */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 shadow-lg rounded-xl p-6">
                    <h3 className="text-lg leading-6 font-medium text-white mb-6">Assets by Status</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.assetsByStatus}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: any) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {stats.assetsByStatus.map((_entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
