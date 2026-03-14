import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { validateSneakerForm } from "../utils/validation";
import { createNewItem, getSneakerById, updateItem } from "../services/api";

const CATEGORY_OPTIONS = ["Casual", "Training", "Running"];
const DEFAULT_SIZES = [36, 37, 38, 39, 40, 41, 42, 43];

function ItemPage({ onCancel, onSubmitSuccess, itemId = null, isEditMode = false }) {
  // Check for prefill query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const shouldPrefill = urlParams.get("prefill") === "true";

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("Casual");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [color, setColor] = useState("");
  const [sizes, setSizes] = useState(
    DEFAULT_SIZES.map((size) => ({ size, stock: "" })),
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);

  // Fetch existing sneaker data when in edit mode
  useEffect(() => {
    const fetchSneakerData = async () => {
      if (isEditMode && itemId) {
        try {
          setFetchLoading(true);
          const data = await getSneakerById(itemId);
          setName(data.name || "");
          setSku(data.sku || "");
          setCategory(data.category || "Casual");
          setPrice(data.price?.toString() || "");
          setImage(data.image || "");
          setColor(data.color || "");
          
          // Map sizes from API data
          if (data.sizes && Array.isArray(data.sizes)) {
            const sizeMap = new Map(data.sizes.map(s => [s.size, s.stock]));
            setSizes(DEFAULT_SIZES.map((size) => ({
              size,
              stock: sizeMap.has(size) ? sizeMap.get(size).toString() : ""
            })));
          }
        } catch (error) {
          console.error("Error fetching sneaker data:", error);
          setSubmitError("Failed to load sneaker data. Please try again.");
        } finally {
          setFetchLoading(false);
        }
      }
    };

    fetchSneakerData();
  }, [isEditMode, itemId]);

  // Prefill form when shouldPrefill is true
  useEffect(() => {
    if (shouldPrefill && !isEditMode) {
      setName("Nike Air Max 90 Premium");
      setSku("NK-AM90-PRM-001");
      setCategory("Running");
      setPrice("499.00");
      setImage("https://source.unsplash.com/random/400x400/?nike-shoes");
      setColor("White");
      setSizes(DEFAULT_SIZES.map((size) => ({ size, stock: "5" })));
    }
  }, [shouldPrefill, isEditMode]);

  const handleSizeChange = (index, field, value) => {
    setSizes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      name,
      sku,
      category,
      price,
      image,
      color,
      sizes,
    };

    const validationErrors = validateSneakerForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitError("");

    const payload = {
      name: name.trim(),
      sku: sku.trim(),
      category,
      price: parseFloat(price),
      image: image.trim(),
      color: color.trim(),
      sizes: sizes
        .filter((s) => s.size !== "" && s.stock !== "")
        .map((s) => ({ size: Number(s.size), stock: Number(s.stock) })),
    };

    try {
      setLoading(true);
      let response;
      
      if (isEditMode && itemId) {
        response = await updateItem(itemId, payload);
        console.log("Sneaker updated successfully:", response);
      } else {
        response = await createNewItem(payload);
        console.log("Sneaker created successfully:", response);
      }
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} sneaker:`, error);
      setSubmitError(
        error.response?.data?.message || 
        `Failed to ${isEditMode ? 'update' : 'create'} sneaker. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper 
      sx={{ 
        p: 4, 
        borderRadius: 2,
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
      }} 
      elevation={0}
    >
      {fetchLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
      <form onSubmit={handleSubmit}>
        {/* Error Message */}
        {submitError && (
          <Box 
            sx={{ 
              mb: 3, 
              p: 2, 
              backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5",
              borderRadius: 1,
              color: "#991b1b"
            }}
          >
            <Typography variant="body2">
              {submitError}
            </Typography>
          </Box>
        )}

        {/* General Information Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3, 
              fontWeight: 600,
              color: "#111827"
            }}
          >
            General Information
          </Typography>

          {/* Product Name */}
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Product Name"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Nike Air Max 90"
              error={!!errors.name}
              helperText={errors.name}
              inputProps={{ maxLength: 255 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fafafa",
                }
              }}
            />
          </Box>

          {/* SKU and Category Row */}
          <Box sx={{ 
            display: "flex", 
            gap: 2, 
            mb: 3,
            flexWrap: "wrap"
          }}>
            <TextField
              label="SKU"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g., NK-AM90-BLK"
              error={!!errors.sku}
              helperText={errors.sku}
              inputProps={{ maxLength: 50 }}
              disabled={isEditMode}
              sx={{ 
                flex: "1 1 250px",
                minWidth: "250px",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fafafa",
                }
              }}
            />
            <TextField
              select
              required
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              error={!!errors.category}
              helperText={errors.category}
              sx={{ 
                flex: "1 1 250px",
                minWidth: "250px",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fafafa",
                }
              }}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Image Path and Color Row */}
          <Box sx={{ 
            display: "flex", 
            gap: 2, 
            mb: 3,
            flexWrap: "wrap"
          }}>
            <TextField
              label="Image Path"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="e.g., /images/sneakers/air-max-90.jpg"
              error={!!errors.image}
              helperText={errors.image}
              sx={{ 
                flex: "1 1 250px",
                minWidth: "250px",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fafafa",
                }
              }}
            />
            <TextField
              label="Color"
              required
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g., Black/White"
              error={!!errors.color}
              helperText={errors.color}
              sx={{ 
                flex: "1 1 250px",
                minWidth: "250px",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fafafa",
                }
              }}
            />
          </Box>

          {/* Price */}
          <Box sx={{ maxWidth: "300px" }}>
            <TextField
              label="Sale Price"
              fullWidth
              required
              type="number"
              inputProps={{ min: 0, max: 99999, step: "0.01" }}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                startAdornment: (
                  <Typography sx={{ mr: 1, color: "#6b7280", fontWeight: 500 }}>
                    RM
                  </Typography>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fafafa",
                }
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Sizes & Stock Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 1, 
              fontWeight: 600,
              color: "#111827"
            }}
          >
            Sizes & Stock
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 3 }}
          >
            Set the available EU sizes and quantity for each size.
          </Typography>

          {errors.sizes && (
            <Typography 
              variant="body2" 
              color="error" 
              sx={{ mb: 2 }}
            >
              {errors.sizes}
            </Typography>
          )}

          {/* Size Grid - 4 columns */}
          <Box 
            sx={{ 
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 2,
              mb: 2
            }}
          >
            {sizes.map((row, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 2,
                  backgroundColor: "#f9fafb",
                  borderRadius: 2,
                  border: "1px solid #e5e7eb",
                }}
              >
                <Box sx={{ 
                  minWidth: "50px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: "#6b7280",
                      fontSize: "0.7rem",
                      mb: 0.5
                    }}
                  >
                    SIZE
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: "#111827"
                    }}
                  >
                    {row.size}
                  </Typography>
                </Box>
                <TextField
                  label="Stock"
                  type="number"
                  size="small"
                  value={row.stock}
                  onChange={(e) => handleSizeChange(index, "stock", e.target.value)}
                  placeholder="0"
                  inputProps={{ min: 0, max: 9999 }}
                  error={!!errors.sizeErrors?.[index]}
                  helperText={errors.sizeErrors?.[index]}
                  ></TextField>
              </Box>
            ))}
          </Box>
          {/* Action Buttons */}
        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "flex-end", 
            gap: 2,
            pt: 2,
            borderTop: "1px solid #e5e7eb"
          }}
        >
          <Button 
            variant="outlined" 
            onClick={onCancel}
            disabled={loading}
            sx={{
              borderColor: "#d1d5db",
              color: "#6b7280",
              "&:hover": {
                borderColor: "#9ca3af",
                backgroundColor: "#f9fafb"
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0"
              },
              px: 4
            }}
          >
            {loading ? "Saving..." : (isEditMode ? "Update Sneaker" : "Save Sneaker")}
          </Button>
        </Box>
        </Box>
      </form>
      )}
    </Paper>
  );
}

export default ItemPage;
