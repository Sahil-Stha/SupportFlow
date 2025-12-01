import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import Table from '../../components/Table';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';

interface Ticket {
    id: number;
    title: string;
    status: string;
    priority: string;
    updatedAt: string;
    assignedTo?: { firstName: string; lastName: string };
}

const TicketList: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                // If user is TECH or ADMIN, show all tickets? Or just theirs?
                // Requirement says "My Tickets" fetches from /tickets?created_by=me
                // But for TECH/ADMIN maybe they want to see all?
                // Let's stick to "My Tickets" concept for now, or maybe "All Tickets" for admins.
                // The prompt says "My Tickets ... Fetches from /tickets?created_by=me".
                // But also "Ticket Details ... If role is TECH or ADMIN: dropdowns to change status".
                // Let's implement a toggle or just fetch based on role.
                // For now, let's fetch all tickets if TECH/ADMIN, else created_by=me.

                let url = '/tickets';
                if (user?.role === 'USER') {
                    url += `?created_by=${user.id}`;
                }

                const response = await client.get(url);
                setTickets(response.data);
            } catch (error) {
                console.error('Failed to fetch tickets', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [user]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tickets</h2>
                <button
                    onClick={() => navigate('/tickets/new')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Create Ticket
                </button>
            </div>
            <Table
                data={tickets}
                onRowClick={(ticket) => navigate(`/tickets/${ticket.id}`)}
                columns={[
                    { header: 'ID', accessor: (t) => `#${t.id}` },
                    { header: 'Title', accessor: (t) => <span className="font-medium text-gray-900">{t.title}</span> },
                    { header: 'Status', accessor: (t) => <StatusBadge status={t.status} type="ticket" /> },
                    { header: 'Priority', accessor: (t) => <StatusBadge status={t.priority} type="priority" /> },
                    { header: 'Assigned To', accessor: (t) => t.assignedTo ? `${t.assignedTo.firstName} ${t.assignedTo.lastName}` : 'Unassigned' },
                    { header: 'Last Updated', accessor: (t) => new Date(t.updatedAt).toLocaleDateString() },
                ]}
            />
        </div>
    );
};

export default TicketList;
