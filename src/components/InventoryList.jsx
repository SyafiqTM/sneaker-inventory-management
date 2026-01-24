import { useState, useEffect } from "react";
import {
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
  Menu,
  MenuItem,
  LinearProgress,
  TextField,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import Swal from 'sweetalert2';

import { getAllSneakers, deleteItem } from "../services/api";
import { transformSneakersForInventory } from "../models/inventory";

function InventoryList({ onCreate, onEdit }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Fetch items on start component
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllSneakers();

      if (data.length === 0) {
        setItems([]);
        setError("No products available at the moment.");
        return;
      }

      // Transform API response to domain models
      const transformedData = transformSneakersForInventory(data);
      setItems(transformedData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch items:", err);
      setError("Failed to fetch items.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (item) => {
    const result = await Swal.fire({
      title: 'Delete Item',
      text: `Are you sure you want to delete "${item.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        // Call API to delete item
        await deleteItem(item.id);

        // Show success toast
        setToastMessage("Item deleted successfully");
        setToastOpen(true);

        // Refresh the list
        fetchItems();
      } catch (err) {
        console.error("Error deleting item:", err);
        setError("Failed to delete item. Please try again.");
      }
    }
  };

  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleUpdate = () => {
    if (selectedItem && onEdit) {
      onEdit(selectedItem.id);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedItem) {
      handleDeleteClick(selectedItem);
    }
    handleMenuClose();
  };

  const getStockColor = (level) => {
    switch (level) {
      case "High":
        return "#22c55e";
      case "Low":
        return "#ef4444";
      case "Out":
        return "#9ca3af";
      default:
        return "#3b82f6";
    }
  };

  const getStockProgress = (level, stock) => {
    if (level === "Out") return 0;
    if (level === "Low") return 30;
    return 80;
  };

  const calculateStockLevel = (sizes) => {
    const totalStock = sizes.reduce((sum, size) => sum + size.stock, 0);
    if (totalStock === 0) return "Out";
    if (totalStock < 20) return "Low";
    return "High";
  };

  const calculateTotalStock = (sizes) => {
    return sizes.reduce((sum, size) => sum + size.stock, 0);
  };

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Title */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Inventory
        </Typography>
      </Box>

      {/* Tabs and Controls */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        sx={{ borderBottom: 1, borderColor: "#e5e7eb" }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
          >
            <ViewModuleIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontWeight: 600 }}>All product</Typography>
          </Box>
          <Box>
            <Button
              sx={{ textTransform: "none", color: "#6b7280" }}
              onClick={onCreate}
            >
              + New Sneaker
            </Button>
          </Box>
        </Box>

        {/* Search Input */}
        <TextField
          size="small"
          placeholder="Search Products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            pb: 1,
            width: 250,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f9fafb",
              borderRadius: 2,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#9ca3af" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Inventory table */}
      {filteredItems.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{ boxShadow: "none", border: "1px solid #e5e7eb" }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                  Product name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                  SKU
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                  Category
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                  Current Stock
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                  Unit Price
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: "#6b7280" }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item) => {
                const totalStock = calculateTotalStock(item.sizes);
                const stockLevel = calculateStockLevel(item.sizes);

                return (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{ "&:hover": { backgroundColor: "#f9fafb" } }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 1,
                            objectFit: "cover",
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item.sku}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item.category}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          {totalStock} unit  {stockLevel}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={getStockProgress(stockLevel, totalStock)}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: "#e5e7eb",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: getStockColor(stockLevel),
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        RM{item.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, item)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleUpdate}>
          <EditIcon sx={{ mr: 1, fontSize: 20 }} />
          Update
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20, color: "#ef4444" }} />
          <Typography sx={{ color: "#ef4444" }}>Delete</Typography>
        </MenuItem>
      </Menu>

      {/* Success Toast */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default InventoryList;

