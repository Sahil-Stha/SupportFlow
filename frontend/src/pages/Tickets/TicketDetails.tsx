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

    if (loading) return <div>Loading...</div>;
    if (!ticket) return <div>Ticket not found</div>;

    const canEdit = user?.role === 'TECH' || user?.role === 'ADMIN';

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            await client.post(`/tickets/${id}/attachments`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('File uploaded');
            fetchTicket();
        } catch (error) {
            toast.error('Failed to upload file');
            console.error(error);
        }
    };

    const handleGenerateAIResponse = async () => {
        try {
            const response = await client.post('/ai/suggest-response', {
                ticketDescription: ticket.description,
                comments: ticket.comments
            });
            setNewComment(response.data.suggestion);
            toast.success('AI suggestion generated');
        } catch (error) {
            toast.error('Failed to generate AI response');
            console.error(error);
        }
    };

    const handleDeleteTicket = async () => {
        if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
            return;
        }

        try {
            await client.delete(`/tickets/${id}`);
            toast.success('Ticket deleted successfully');
            navigate('/tickets');
        } catch (error) {
            toast.error('Failed to delete ticket');
            console.error('Failed to delete ticket', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                            #{ticket.id} - {ticket.title}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-slate-400">
                            Created by {ticket.createdBy.firstName} {ticket.createdBy.lastName} on {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <StatusBadge status={ticket.status} type="ticket" />
                        <StatusBadge status={ticket.priority} type="priority" />
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-slate-700 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Description</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{ticket.description}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Category</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{ticket.category}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Assigned To</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                {ticket.assignedTo ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}` : 'Unassigned'}
                            </dd>
                        </div>
                        {ticket.asset && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Related Asset</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {ticket.asset.assetTag} ({ticket.asset.type})
                                </dd>
                            </div>
                        )}
                        {ticket.attachments && ticket.attachments.length > 0 && (
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Attachments</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    <ul className="list-disc pl-5">
                                        {ticket.attachments.map((att: any) => (
                                            <li key={att.id}>
                                                <a href={`http://localhost:5000/${att.filePath}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                                                    {att.fileName}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* Controls for Tech/Admin */}
                {canEdit && (
                    <div className="border-t border-gray-200 dark:border-slate-700 px-4 py-4 bg-gray-50 dark:bg-slate-900/50 flex gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Update Status</label>
                            <select
                                value={ticket.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="NEW">New</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="ON_HOLD">On Hold</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 uppercase">Update Priority</label>
                            <select
                                value={ticket.priority}
                                onChange={(e) => handlePriorityChange(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>
                        {user?.role === 'ADMIN' && ticket.status === 'CLOSED' && (
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
            <div className="bg-white dark:bg-slate-800 shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Comments</h3>
                </div>
                <div className="border-t border-gray-200 dark:border-slate-700">
                    <ul className="divide-y divide-gray-200 dark:divide-slate-700">
                        {ticket.comments.map((comment: any) => (
                            <li key={comment.id} className="px-4 py-4 sm:px-6">
                                <div className="flex space-x-3">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium dark:text-white">{comment.user.firstName} {comment.user.lastName}</h3>
                                            <p className="text-sm text-gray-500 dark:text-slate-400">{new Date(comment.createdAt).toLocaleString()}</p>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-slate-300">{comment.comment}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900/50 px-4 py-4 sm:px-6">
                    <form onSubmit={handleCommentSubmit}>
                        <div>
                            <label htmlFor="comment" className="sr-only">Add a comment</label>
                            <div className="relative">
                                <textarea
                                    id="comment"
                                    rows={3}
                                    className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-md"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    required
                                />
                                {canEdit && (
                                    <button
                                        type="button"
                                        onClick={handleGenerateAIResponse}
                                        className="absolute bottom-2 right-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200"
                                    >
                                        Generate AI Response
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
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
