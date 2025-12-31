import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-red-50/30">
                    <div className="flex items-center gap-2 text-red-600 font-semibold">
                        <AlertTriangle size={20} />
                        <span>Delete Confirmation</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 animate-bounce">
                        <Trash2 size={40} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h4>
                    <p className="text-gray-500 mb-1">
                        You are about to delete <span className="font-semibold text-gray-700">"{title}"</span>.
                    </p>
                    <p className="text-sm text-gray-400">
                        {message || 'This action cannot be undone. All associated data will be permanently removed.'}
                    </p>
                </div>

                {/* Actions */}
                <div className="px-6 py-6 bg-gray-50 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 hover:text-gray-800 transition-all font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Trash2 size={18} />
                        )}
                        <span>{isLoading ? 'Deleting...' : 'Delete Now'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
