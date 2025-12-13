import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
    const [sweets, setSweets] = useState([]);
    const [newSweet, setNewSweet] = useState({ name: '', category: '', price: 0, quantity: 0 });
    const [restockAmount, setRestockAmount] = useState({});

    useEffect(() => {
        fetchSweets();
    }, []);

    const fetchSweets = async () => {
        const response = await api.get('/sweets/');
        setSweets(response.data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sweets/', newSweet);
            setNewSweet({ name: '', category: '', price: 0, quantity: 0 });
            fetchSweets();
        } catch (error) {
            alert('Failed to create sweet. Admin rights required?');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this sweet?")) return;
        try {
            await api.delete(`/sweets/${id}`);
            fetchSweets();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const handleRestock = async (id) => {
        const amount = parseInt(restockAmount[id]);
        if (!amount || amount <= 0) return;
        try {
            await api.post(`/sweets/${id}/restock`, { quantity: amount });
            setRestockAmount({ ...restockAmount, [id]: '' });
            fetchSweets();
        } catch (error) {
            alert('Failed to restock');
        }
    };

    const [editingSweet, setEditingSweet] = useState(null);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/sweets/${editingSweet.id}`, editingSweet);
            setEditingSweet(null);
            fetchSweets();
        } catch (error) {
            alert('Failed to update sweet');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Admin Inventory Management</h1>
                    <Link to="/" className="text-indigo-600 hover:underline">Back to Dashboard</Link>
                </div>

                {/* Edit Modal */}
                {editingSweet && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white p-6 rounded shadow max-w-md w-full">
                            <h2 className="text-xl font-bold mb-4">Edit Sweet</h2>
                            <form onSubmit={handleUpdate} className="grid gap-4">
                                <input placeholder="Name" className="border p-2 rounded" value={editingSweet.name} onChange={e => setEditingSweet({ ...editingSweet, name: e.target.value })} />
                                <input placeholder="Category" className="border p-2 rounded" value={editingSweet.category} onChange={e => setEditingSweet({ ...editingSweet, category: e.target.value })} />
                                <input type="number" step="0.01" placeholder="Price" className="border p-2 rounded" value={editingSweet.price} onChange={e => setEditingSweet({ ...editingSweet, price: parseFloat(e.target.value) })} />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button type="button" onClick={() => setEditingSweet(null)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Create Form */}
                <div className="bg-white p-6 rounded shadow mb-8">
                    <h2 className="text-lg font-semibold mb-4">Add New Sweet</h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <input required placeholder="Name" className="border p-2 rounded" value={newSweet.name} onChange={e => setNewSweet({ ...newSweet, name: e.target.value })} />
                        <input required placeholder="Category" className="border p-2 rounded" value={newSweet.category} onChange={e => setNewSweet({ ...newSweet, category: e.target.value })} />
                        <input required type="number" step="0.01" placeholder="Price" className="border p-2 rounded" value={newSweet.price} onChange={e => setNewSweet({ ...newSweet, price: parseFloat(e.target.value) })} />
                        <input required type="number" placeholder="Qty" className="border p-2 rounded" value={newSweet.quantity} onChange={e => setNewSweet({ ...newSweet, quantity: parseInt(e.target.value) })} />
                        <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">Add</button>
                    </form>
                </div>

                {/* List */}
                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sweets.map(sweet => (
                                <tr key={sweet.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{sweet.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{sweet.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">${sweet.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                        <input
                                            type="number"
                                            className="border w-20 p-1 rounded text-sm"
                                            placeholder="Qty"
                                            value={restockAmount[sweet.id] || ''}
                                            onChange={e => setRestockAmount({ ...restockAmount, [sweet.id]: e.target.value })}
                                        />
                                        <button onClick={() => handleRestock(sweet.id)} className="text-blue-600 hover:text-blue-900 text-sm">Restock</button>
                                        <button onClick={() => setEditingSweet(sweet)} className="text-yellow-600 hover:text-yellow-900 text-sm ml-2">Edit</button>
                                        <button onClick={() => handleDelete(sweet.id)} className="text-red-600 hover:text-red-900 text-sm ml-2">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
