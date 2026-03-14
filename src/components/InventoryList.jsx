import { useState, useEffect, useRef } from "react";
import { Trash2, Edit, MoreVertical, Search, Plus, AlertCircle } from "lucide-react";
import Swal from 'sweetalert2';
import { getAllSneakers, deleteItem } from "../services/api";
import { transformSneakersForInventory } from "../models/inventory";

function InventoryList({ onCreate, onEdit }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const menuRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    setOpenMenuId(null);
    const result = await Swal.fire({
      title: "Delete Item",
      text: `Are you sure you want to delete "${item.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        await deleteItem(item.id);
        setToast({ show: true, message: "Item deleted successfully", type: "success" });
        fetchItems();
      } catch (err) {
        console.error("Error deleting item:", err);
        setError("Failed to delete item. Please try again.");
      }
    }
  };

  const calculateStockLevel = (sizes) => {
    const total = sizes.reduce((sum, s) => sum + s.stock, 0);
    if (total === 0) return "Out";
    if (total < 20) return "Low";
    return "High";
  };

  const calculateTotalStock = (sizes) =>
    sizes.reduce((sum, s) => sum + s.stock, 0);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold uppercase tracking-tight">Inventory</h1>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold uppercase tracking-wide">All Products</span>
          <button
            onClick={onCreate}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            New Sneaker
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search Products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground w-56"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-700 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Table */}
      {filteredItems.length > 0 && (
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-card">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                  Product
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                  SKU
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                  Stock
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                  Price
                </th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const totalStock = calculateTotalStock(item.sizes);
                const stockLevel = calculateStockLevel(item.sizes);
                const stockColor =
                  stockLevel === "High"
                    ? "text-green-600"
                    : stockLevel === "Low"
                    ? "text-red-500"
                    : "text-gray-400";
                const barColor =
                  stockLevel === "High"
                    ? "bg-green-500"
                    : stockLevel === "Low"
                    ? "bg-red-400"
                    : "bg-gray-300";
                const barWidth =
                  stockLevel === "Out" ? "0%" : stockLevel === "Low" ? "30%" : "80%";

                return (
                  <tr
                    key={item.id}
                    className="border-t border-border hover:bg-card/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="w-12 h-12 object-cover bg-card flex-shrink-0"
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{item.sku}</td>
                    <td className="py-3 px-4 text-muted-foreground">{item.category}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`font-medium ${stockColor}`}>{totalStock} units</span>
                          <span className={`text-xs font-semibold ${stockColor}`}>
                            · {stockLevel}
                          </span>
                        </div>
                        <div className="h-1 w-24 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${barColor}`}
                            style={{ width: barWidth }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">RM{item.price.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className="relative" ref={openMenuId === item.id ? menuRef : null}>
                        <button
                          onClick={() =>
                            setOpenMenuId(openMenuId === item.id ? null : item.id)
                          }
                          className="p-1.5 hover:bg-card rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openMenuId === item.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-background border border-border shadow-lg z-10">
                            <button
                              onClick={() => {
                                onEdit(item.id);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-card transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item)}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-card transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 text-sm font-medium text-white shadow-lg z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default InventoryList;
