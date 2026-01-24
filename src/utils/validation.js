export const validateSneakerForm = (formData) => {
	const errors = {};

	// Product Name validation
	const name = (formData?.name ?? "").trim();
	if (!name) {
		errors.name = "Product name is required.";
	} else if (name.length > 255) {
		errors.name = "Product name must not exceed 255 characters.";
	}

	// SKU validation
	const sku = (formData?.sku ?? "").trim();
	if (!sku) {
		errors.sku = "SKU is required.";
	} else if (sku.length > 50) {
		errors.sku = "SKU must not exceed 50 characters.";
	}

	// Category validation
	if (!formData?.category) {
		errors.category = "Category is required.";
	}

	// Price validation
	const priceRaw = formData?.price ?? "";
	const price = Number(priceRaw);
	if (priceRaw === "" || Number.isNaN(price)) {
		errors.price = "Sales price is required.";
	} else if (price < 0) {
		errors.price = "Sales price cannot be negative.";
	} else if (price > 99999) {
		errors.price = "Sales price cannot exceed 99,999.";
	}

	// Image validation
	const image = (formData?.image ?? "").trim();
	if (!image) {
		errors.image = "Image path is required.";
	}

	// Color validation
	const color = (formData?.color ?? "").trim();
	if (!color) {
		errors.color = "Color is required.";
	} else if (!/^[a-zA-Z\/]+$/.test(color)) {
		errors.color = "Color can only contain letters and forward slashes.";
	}

	// Sizes validation
	const sizes = formData?.sizes ?? [];
	const sizeErrors = [];
	let hasValidSize = false;

	sizes.forEach((sizeItem, index) => {
		const stockRaw = sizeItem?.stock ?? "";
		const stock = Number(stockRaw);
		
		if (stockRaw !== "") {
			hasValidSize = true;
			if (Number.isNaN(stock) || !Number.isInteger(stock)) {
				sizeErrors[index] = "Stock must be a whole number.";
			} else if (stock < 0) {
				sizeErrors[index] = "Stock cannot be negative.";
			} else if (stock > 9999) {
				sizeErrors[index] = "Stock cannot exceed 9999.";
			}
		}
	});

	if (!hasValidSize) {
		errors.sizes = "At least one size with stock is required.";
	} else if (sizeErrors.length > 0) {
		errors.sizeErrors = sizeErrors;
	}

	return errors;
};

