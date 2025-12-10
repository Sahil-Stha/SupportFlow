import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../../api/client';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const TicketDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState<any>(null);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchTicket = async () => {
        try {
            const response = await client.get(`/tickets/${id}`);
            setTicket(response.data);
        } catch (error) {
            toast.error('Failed to fetch ticket');
            console.error('Failed to fetch ticket', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const handleStatusChange = async (status: string) => {
        try {
            await client.put(`/tickets/${id}`, { status });
            toast.success('Status updated');
            fetchTicket();
        } catch (error) {
            toast.error('Failed to update status');
            console.error('Failed to update status', error);
        }
    };

    const handlePriorityChange = async (priority: string) => {
        try {
            await client.put(`/tickets/${id}`, { priority });
            toast.success('Priority updated');
            fetchTicket();
        } catch (error) {
            toast.error('Failed to update priority');
            console.error('Failed to update priority', error);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await client.post(`/tickets/${id}/comments`, { comment: newComment });
            setNewComment('');
            toast.success('Comment added');
            fetchTicket();
        } catch (error) {
            toast.error('Failed to add comment');
            console.error('Failed to add comment', error);
        }
    };

    const handleDeleteTicket = async () => {
        if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
            return;
        }

        try {
            await client.delete(`/tickets/${id}`);
            toast.success('Ticket deleted successfully');
            navigate('/');
        } catch (error) {
            toast.error('Failed to delete ticket');
            console.error('Failed to delete ticket', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!ticket) return <div>Ticket not found</div>;

    const canEdit = user?.role === 'TECH' || user?.role === 'ADMIN';

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            #{ticket.id} - {ticket.title}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Created by {ticket.createdBy.firstName} {ticket.createdBy.lastName} on {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <StatusBadge status={ticket.status} type="ticket" />
                        <StatusBadge status={ticket.priority} type="priority" />
                    </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{ticket.description}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Category</dt>
                            <dd className="mt-1 text-sm text-gray-900">{ticket.category}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {ticket.assignedTo ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}` : 'Unassigned'}
                            </dd>
                        </div>
                        {ticket.asset && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Related Asset</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {ticket.asset.assetTag} ({ticket.asset.type})
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* Controls for Tech/Admin */}
                {canEdit && (
                    <div className="border-t border-gray-200 px-4 py-4 bg-gray-50 flex gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Update Status</label>
                            <select
                                value={ticket.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="NEW">New</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="ON_HOLD">On Hold</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Update Priority</label>
                            <select
                                value={ticket.priority}
                                onChange={(e) => handlePriorityChange(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>
                        {user?.role === 'ADMIN' && ticket.status?.toUpperCase() === 'CLOSED' && (
                            <div className="flex items-end">
                                <button
                                    onClick={handleDeleteTicket}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Delete Ticket
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Comments */}
            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Comments</h3>
                </div>
                <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {ticket.comments.map((comment: any) => (
                            <li key={comment.id} className="px-4 py-4 sm:px-6">
                                <div className="flex space-x-3">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium">{comment.user.firstName} {comment.user.lastName}</h3>
                                            <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                                        </div>
                                        <p className="text-sm text-gray-500">{comment.comment}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <form onSubmit={handleCommentSubmit}>
                        <div>
                            <label htmlFor="comment" className="sr-only">Add a comment</label>
                            <textarea
                                id="comment"
                                rows={3}
                                className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-3 flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Post Comment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;
