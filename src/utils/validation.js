export const validateItemForm = (formData) => {
	const errors = {};

	const name = (formData?.name ?? "").trim();
	const description = (formData?.description ?? "").trim();
	const quantityRaw = formData?.quantity ?? "";
	const priceRaw = formData?.price ?? "";

	if (!name) {
		errors.name = "Name is required.";
	} else if (name.length < 2) {
		errors.name = "Name must be at least 2 characters.";
	}

	if (description && description.length > 500) {
		errors.description = "Description is too long (max 500 chars).";
	}

	const quantity = Number(quantityRaw);
	if (quantityRaw === "" || Number.isNaN(quantity)) {
		errors.quantity = "Quantity is required.";
	} else if (!Number.isInteger(quantity)) {
		errors.quantity = "Quantity must be a whole number.";
	} else if (quantity < 0) {
		errors.quantity = "Quantity cannot be negative.";
	}

	const price = Number(priceRaw);
	if (priceRaw === "" || Number.isNaN(price)) {
		errors.price = "Price is required.";
	} else if (price < 0) {
		errors.price = "Price cannot be negative.";
	}

	return errors;
};

