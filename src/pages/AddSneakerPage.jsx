import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemPage from "../components/ItemPage.jsx";

function AddSneakerPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: "" });

  const handleSubmitSuccess = () => {
    setToast({ show: true, message: "Sneaker created successfully" });
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <span>Sneaker Store</span>
        <span>/</span>
        <button
          onClick={() => navigate("/")}
          className="hover:text-foreground transition-colors"
        >
          Inventory
        </button>
        <span>/</span>
        <span className="text-foreground font-medium">Create New Sneaker</span>
      </nav>

      <h1 className="text-2xl font-extrabold uppercase tracking-tight mb-6">
        Add New Sneaker
      </h1>

      <ItemPage
        onCancel={() => navigate("/")}
        onSubmitSuccess={handleSubmitSuccess}
      />

      {toast.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-green-600 text-white text-sm font-medium shadow-lg z-50">
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default AddSneakerPage;
