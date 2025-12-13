import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';

export default function Dashboard() {
    const [sweets, setSweets] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedSweet, setSelectedSweet] = useState(null); // For modal
    const { user, logout } = useAuth();

    useEffect(() => {
        fetchSweets();
    }, [search]);

    const fetchSweets = async () => {
        try {
            setLoading(true);
            const endpoint = search ? `/sweets/search?q=${search}` : '/sweets/';
            const response = await api.get(endpoint);
            setSweets(response.data);
        } catch (error) {
            console.error("Failed to fetch sweets", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchaseConfirm = async (id) => {
        await api.post(`/sweets/${id}/purchase`);
        fetchSweets(); // Refresh stock
    };

    return (
        <div className="min-h-screen bg-gray-50 bg-gradient-to-br from-indigo-50 to-pink-50">
            {/* Navbar with Glassmorphism */}
            <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🍬</span>
                            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                Sweet Shop
                            </h1>
                        </div>
                        <div className="flex items-center space-x-6">
                            <Link to="/admin" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                                Worker Panel
                            </Link>
                            <button
                                onClick={logout}
                                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all font-medium text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Search Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Fresh Sweets</h2>
                        <p className="text-gray-500 mt-1">Treat yourself to something tasty today.</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search for Laddu..."
                            className="w-full px-4 py-3 rounded-xl border-none shadow-md focus:ring-2 focus:ring-indigo-400 bg-white placeholder-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-2xl"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sweets.map(sweet => (
                            <div
                                key={sweet.id}
                                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between transform hover:-translate-y-1"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{sweet.name}</h3>
                                            <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-500 uppercase tracking-wide">
                                                {sweet.category}
                                            </span>
                                        </div>
                                        <span className="text-xl font-extrabold text-green-600">${sweet.price}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-50">
                                    <div className="flex justify-between items-center gap-4">
                                        <span className={`text-sm font-medium flex items-center gap-1.5 ${sweet.quantity > 0 ? 'text-gray-500' : 'text-red-500'}`}>
                                            <span className={`w-2.5 h-2.5 rounded-full ${sweet.quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            {sweet.quantity > 0 ? `${sweet.quantity} left` : 'Sold Out'}
                                        </span>

                                        <button
                                            onClick={() => setSelectedSweet(sweet)}
                                            disabled={sweet.quantity < 1}
                                            className={`flex-1 px-4 py-3 rounded-xl font-bold text-white shadow-md transition-all active:scale-95 ${sweet.quantity > 0
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-200'
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                                }`}
                                        >
                                            {sweet.quantity > 0 ? 'Buy Now' : 'Out of Stock'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedSweet && (
                <PaymentModal
                    sweet={selectedSweet}
                    onClose={() => setSelectedSweet(null)}
                    onConfirm={handlePurchaseConfirm}
                />
            )}
        </div>
    );
}
