import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { validateSneakerForm } from "../utils/validation";
import { createNewItem, getSneakerById, updateItem } from "../services/api";

const CATEGORY_OPTIONS = ["Casual", "Training", "Running"];
const DEFAULT_SIZES = [36, 37, 38, 39, 40, 41, 42, 43];

function ItemPage({ onCancel, onSubmitSuccess, itemId = null, isEditMode = false }) {
  const urlParams = new URLSearchParams(window.location.search);
  const shouldPrefill = urlParams.get("prefill") === "true";

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("Casual");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [color, setColor] = useState("");
  const [sizes, setSizes] = useState(
    DEFAULT_SIZES.map((size) => ({ size, stock: "" }))
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);

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
          if (data.sizes && Array.isArray(data.sizes)) {
            const sizeMap = new Map(data.sizes.map((s) => [s.size, s.stock]));
            setSizes(
              DEFAULT_SIZES.map((size) => ({
                size,
                stock: sizeMap.has(size) ? sizeMap.get(size).toString() : "",
              }))
            );
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
    const formData = { name, sku, category, price, image, color, sizes };
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
      if (isEditMode && itemId) {
        await updateItem(itemId, payload);
      } else {
        await createNewItem(payload);
      }
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} sneaker:`, error);
      setSubmitError(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} sneaker. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-3 py-2.5 text-sm border border-border bg-card focus:outline-none focus:ring-1 focus:ring-foreground transition-all";
  const labelCls = "block text-xs font-bold uppercase tracking-wider mb-1.5";
  const errCls = "text-xs text-red-500 mt-1";

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="border border-border p-6 bg-background">
      <form onSubmit={handleSubmit}>
        {submitError && (
          <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {submitError}
          </div>
        )}

        {/* General Information */}
        <div className="mb-8">
          <h2 className="text-base font-bold uppercase tracking-wider mb-6">
            General Information
          </h2>

          <div className="mb-4">
            <label className={labelCls}>Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Nike Air Max 90"
              maxLength={255}
              className={inputCls}
            />
            {errors.name && <p className={errCls}>{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g., NK-AM90-BLK"
                maxLength={50}
                disabled={isEditMode}
                className={`${inputCls} ${isEditMode ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              {errors.sku && <p className={errCls}>{errors.sku}</p>}
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputCls}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.category && <p className={errCls}>{errors.category}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className={inputCls}
              />
              {errors.image && <p className={errCls}>{errors.image}</p>}
            </div>
            <div>
              <label className={labelCls}>Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g., Black/White"
                className={inputCls}
              />
              {errors.color && <p className={errCls}>{errors.color}</p>}
            </div>
          </div>

          <div className="max-w-xs">
            <label className={labelCls}>Sale Price (RM)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              min={0}
              max={99999}
              step="0.01"
              className={inputCls}
            />
            {errors.price && <p className={errCls}>{errors.price}</p>}
          </div>
        </div>

        <hr className="border-border mb-8" />

        {/* Sizes & Stock */}
        <div className="mb-8">
          <h2 className="text-base font-bold uppercase tracking-wider mb-1">
            Sizes & Stock
          </h2>
          <p className="text-xs text-muted-foreground mb-5">
            Set the available EU sizes and quantity for each size.
          </p>
          {errors.sizes && <p className={`${errCls} mb-3`}>{errors.sizes}</p>}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sizes.map((row, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-card border border-border"
              >
                <div className="text-center min-w-[40px]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    SIZE
                  </p>
                  <p className="text-lg font-bold">{row.size}</p>
                </div>
                <input
                  type="number"
                  value={row.stock}
                  onChange={(e) => handleSizeChange(index, "stock", e.target.value)}
                  placeholder="0"
                  min={0}
                  max={9999}
                  className="flex-1 min-w-0 px-2 py-1.5 text-sm border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                />
                {errors.sizeErrors?.[index] && (
                  <p className={errCls}>{errors.sizeErrors[index]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-bold uppercase tracking-wider border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditMode ? "Update Sneaker" : "Save Sneaker"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ItemPage;
