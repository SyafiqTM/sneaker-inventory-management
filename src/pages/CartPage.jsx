import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, X, ArrowLeft } from 'lucide-react';
import { getAllSneakers } from '../services/api';
import { transformSneakersFromApi } from '../models/cart';
import './CartPage.css';

function CartPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllSneakers();
        
        if(data.length === 0) {
          setProducts([]);
          setError('No sneakers available at the moment.');
          return;
        }
        
        // Transform API response to domain models using only necessary fields
        const transformedData = transformSneakersFromApi(data);
        setProducts(transformedData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product.id];
    
    if (!selectedSize) {
      alert('Please select a size first!');
      return;
    }

    // Find the stock for the selected size
    const sizeInfo = product.sizes.find(s => s.size === selectedSize);
    if (!sizeInfo || !sizeInfo.isAvailable) {
      alert('This size is out of stock!');
      return;
    }

    const existingItem = cart.find(
      item => item.id === product.id && item.size === selectedSize
    );

    // Check if we're trying to add more than available stock
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    if (currentQuantityInCart >= sizeInfo.stock) {
      // alert(`Sorry, only ${sizeInfo.stock} items available for this size.`);
      //just show the cart
      setCartOpen(true);
      return;
    }

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && item.size === selectedSize
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, size: selectedSize, quantity: 1 }]);
    }
    
    setCartOpen(true);
  };

  const updateQuantity = (itemId, size, delta) => {
    setCart(cart.map(item => {
      if (item.id === itemId && item.size === size) {
        const newQuantity = item.quantity + delta;
        
        // Don't allow quantity below 1
        if (newQuantity < 1) return item;
        
        // Check stock when increasing quantity
        if (delta > 0) {
          const sizeInfo = item.sizes.find(s => s.size === size);
          if (sizeInfo && newQuantity > sizeInfo.stock) {
            // alert(`Sorry, only ${sizeInfo.stock} items available for this size.`);
            return item;
          }
        }
        
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (itemId, size) => {
    setCart(cart.filter(item => !(item.id === itemId && item.size === size)));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes({ ...selectedSizes, [productId]: size });
  };

  const handleCloseCart = () => {
    setIsClosing(true);
    setTimeout(() => {
      setCartOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  return (
    <div className="cart-page-container">
      {/* Header */}
      <header className="cart-header">
        <div className="cart-header-content">
          <h1 className="cart-header-title">Sneaker Store</h1>
          <button onClick={() => setCartOpen(true)} className="cart-icon-btn">
            <ShoppingCart size={28} />
            {totalItems > 0 && (
              <span className="cart-badge">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Product Grid */}
      <main className="cart-main">
        {/* Back Button */}
        <div className="back-button-container">
          <button onClick={() => navigate('/')} className="back-to-inventory-btn">
            <ArrowLeft size={20} />
            Back to Inventory
          </button>
        </div>
        
        <h2 className="cart-main-title">Featured Sneakers</h2>
        
        {loading ? (
          <div className="loading-container">
            <p className="loading-text">Loading sneakers...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-text">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-container">
            <p className="loading-text">No sneakers available at the moment.</p>
          </div>
        ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <div className="product-content">
                <h3 className="product-name">
                  {product.name}
                </h3>
                <p className="product-color">
                  {product.color}
                </p>
                <p className="product-price">
                  RM{product.price.toFixed(2)}
                </p>
                
                <p className="size-label">
                  Select Size:
                </p>
                <div className="size-buttons">
                  {product.sizes.map((sizeObj) => {
                    const isSelected = selectedSizes[product.id] === sizeObj.size;
                    return (
                      <button
                        key={sizeObj.size}
                        onClick={() => sizeObj.isAvailable && handleSizeSelect(product.id, sizeObj.size)}
                        className={`size-button ${isSelected ? 'selected' : ''} ${!sizeObj.isAvailable ? 'disabled' : ''}`}
                        disabled={!sizeObj.isAvailable}
                      >
                        {sizeObj.size}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  className="add-to-cart-btn"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </main>

      {/* Cart Drawer */}
      {cartOpen && (
        <>
          <div
            className={`cart-backdrop ${isClosing ? 'closing' : ''}`}
            onClick={handleCloseCart}
          />
          <div className={`cart-drawer ${isClosing ? 'closing' : ''}`}>
            {/* Cart Header */}
            <div className="cart-drawer-header">
              <h2 className="cart-drawer-title">Your Cart</h2>
              <button onClick={handleCloseCart} className="cart-close-btn">
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="cart-items-container">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingCart size={64} className="empty-cart-icon" />
                  <h3 className="empty-cart-title">Your cart is empty</h3>
                  <p className="empty-cart-text">
                    Add some sneakers to get started!
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="cart-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-content">
                      <h4 className="cart-item-name">
                        {item.name}
                      </h4>
                      <p className="cart-item-size">
                        Size: {item.size}
                      </p>
                      <p className="cart-item-price">
                        RM{item.price.toFixed(2)}
                      </p>
                      
                      <div className="cart-item-controls">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, -1)}
                          disabled={item.quantity <= 1}
                          className="quantity-btn"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity-display">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, 1)}
                          className="quantity-btn"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="remove-item-btn"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-subtotal">
                  <h3 className="cart-subtotal-label">Subtotal:</h3>
                  <p className="cart-subtotal-amount">
                    RM{subtotal.toFixed(2)}
                  </p>
                </div>
                
                <button onClick={handleCloseCart} className="continue-shopping-btn">
                  <ArrowLeft size={20} />
                  Continue Shopping
                </button>
                
                <button
                  onClick={() => alert('Proceeding to checkout...')}
                  className="checkout-btn"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;