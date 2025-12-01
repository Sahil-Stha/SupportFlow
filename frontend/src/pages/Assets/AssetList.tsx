import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import Table from '../../components/Table';
import StatusBadge from '../../components/StatusBadge';

const AssetList: React.FC = () => {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await client.get('/assets');
                setAssets(response.data);
            } catch (error) {
                console.error('Failed to fetch assets', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssets();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Assets</h2>
                {/* Add Create Asset button if needed */}
            </div>
            <Table
                data={assets}
                onRowClick={(asset) => navigate(`/assets/${asset.id}`)}
                columns={[
                    { header: 'Tag', accessor: (a) => <span className="font-medium text-gray-900">{a.assetTag}</span> },
                    { header: 'Type', accessor: (a) => a.type },
                    { header: 'Model', accessor: (a) => `${a.brand} ${a.model}` },
                    { header: 'Status', accessor: (a) => <StatusBadge status={a.status} type="asset" /> },
                    { header: 'Assigned To', accessor: (a) => a.assignedTo ? `${a.assignedTo.firstName} ${a.assignedTo.lastName}` : 'Unassigned' },
                    { header: 'Location', accessor: (a) => a.location },
                ]}
            />
        </div>
    );
};

export default AssetList;
