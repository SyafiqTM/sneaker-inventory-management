import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Breadcrumbs, Link, Typography, Button, Box, Snackbar, Alert } from "@mui/material";
import ItemPage from "../components/ItemPage.jsx";

function AddSneakerPage() {
  const navigate = useNavigate();
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleCancel = () => {
    navigate("/");
  };

  const handleSubmitSuccess = () => {
    setToastMessage("Sneaker created successfully");
    setToastOpen(true);
    
    // Navigate after showing toast
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 3, color: "#6b7280" }}>
        <Link
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          Sneaker Store
        </Link>
        <Link
          underline="hover"
          color="inherit"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Inventory
        </Link>
        <Typography color="text.primary">Create New Sneaker</Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Add New Sneaker
      </Typography>

      <ItemPage onCancel={handleCancel} onSubmitSuccess={handleSubmitSuccess} />

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
    </Container>
  );
}

export default AddSneakerPage;
