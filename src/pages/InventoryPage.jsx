import { useNavigate } from "react-router-dom";
import InventoryList from "../components/InventoryList.jsx";

function InventoryPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <span>Sneaker Store</span>
        <span>/</span>
        <span className="text-foreground font-medium">Inventory</span>
      </nav>

      <InventoryList
        onCreate={() => navigate("/add")}
        onEdit={(id) => navigate(`/edit/${id}`)}
      />
    </div>
  );
}

export default InventoryPage;
