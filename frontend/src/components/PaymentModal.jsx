import { useState, useEffect } from 'react';

export default function PaymentModal({ sweet, onClose, onConfirm }) {
    const [processing, setProcessing] = useState(false);
    const [method, setMethod] = useState('card');
    const [step, setStep] = useState(1); // 1: Method, 2: Processing, 3: Success

    const handlePay = async () => {
        setProcessing(true);
        setStep(2);
        // Simulate network delay for "Interactivity"
        await new Promise(resolve => setTimeout(resolve, 1500));
        try {
            await onConfirm(sweet.id);
            setStep(3);
            setTimeout(onClose, 1500); // Auto close after success
        } catch (e) {
            setProcessing(false);
            setStep(1);
        }
    };

    if (step === 3) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center transform scale-100 transition-all animate-bounce-subtle">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Delicious!</h3>
                    <p className="text-gray-600 mt-2">Your {sweet.name} is on its way.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all scale-100">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                    <h3 className="text-xl font-bold text-white">Checkout</h3>
                    <p className="text-indigo-100 text-sm mt-1">Buying: {sweet.name}</p>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="text-gray-600">Total Amount</span>
                        <span className="text-2xl font-bold text-gray-900">${sweet.price}</span>
                    </div>

                    {step === 2 ? (
                        <div className="py-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Processing payment...</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3 mb-6">
                                <p className="text-sm font-medium text-gray-700">Select Payment Method</p>
                                <button
                                    onClick={() => setMethod('card')}
                                    className={`w-full flex items-center p-4 border rounded-xl transition-all ${method === 'card' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-indigo-300'}`}
                                >
                                    <span className="text-xl mr-3">💳</span>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-800">Credit Card</p>
                                        <p className="text-xs text-gray-500">Mastercard ending in 4242</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setMethod('cash')}
                                    className={`w-full flex items-center p-4 border rounded-xl transition-all ${method === 'cash' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-indigo-300'}`}
                                >
                                    <span className="text-xl mr-3">💵</span>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-800">Cash on Delivery</p>
                                        <p className="text-xs text-gray-500">Pay when you receive</p>
                                    </div>
                                </button>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={onClose} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handlePay} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                    Pay Now
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
