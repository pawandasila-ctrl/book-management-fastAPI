import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleUpdate = (book) => {
        const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
        if (!isLoggedIn) {
            toast.error('Please login first to edit a book');
            navigate('/login?next=/');
            return;
        }
        navigate('/update', { state: { book } });
    };

    const handleDelete = (bookId) => {
        const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
        if (!isLoggedIn) {
            toast.error(
                'Please login first to delete a book',
                {icon : '🔒'} , 
                {description: 'You must be logged in to delete books.'}
            );
            navigate('/login?next=/');
            return;
        }
        axios.delete(`${import.meta.env.VITE_API_URL}/delete/${bookId}`)
            .then(() => {
                setBooks(books.filter(book => book.id !== bookId));
                toast.success('Book deleted successfully');
            })
            .catch(err => {
                console.error(err);
                setError(err.response?.data?.error || 'Failed to delete book. Please verify your authentication.');
                toast.error(
                'You can only delete books that you own',
                {icon : '🔒'} , 
                {description: 'You must be the owner of the book to delete it.'}
            );
            });
    };

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}`)
            .then(res => {
                if (Array.isArray(res.data)) {
                    setBooks(res.data);
                } else {
                    console.error('Expected an array but got:', res.data);
                }
            })
            .catch(err => {
                console.error(err);
                setError('Could not fetch books. Please check if the backend server is running.');
            });
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 mt-8">
            {/* Header row */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Book List</h2>
                <Link to="/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors text-sm text-center">
                    + Add Book
                </Link>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-lg mb-6 text-sm" role="alert">
                {error}
              </div>
            )}

            {books.length !== 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th scope="col" className="p-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                                        Publisher
                                    </th>
                                    <th scope="col" className="p-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                                        Book Name
                                    </th>
                                    <th scope="col" className="p-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                                        Publish Date
                                    </th>
                                    <th scope="col" className="p-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                                        Cost (₹)
                                    </th>
                                    <th scope="col" className="p-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                                        Owner
                                    </th>
                                    <th scope="col" className="p-4 text-slate-500 font-semibold text-xs uppercase tracking-wider text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map(book => (
                                    <tr key={book.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                                        <td className="p-4 text-slate-600 font-medium">{book.publisher}</td>
                                        <td className="p-4 text-slate-900 font-bold">{book.name}</td>
                                        <td className="p-4 text-slate-500">{book.date}</td>
                                        <td className="p-4 text-emerald-600 font-semibold">{book.Cost}</td>
                                        <td className="p-4 text-slate-600">{book.owner}</td>
                                        <td className="p-4 text-right">
                                            <button 
                                                className="text-indigo-600 hover:text-indigo-900 font-semibold mr-4 text-sm transition-colors cursor-pointer"
                                                onClick={() => handleUpdate(book)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="text-rose-600 hover:text-rose-900 font-semibold text-sm transition-colors cursor-pointer"
                                                onClick={() => handleDelete(book.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* TailWind Empty State Component */
                <div className="border-2 border-dashed border-slate-200 bg-white rounded-xl p-12 text-center shadow-sm flex flex-col items-center justify-center">
                    <div className="text-slate-400 mb-4">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="w-14 h-14"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            strokeWidth="1.5"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" 
                            />
                        </svg>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">No books in collection</h4>
                    <p className="text-slate-500 text-sm max-w-sm mb-6">
                        Your library is currently empty. Click the button below to add your very first book to the dashboard.
                    </p>
                    <div>
                        <Link to="/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-colors text-center inline-block">
                            + Add Book
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Books;