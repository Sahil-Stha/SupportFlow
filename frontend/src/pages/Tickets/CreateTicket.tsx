import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { toast } from 'react-hot-toast';

const CreateTicket: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Hardware');
    const [priority, setPriority] = useState('MEDIUM');
    const [assetId, setAssetId] = useState('');
    const [assets, setAssets] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch assets for selection (optional)
        const fetchAssets = async () => {
            try {
                const response = await client.get('/assets');
                setAssets(response.data);
            } catch (error) {
                console.error('Failed to fetch assets', error);
            }
        };
        fetchAssets();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await client.post('/tickets', {
                title,
                description,
                category,
                priority,
                assetId: assetId ? Number(assetId) : null,
            });
            toast.success('Ticket created successfully!');
            navigate('/');
        } catch (error) {
            toast.error('Failed to create ticket');
            console.error('Failed to create ticket', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Create New Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        required
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option>Hardware</option>
                            <option>Software</option>
                            <option>Network</option>
                            <option>Access</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <select
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Related Asset (Optional)</label>
                    <select
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={assetId}
                        onChange={(e) => setAssetId(e.target.value)}
                    >
                        <option value="">None</option>
                        {assets.map((asset) => (
                            <option key={asset.id} value={asset.id}>
                                {asset.assetTag} - {asset.model}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Create Ticket
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTicket;
