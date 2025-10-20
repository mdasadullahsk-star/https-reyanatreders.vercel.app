
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ShoppingCart, Search, User, ArrowDownUp, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import './index.css';

// Logo file path
const LOGO_SRC = '/A_logo.png';

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSorted, setIsSorted] = useState(false);

  // Cart state
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]); // {id, name, price, qty}

  // Checkout form state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', phone: '', address: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  const products = [
    { id: 1, name: 'Herbal Face Cream', category: 'Cosmetics', price: 249, image: 'https://images.unsplash.com/photo-1585386959984-a41552231693' },
    { id: 2, name: 'Luxury Pen Set', category: 'Stationery', price: 499, image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f' },
    { id: 3, name: 'Organic Rice (1kg)', category: 'Grocery', price: 99, image: 'https://images.unsplash.com/photo-1600087626120-5abf8b7e66d2' },
    { id: 4, name: 'Lipstick Combo Pack', category: 'Cosmetics', price: 399, image: 'https://images.unsplash.com/photo-1585386959984-a41552231693' },
    { id: 5, name: 'A4 Notebook Pack', category: 'Stationery', price: 299, image: 'https://images.unsplash.com/photo-1585306679743-6a30d8f6b8b8' },
    { id: 6, name: 'Fresh Lentils (500g)', category: 'Grocery', price: 79, image: 'https://images.unsplash.com/photo-1590080875831-48c6222b5d2d' },
  ];

  const categories = ['All', 'Cosmetics', 'Stationery', 'Grocery'];

  const filteredProducts = products
    .filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  const displayedProducts = isSorted
    ? [...filteredProducts].sort((a, b) => a.price - b.price)
    : filteredProducts;

  // Cart helpers
  const addToCart = (product) => {
    setCartItems(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
    setCartOpen(true);
  };

  const changeQty = (id, delta) => {
    setCartItems(prev => prev
      .map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
      .filter(i => i.qty > 0)
    );
  };

  const removeItem = (id) => setCartItems(prev => prev.filter(i => i.id !== id));

  const cartCount = cartItems.reduce((s, it) => s + it.qty, 0);
  const cartTotal = cartItems.reduce((s, it) => s + it.qty * it.price, 0);

  const openCheckout = () => {
    setCheckoutOpen(true);
    setCartOpen(false);
  };

  const placeOrder = () => {
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
      alert('Please fill name, phone and address to place the order.');
      return;
    }
    setShowSuccess(true);
    setCheckoutOpen(false);
    setCartItems([]);
    setCheckoutForm({ name: '', phone: '', address: '' });
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 text-gray-800">
      {/* Header with logo */}
      <header className="flex items-center justify-between px-6 py-4 bg-green-600 text-white shadow-md">
        <div className="flex items-center gap-3">
          <img src={LOGO_SRC} alt="Reyana Treders" className="h-10 w-10 rounded-sm object-cover" />
          <span className="sr-only">Reyana Treders</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2 text-gray-400" size={18} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 rounded-full text-gray-800"
              placeholder="Search products..."
            />
          </div>

          <User size={22} className="cursor-pointer hover:text-yellow-300" onClick={() => setShowLogin(true)} />

          <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2">
            <ShoppingCart size={22} />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="ml-1 bg-yellow-400 text-green-800 font-semibold px-2 py-0.5 rounded-full text-sm">{cartCount}</span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center py-10 bg-yellow-100">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-3xl font-semibold text-green-700">
          Shop the Best Cosmetics, Stationery & Grocery Products
        </motion.h2>
        <p className="text-gray-600 mt-2">Quality you trust. Prices you’ll love.</p>
      </section>

      {/* Category Filter */}
      <div className="flex justify-center gap-4 my-6 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border ${selectedCategory === cat ? 'bg-green-600 text-white border-green-600' : 'border-green-400 text-green-700 hover:bg-green-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort Button */}
      <div className="flex justify-end px-6 mb-4">
        <button
          onClick={() => setIsSorted(!isSorted)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 shadow-md"
        >
          <ArrowDownUp size={18} /> Sort by Price {isSorted && '(Low → High)'}
        </button>
      </div>

      {/* Product Grid */}
      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((p) => (
            <motion.div key={p.id} whileHover={{ scale: 1.03 }} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <img src={p.image} alt={p.name} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-green-700 font-bold">₹{p.price}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => changeQty(p.id, -1)} className="px-2 py-1 rounded-full border">-</button>
                    <span className="px-2">1</span>
                    <button onClick={() => changeQty(p.id, 1)} className="px-2 py-1 rounded-full border">+</button>
                    <button onClick={() => addToCart(p)} className="bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700">Add</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No products found.</p>
        )}
      </main>

      {/* Side Cart Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl transform transition-transform z-40 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex items-center justify-between border-b">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <button onClick={() => setCartOpen(false)}><X /></button>
        </div>
        <div className="p-4 flex-1 overflow-auto" style={{height: 'calc(100% - 160px)'}}>
          {cartItems.length === 0 ? (
            <p className="text-gray-500 mt-6">Your cart is empty. Add products to get started.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">₹{item.price} each</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => changeQty(item.id, -1)} className="px-2 py-1 rounded-full border">-</button>
                    <span className="px-3">{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)} className="px-2 py-1 rounded-full border">+</button>
                    <button onClick={() => removeItem(item.id)} className="ml-2 text-sm text-red-500">Remove</button>
                  </div>
                </div>
                <div className="text-right font-semibold">₹{item.price * item.qty}</div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Total</span>
            <span className="font-bold">₹{cartTotal}</span>
          </div>
          <button onClick={openCheckout} disabled={cartItems.length===0} className={`w-full py-2 rounded-lg ${cartItems.length===0 ? 'bg-gray-300' : 'bg-green-600 text-white hover:bg-green-700'}`}>Proceed to Checkout (COD)</button>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-96 text-left">
            <div className="flex items-center gap-3 mb-4">
              <img src={LOGO_SRC} alt="logo" className="h-10 w-10 object-cover rounded-sm" />
              <h2 className="text-xl font-bold text-green-700">Checkout</h2>
            </div>

            <input value={checkoutForm.name} onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})} placeholder="Full Name" className="w-full mb-3 p-2 border rounded-lg" />
            <input value={checkoutForm.phone} onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})} placeholder="Phone Number" className="w-full mb-3 p-2 border rounded-lg" />
            <textarea value={checkoutForm.address} onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})} placeholder="Delivery Address" className="w-full mb-3 p-2 border rounded-lg" rows={3} />

            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Payment</span>
              <span className="text-sm text-gray-600">Cash on Delivery</span>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={placeOrder} className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700">Place Order (COD)</button>
              <button onClick={() => setCheckoutOpen(false)} className="py-2 px-3 rounded-lg border">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Login / Signup Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
            <h2 className="text-xl font-bold text-green-700 mb-4">{isSignup ? 'Create Account' : 'Login to Reyana Treders'}</h2>

            {isSignup && <input type="text" placeholder="Full Name" className="w-full mb-3 p-2 border rounded-lg" />}
            <input type="email" placeholder="Email" className="w-full mb-3 p-2 border rounded-lg" />
            {isSignup && <input type="tel" placeholder="Mobile Number" className="w-full mb-3 p-2 border rounded-lg" />}
            <input type="password" placeholder="Password" className="w-full mb-4 p-2 border rounded-lg" />

            <button className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700">{isSignup ? 'Sign Up' : 'Login'}</button>

            <div className="my-4 border-t border-gray-200"></div>
            <p className="text-sm text-gray-600 mb-2">Or continue with</p>
            <div className="flex justify-center gap-4">
              <button className="flex items-center gap-2 border px-3 py-1 rounded-lg hover:bg-gray-100"><FcGoogle size={20} /> Google</button>
              <button className="flex items-center gap-2 border px-3 py-1 rounded-lg hover:bg-gray-100 text-blue-600"><FaFacebook size={20} /> Facebook</button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              {isSignup ? 'Already have an account?' : `Don't have an account?`}{' '}
              <span className="text-green-600 cursor-pointer" onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? 'Login' : 'Sign Up'}
              </span>
            </p>
            <button onClick={() => setShowLogin(false)} className="mt-4 text-gray-500 hover:text-red-500">Close</button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50">
          <p className="font-medium">🛍️ Order placed successfully! Thank you for shopping with Reyana Treders.</p>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-green-700 text-yellow-100 text-center py-4 mt-10">
        <p className="text-sm">© {new Date().getFullYear()} Reyana Treders. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// Render app for vite dev
const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
