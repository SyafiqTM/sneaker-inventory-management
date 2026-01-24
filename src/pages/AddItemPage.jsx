
import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { createNewItem } from '../services/api';
import { validateItemForm } from '../utils/validation';
import { useUser } from '../context/UserContext.jsx';

function AddItemPage() {
  const navigate = useNavigate();
  const { userName, sessionId } = useUser();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateItemForm(formData);
    
    if (!userName) {
      setApiError('Please set your user name in the top right corner before adding an item.');
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit to API
    try {
      setLoading(true);
      setApiError(null);
      
      // Convert string values to numbers
      const itemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        quantity: parseInt(formData.quantity, 10),
        price: parseFloat(formData.price),
        lastModifiedBy: userName,
        sessionId: sessionId,
      };

      await createNewItem(itemData);
      
      setSuccess(true);
      
      // Redirect to inventory list after short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err) {
      setApiError('Failed to create item. Please try again.');
      console.error('Error creating item:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Add New Item
          </Typography>
        </Box>

        {/* Success message */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Item created successfully! Redirecting...
          </Alert>
        )}

        {/* API error message */}
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError(null)}>
            {apiError}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Name field */}
            <TextField
              label="Item Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name || 'Enter the name of the item'}
              required
              fullWidth
              disabled={loading || success}
            />

            {/* Description field */}
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={Boolean(errors.description)}
              helperText={errors.description || 'Optional: Add a description'}
              multiline
              rows={3}
              fullWidth
              disabled={loading || success}
            />

            {/* Quantity field */}
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              error={Boolean(errors.quantity)}
              helperText={errors.quantity || 'Enter quantity as a whole number'}
              required
              fullWidth
              inputProps={{ min: 0, step: 1 }}
              disabled={loading || success}
            />

            {/* Price field */}
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={Boolean(errors.price)}
              helperText={errors.price || 'Enter price (e.g., 19.99)'}
              required
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              disabled={loading || success}
            />

            {/* Action buttons */}
            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading || success}
                fullWidth
              >
                {loading ? 'Creating...' : 'Create Item'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={loading || success}
                fullWidth
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default AddItemPage;