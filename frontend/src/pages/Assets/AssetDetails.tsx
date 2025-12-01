import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../../api/client';
import StatusBadge from '../../components/StatusBadge';

const AssetDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [asset, setAsset] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const response = await client.get(`/assets/${id}`);
                setAsset(response.data);
            } catch (error) {
                console.error('Failed to fetch asset', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAsset();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!asset) return <div>Asset not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Asset Info */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {asset.assetTag} - {asset.brand} {asset.model}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Serial: {asset.serialNumber}
                        </p>
                    </div>
                    <StatusBadge status={asset.status} type="asset" />
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Type</dt>
                            <dd className="mt-1 text-sm text-gray-900">{asset.type}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Location</dt>
                            <dd className="mt-1 text-sm text-gray-900">{asset.location}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {asset.assignedTo ? `${asset.assignedTo.firstName} ${asset.assignedTo.lastName}` : 'Unassigned'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Purchase Date</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : 'N/A'}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* History */}
            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">History</h3>
                </div>
                <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {asset.history.map((entry: any) => (
                            <li key={entry.id} className="px-4 py-4 sm:px-6">
                                <div className="flex space-x-3">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-900">
                                                {entry.changeType.replace('_', ' ')}
                                            </p>
                                            <p className="text-sm text-gray-500">{new Date(entry.createdAt).toLocaleString()}</p>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Changed by {entry.changedBy.firstName} {entry.changedBy.lastName}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {asset.history.length === 0 && (
                            <li className="px-4 py-4 sm:px-6 text-sm text-gray-500">No history available</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AssetDetails;
