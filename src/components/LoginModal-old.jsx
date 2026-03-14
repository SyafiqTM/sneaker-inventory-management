import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Box,
    Typography
} from '@mui/material';
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
    if (isAuthenticated || contextLoading) {
        return null;
    }

    return (
        <Dialog 
            open={!isAuthenticated} 
            disableEscapeKeyDown
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Typography variant="h5" component="div">
                    Welcome to Inventory Manager
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Please enter your name to continue:
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <TextField
                        autoFocus
                        label="Your Name"
                        fullWidth
                        variant="outlined"
                        value={userName}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Only allow letters and spaces
                            if (value === '' || /^[a-zA-Z\s]*$/.test(value)) {
                                setUserName(value);
                                setError('');
                            }
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit(e);
                            }
                        }}
                        disabled={loading}
                        placeholder="Enter your full name"
                        inputProps={{ maxLength: 25 }}
                        helperText={`${userName.length}/25 characters`}
                        error={userName.length > 25}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading || !userName.trim()}
                    startIcon={loading && <CircularProgress size={20} />}
                >
                    {loading ? 'Connecting...' : 'Continue'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginModal;
