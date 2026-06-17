import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';

const UpdateBook = () => {
    const location = useLocation();
    const book = location.state.book;

    const [values, setValues] = useState({
        publisher: book.publisher,
        name: book.name,
        date: book.date,
        Cost: book.Cost
    });

    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validateForm = () => {
        const tempErrors = {};
        if (!values.publisher.trim()) {
            tempErrors.publisher = 'Publisher name is required';
        }
        if (!values.name.trim()) {
            tempErrors.name = 'Book name is required';
        }
        if (!values.date) {
            tempErrors.date = 'Publish date is required';
        }
        if (values.Cost === undefined || values.Cost === '') {
            tempErrors.Cost = 'Cost is required';
        } else {
            const costNum = parseFloat(values.Cost);
            if (isNaN(costNum) || costNum < 0) {
                tempErrors.Cost = 'Cost must be a valid positive number';
            }
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleInputChange = (field, val) => {
        setValues({ ...values, [field]: val });

        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setApiError(null);
        setValidated(true);

        if (!validateForm()) {
            return;
        }

        const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
        if (!isLoggedIn) {
            toast.error('Please login first to submit changes');
            navigate('/login');
            return;
        }

        setLoading(true);
        const payload = {
            ...values,
            Cost: parseFloat(values.Cost)
        };

        axios.put(`${import.meta.env.VITE_API_URL}/update/${book.id}`, payload)
            .then(res => {
                toast.success('Book updated successfully');
                navigate('/');
            })
            .catch(err => {
                console.error(err);
                setApiError(err.response?.data?.error || 'Failed to update book. Please verify your authentication.');
                toast.error(
                    'Please login first to delete a book',
                    { icon: '🔒' },
                    { description: 'You must be logged in to delete books.' }
                );
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="flex justify-center items-center px-4 mt-8" style={{ minHeight: '65vh' }}>
            <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl shadow-md p-8">
                <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Update Book</h3>

                {apiError && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-lg mb-4 text-sm" role="alert">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {/* Publisher */}
                    <div>
                        <label htmlFor="publisher" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Publisher</label>
                        <input
                            type="text"
                            className={`w-full px-3.5 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all ${validated && errors.publisher ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                            placeholder="Enter publisher name"
                            id="publisher"
                            value={values.publisher}
                            onChange={(e) => handleInputChange('publisher', e.target.value)}
                            required
                        />
                        {validated && errors.publisher && (
                            <p className="text-rose-500 text-xs mt-1">{errors.publisher}</p>
                        )}
                    </div>

                    {/* Book Name */}
                    <div>
                        <label htmlFor="name" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Book Name</label>
                        <input
                            type="text"
                            className={`w-full px-3.5 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all ${validated && errors.name ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                            placeholder="Enter book title"
                            id="name"
                            value={values.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                        />
                        {validated && errors.name && (
                            <p className="text-rose-500 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Publish Date */}
                    <div>
                        <label htmlFor="date" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Publish Date</label>
                        <input
                            type="date"
                            className={`w-full px-3.5 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all ${validated && errors.date ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                            id="date"
                            value={values.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            required
                        />
                        {validated && errors.date && (
                            <p className="text-rose-500 text-xs mt-1">{errors.date}</p>
                        )}
                    </div>

                    {/* Cost */}
                    <div>
                        <label htmlFor="Cost" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cost (₹)</label>
                        <input
                            type="text"
                            className={`w-full px-3.5 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all ${validated && errors.Cost ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                            placeholder="Enter book cost"
                            id="Cost"
                            value={values.Cost}
                            onChange={(e) => handleInputChange('Cost', e.target.value)}
                            required
                        />
                        {validated && errors.Cost && (
                            <p className="text-rose-500 text-xs mt-1">{errors.Cost}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-2">
                        <Link to="/" className="w-1/2 border border-slate-300 text-slate-700 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-center font-semibold text-sm">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateBook;