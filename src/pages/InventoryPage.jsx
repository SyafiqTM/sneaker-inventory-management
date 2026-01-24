import { useState } from "react";
import { Container, Breadcrumbs, Link, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InventoryList from "../components/InventoryList.jsx";

function InventoryPage() {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate("/add");
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3, color: "#6b7280" }}>
        <Link
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          Sneaker Store
        </Link>
        <Typography color="text.primary">Inventory</Typography>
      </Breadcrumbs>

      <InventoryList onCreate={handleCreateNew} onEdit={handleEdit} />
    </Container>
  );
}

export default InventoryPage;

