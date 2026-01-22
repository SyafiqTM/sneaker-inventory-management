import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    IconButton,
    CircularProgress,
    Alert,
    Box,
    Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import { useNavigate } from "react-router-dom";
import {
    getAllItems,
    createNewItem,
    deleteItem,
    searchItems,
    getItemById,
} from "../services/api";
import ConfirmDialog from "./ConfirmDialog.jsx";

// Mock inventory data with CDN image URLs
const mockupItems = [
    {
        id: 1,
        name: "Nike Air Zoom Pegasus 40",
        sku: "PEG-40-BLK-42",
        size: 42,
        quantity: 15,
        price: 129.99,
        imageUrl: "https://picsum.photos/seed/nike-pegasus-40/300/300",
    },
    {
        id: 2,
        name: "Nike Air Force 1",
        sku: "AF1-WHT-43",
        size: 43,
        quantity: 8,
        price: 119.99,
        imageUrl: "https://picsum.photos/seed/nike-air-force-1/300/300",
    },
    {
        id: 3,
        name: "Nike Dunk Low Retro",
        sku: "DUNK-LOW-RETRO-41",
        size: 41,
        quantity: 12,
        price: 139.99,
        imageUrl: "https://picsum.photos/seed/nike-dunk-low-retro/300/300",
    },
    {
        id: 4,
        name: "Nike Air Max 90",
        sku: "AM90-GREY-44",
        size: 44,
        quantity: 6,
        price: 149.99,
        imageUrl: "https://picsum.photos/seed/nike-air-max-90/300/300",
    },
];

function InventoryList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const navigate = useNavigate();

    // Fetch items on start component
    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            setError(null);

            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Load mock items
            setItems(mockupItems);
        } catch (err) {
            setError("Failed to fetch items.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    // Confirm and execute delete
    const handleDeleteConfirm = async () => {
        try {
            if (!itemToDelete) return;

            // Remove the item locally from the mock data
            setItems((prevItems) =>
                prevItems.filter((item) => item.id !== itemToDelete.id),
            );

            //TODO: load deleteItem from API   
            //await deleteItem(itemToDelete.id);


            setDeleteDialogOpen(false);
            setItemToDelete(null);

            // Refresh the list
            fetchItems();
        } catch (err) {
            setError("Failed to delete item. Please try again.");
            console.error("Error deleting item:", err);
            setDeleteDialogOpen(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    if (loading) {
        return (
            <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h4" component="h1">
                    Inventory List
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/items/new")}
                >
                    Add Item
                </Button>
            </Box>

            {/* Error message */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Inventory table */}
            {items.length > 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>SKU</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Price ($)</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>
                                        <Box
                                            component="img"
                                            src={item.imageUrl}
                                            alt={item.name}
                                            loading="lazy"
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                borderRadius: 1,
                                                objectFit: "cover",
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.sku}</TableCell>
                                    <TableCell>{item.size}</TableCell>
                                    <TableCell align="right">{item.quantity}</TableCell>
                                    <TableCell align="right">{item.price.toFixed(2)}</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="primary"
                                            size="small"
                                            onClick={() => navigate(`/items/${item.id}/edit`)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() => handleDeleteClick(item)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Delete confirmation dialog */}
            <ConfirmDialog
                open={deleteDialogOpen}
                title="Delete item"
                content={
                    itemToDelete
                        ? `Are you sure you want to delete "${itemToDelete.name}"?`
                        : "Are you sure you want to delete this item?"
                }
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
            />
        </Container>
    );
}

export default InventoryList;
