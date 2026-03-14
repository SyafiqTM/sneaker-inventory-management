import { useState } from 'react';
import { User } from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';

const LoginModal = () => {
    const { isAuthenticated, isLoading: contextLoading, login } = useUser();
    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userName.trim()) {
            setError('Please enter your name');
            return;
        }

        if (userName.trim().length > 25) {
            setError('Name cannot exceed 25 characters');
            return;
        }

        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(userName.trim())) {
            setError('Name can only contain letters (a-z, A-Z) and spaces');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await login(userName.trim());
        } catch (err) {
            setError('Failed to create session. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Don't show modal if already authenticated or context is loading
    if (isAuthenticated || contextLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm">
            <div className="bg-background w-full max-w-sm mx-4 p-8 shadow-2xl">
                <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground mb-6">
                    <User className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-extrabold uppercase tracking-tight mb-1">Welcome</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Enter your name to access the inventory manager.
                </p>

                {error && (
                    <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                        Your Name
                    </label>
                    <input
                        autoFocus
                        type="text"
                        value={userName}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || /^[a-zA-Z\s]*$/.test(value)) {
                                setUserName(value);
                                setError('');
                            }
                        }}
                        onKeyPress={(e) => { if (e.key === 'Enter') handleSubmit(e); }}
                        disabled={loading}
                        placeholder="Enter your full name"
                        maxLength={25}
                        className="w-full px-3 py-2.5 text-sm border border-border bg-card focus:outline-none focus:ring-1 focus:ring-foreground mb-1"
                    />
                    <p className="text-xs text-muted-foreground mb-6">{userName.length}/25 characters</p>

                    <button
                        type="submit"
                        disabled={loading || !userName.trim()}
                        className="w-full bg-primary text-primary-foreground py-3 font-bold uppercase text-sm tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? 'Connecting...' : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
