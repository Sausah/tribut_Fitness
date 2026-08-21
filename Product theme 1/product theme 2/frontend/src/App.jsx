import React, { useState, useEffect } from 'react';
import { 
  Shield, Zap, Sparkles, Check, ShoppingCart, ShoppingBag, X, 
  Phone, Mail, User, MapPin, Award, ArrowRight, Menu, RefreshCw, 
  BarChart2, MessageSquare, Plus, Minus, CheckCircle, Package, ArrowUpRight,
  Smartphone, Truck
} from 'lucide-react';

const API_BASE = 'http://localhost:5002/api';

// Hardcoded fallback data in case the backend database isn't running yet
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Tribu-Fit Single Bottle',
    tagline: 'Perfect for trying it out',
    description: '1x Tribu-Fit (60 Capsules). A powerful blend of Tribulus and Ashwagandha to kickstart your fitness journey.',
    price: 999,
    image_url: 'assets/tribu-fit-bottle.png',
    stock: 150,
    savings_text: ''
  },
  {
    id: 2,
    name: 'Tribu-Fit Double Pack',
    tagline: 'Recommended Start Pack',
    description: '2x Tribu-Fit (120 Capsules total). Boost stamina, energy levels, and speed up post-workout recovery.',
    price: 1799,
    image_url: 'assets/tribu-fit-bottle.png',
    stock: 200,
    savings_text: 'Save 15%'
  },
  {
    id: 3,
    name: 'Tribu-Fit Triple Value Pack',
    tagline: 'Best Value & Results',
    description: '3x Tribu-Fit (180 Capsules total). The ultimate package for sustained muscle building, energy, and stress relief.',
    price: 2499,
    image_url: 'assets/tribu-fit-bottle.png',
    stock: 300,
    savings_text: 'Save 22%'
  }
];

export default function App() {
  // State
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const getThemeUrl = (themePath, localPort) => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      if (themePath === '/') {
        const currentPort = window.location.port;
        if (currentPort === '5175' || currentPort === '5176' || currentPort === '5177') {
          return `http://localhost:5174/`;
        }
        return `http://localhost:${currentPort}/`;
      }
      return `http://localhost:${localPort}${themePath}`;
    }
    return themePath;
  };

  const isThemeActive = (themePath, localPort) => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      if (themePath === '/') {
        return window.location.port !== '5175' && window.location.port !== '5176' && window.location.port !== '5177';
      }
      return window.location.port === String(localPort);
    }
    if (themePath === '/') {
      return window.location.pathname === '/' || window.location.pathname === '';
    }
    return window.location.pathname.startsWith(themePath);
  };
  
  // Admin Authentication State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  
  // Checkout Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Contact Form State
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Expert Questions state
  const [expertQuestions, setExpertQuestions] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [expandedExpertQ, setExpandedExpertQ] = useState(null);
  const [faqActiveTab, setFaqActiveTab] = useState('faq');
  const [showMoreFaq, setShowMoreFaq] = useState(false);
  const [expertForm, setExpertForm] = useState({ name: '', email: '', question: '' });
  const [expertSuccess, setExpertSuccess] = useState(false);

  useEffect(() => {
    fetchProducts();
    const path = window.location.pathname;
    if (path.endsWith('/admin') || path.endsWith('/admin/')) {
      setIsAdminLoginOpen(true);
    }
  }, []);

  useEffect(() => {
    fetchExpertQuestions();
  }, []);

  const fetchExpertQuestions = async () => {
    try {
      const res = await fetch(`${API_BASE}/expert-questions`);
      if (res.ok) {
        const data = await res.json();
        setExpertQuestions(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      setExpertQuestions([
        {
          id: 1,
          name: "Amit Patel",
          question: "I have a history of high blood pressure. Is it safe for me to take Tribu-Fit daily?",
          answer: "Tribu-Fit is formulated with natural adaptogens like Ashwagandha, which can help support stress management, but Tribulus can increase blood flow. We recommend consulting your cardiologist before introducing any supplement if you have pre-existing cardiovascular conditions."
        },
        {
          id: 2,
          name: "Rajesh K.",
          question: "Can I combine Tribu-Fit with whey protein and creatine post-workout?",
          answer: "Yes, Tribu-Fit works synergistically with protein and creatine. While whey and creatine support muscle repair and phosphate replenishment, Tribu-Fit supports hormonal homeostasis and recovery adaptively. It is perfectly safe to stack them."
        },
        {
          id: 3,
          name: "Vikram Sen",
          question: "I am concern that it contains heavy metals. Does your product get tested for toxicity?",
          answer: "Absolutely. Every batch of Tribu-Fit undergoes strict third-party heavy metal, microbial, and purity testing. We adhere strictly to FSSAI guidelines and GMP protocols to ensure no contaminants are present."
        }
      ]);
    }
  };

  const handleExpertSubmit = async (e) => {
    e.preventDefault();
    if (!expertForm.email || !expertForm.question) {
      alert('Email and question are required');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/expert-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expertForm)
      });
      if (res.ok) {
        setExpertSuccess(true);
        setExpertForm({ name: '', email: '', question: '' });
        fetchExpertQuestions();
      } else {
        alert('Failed to submit question');
      }
    } catch (err) {
      setExpertSuccess(true);
      setExpertQuestions(prev => [
        {
          id: Date.now(),
          name: expertForm.name || 'Anonymous',
          question: expertForm.question,
          answer: "Thanks for submitting! Our expert physician will evaluate this query and post an answer shortly."
        },
        ...prev
      ]);
      setExpertForm({ name: '', email: '', question: '' });
    }
  };

  // Admin Dashboard State
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminMessages, setAdminMessages] = useState([]);
  const [adminStats, setAdminStats] = useState({ totalOrders: 0, totalSales: 0, messageCount: 0 });

  // New Header Modal States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Tracking State
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackingError, setTrackingError] = useState('');

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setTrackingError('');
    setTrackedOrder(null);
    
    if (!trackingIdInput.trim()) {
      setTrackingError('Please enter a valid Order ID');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (res.ok) {
        const orders = await res.json();
        // Check for loose inequality to match both numbers and strings
        const match = orders.find(o => String(o.id) === String(trackingIdInput));
        if (match) {
          setTrackedOrder(match);
        } else {
          setTrackingError('Order ID not found in database.');
        }
      } else {
        throw new Error('Database offline');
      }
    } catch (err) {
      // Mock lookup if backend is offline or fails
      if (trackingIdInput === '123456') {
        setTrackedOrder({
          id: 123456,
          customer_name: 'John Doe',
          shipping_address: '123 Fitness Way',
          city: 'Strength City',
          total_amount: 1799,
          status: 'Shipped',
          created_at: new Date().toISOString(),
          items: [{ product_name: 'Tribu-Fit Double Pack', quantity: 1, price: 1799 }]
        });
      } else {
        setTrackingError('Order ID not found in local records.');
      }
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      setIsLoggedIn(true);
      setIsLoginOpen(false);
    } else {
      alert('Please fill out all fields.');
    }
  };

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.log('Using default product data (backend server not running yet)');
    }
  };

  const fetchAdminData = async () => {
    try {
      const [ordersRes, messagesRes] = await Promise.all([
        fetch(`${API_BASE}/orders`),
        fetch(`${API_BASE}/contact`)
      ]);
      
      if (ordersRes.ok && messagesRes.ok) {
        const orders = await ordersRes.json();
        const messages = await messagesRes.json();
        setAdminOrders(orders);
        setAdminMessages(messages);
        
        const totalSales = orders.reduce((acc, curr) => acc + curr.total_amount, 0);
        setAdminStats({
          totalOrders: orders.length,
          totalSales: totalSales,
          messageCount: messages.length
        });
      }
    } catch (e) {
      console.error('Failed to fetch admin dashboard metrics:', e);
    }
  };

  const handleCloseAdminLogin = () => {
    setIsAdminLoginOpen(false);
    setAdminEmail('');
    setAdminPassword('');
    setAdminLoginError('');
    const basePath = window.location.pathname.replace(/\/admin\/?$/, '') || '/';
    window.history.pushState(null, '', basePath);
  };

  const handleCloseAdminDashboard = () => {
    setIsAdminOpen(false);
    const basePath = window.location.pathname.replace(/\/admin\/?$/, '') || '/';
    window.history.pushState(null, '', basePath);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAdminLoginError('');
    if (adminEmail === 'admin@tribufit.com' && adminPassword === 'admin123') {
      setIsAdminOpen(true);
      setIsAdminLoginOpen(false);
      setAdminEmail('');
      setAdminPassword('');
    } else {
      setAdminLoginError('Invalid email or password');
    }
  };

  // Trigger admin data load when admin panel is opened
  useEffect(() => {
    if (isAdminOpen) {
      fetchAdminData();
    }
  }, [isAdminOpen]);

  // Cart operations
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, change) => {
    setCart((prevCart) => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  // Forms validations
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 9) errors.phone = 'Valid phone is required';
    if (!formData.address.trim()) errors.address = 'Shipping address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.zip.trim()) errors.zip = 'ZIP code is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const orderPayload = {
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_address: formData.address,
      city: formData.city,
      state: formData.state,
      postal_code: formData.zip,
      items: cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }))
    };

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      
      const data = await res.json();
      if (res.ok) {
        setOrderSuccess({
          id: data.orderId,
          total: data.total_amount,
          items: [...cart]
        });
        setCart([]); // Clear cart
      } else {
        alert(data.error || 'Failed to submit order');
      }
    } catch (e) {
      // Mock successful order in standalone environment
      setOrderSuccess({
        id: Math.floor(Math.random() * 900000) + 100000,
        total: cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0),
        items: [...cart]
      });
      setCart([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.message) {
      alert('Please fill out all fields');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      if (res.ok) {
        setContactSuccess(true);
        setContactData({ name: '', email: '', message: '' });
      } else {
        alert('Failed to send message');
      }
    } catch (e) {
      // Simulated local success
      setContactSuccess(true);
      setContactData({ name: '', email: '', message: '' });
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + (calculateSubtotal() > 0 ? 99 : 0); // ₹99 flat shipping
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER SECTION */}
      <header style={headerStyles}>
        {/* ROW 1: TOP UTILITY BAR (Symbols for Address, Get App, Order Tracking) */}
        <div style={headerTopBarStyles}>
          <div className="container" style={headerTopContainerStyles}>
            {/* Address Symbol & Text */}
            <div onClick={() => setIsAddressOpen(true)} style={headerUtilityItemStyles}>
              <MapPin size={13} style={{ color: 'var(--primary)' }} />
              <span style={utilityTextStyles}>12 Park Avenue, Delhi, IN</span>
            </div>
            
            {/* Right side utilities */}
            <div style={headerUtilityRightStyles}>
              {/* Get App Symbol & Link */}
              <div onClick={() => setIsAppOpen(true)} style={headerUtilityItemStyles}>
                <Smartphone size={13} style={{ color: 'var(--secondary)' }} />
                <span style={utilityTextStyles}>Get App</span>
              </div>
              
              {/* Order Tracking Symbol & Link */}
              <div onClick={() => setIsTrackingOpen(true)} style={headerUtilityItemStyles}>
                <Truck size={13} style={{ color: 'var(--gold)' }} />
                <span style={utilityTextStyles}>Track Order</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: MAIN NAVBAR (Logo, Brand Name, Links, Login & Kart) */}
        <div style={headerMainBarStyles}>
          <div className="container" style={navContainerStyles}>
            <div style={logoWrapperStyles}>
              <div style={logoCircleStyles}>
                <span style={logoTextStyles}>PH</span>
              </div>
              <div style={brandDetailsStyles}>
                <span style={brandNameStyles}>Progressive Health Care / Tribu-Fit</span>
                <span style={brandSloganStyles}>Believing Quality - Building Relationships</span>
              </div>
            </div>

            <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
              
              {/* Mobile Only Quick Utilities */}
              <div className="mobile-utilities">
                <div onClick={() => { setIsAddressOpen(true); setMobileMenuOpen(false); }} style={mobileUtilRowStyles}>
                  <MapPin size={16} style={{ color: 'var(--primary)' }} /> Address
                </div>
                <div onClick={() => { setIsAppOpen(true); setMobileMenuOpen(false); }} style={mobileUtilRowStyles}>
                  <Smartphone size={16} style={{ color: 'var(--secondary)' }} /> Get App
                </div>
                <div onClick={() => { setIsTrackingOpen(true); setMobileMenuOpen(false); }} style={mobileUtilRowStyles}>
                  <Truck size={16} style={{ color: 'var(--gold)' }} /> Track Order
                </div>
              </div>
            </nav>

            <div style={navActionWrapperStyles}>

              {/* Login option with User Symbol */}
              <button onClick={() => setIsLoginOpen(true)} style={loginNavBtnStyles}>
                <User size={18} />
                <span style={loginBtnTextStyles}>{isLoggedIn ? 'Account' : 'Login'}</span>
              </button>

              {/* Kart/Cart Option with Cart Symbol */}
              <button onClick={() => setIsCartOpen(true)} style={cartBtnStyles}>
                <ShoppingCart size={20} />
                {cart.length > 0 && <span style={cartBadgeStyles}>{cart.reduce((a, b) => a + b.quantity, 0)}</span>}
              </button>

              {/* Mobile menu trigger */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-menu-btn">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={heroStyles}>
        <div style={heroOverlayStyles} />
        <div className="container" style={heroContainerStyles}>
          <div style={heroTextColStyles}>
            <div style={badgeStyles}>
              <Sparkles size={14} style={{ color: 'var(--primary)' }} />
              <span>THE COGENT ENERGY BOOSTER</span>
            </div>
            
            <h1 style={heroTitleStyles}>
              STEP UP TO A NEW LEVEL OF <span className="gradient-text">FITNESS!</span>
            </h1>
            
            <p style={heroSubStyles}>
              Engineered with premium extracts of <strong>Tribulus Terrestris</strong> and <strong>Ashwagandha</strong>, Tribu-Fit elevates athletic stamina, accelerates recovery speed, and brings focus back to your workouts.
            </p>

            <div style={heroFeaturesListStyles}>
              <div style={heroFeatureItemStyles}>
                <div style={heroFeatureCheckStyles}><Check size={14} /></div>
                <span>Increases Strength & Vitality</span>
              </div>
              <div style={heroFeatureItemStyles}>
                <div style={heroFeatureCheckStyles}><Check size={14} /></div>
                <span>Accelerates Muscle Recovery</span>
              </div>
              <div style={heroFeatureItemStyles}>
                <div style={heroFeatureCheckStyles}><Check size={14} /></div>
                <span>Supports Natural Hormonal Balance</span>
              </div>
            </div>

            <div style={heroCTAContainerStyles}>
              <a href="#purchase" style={heroCTAButtonStyles} className="glow-btn">
                Get Started Now <ArrowRight size={18} />
              </a>
              <a href="#ingredients" style={heroSecondaryCTAStyles}>
                Explore Active Ingredients
              </a>
            </div>
          </div>

          <div style={heroVisualColStyles}>
            <div style={radialGlowStyles} />
            <img 
              src="assets/tribu-fit-bottle.png" 
              alt="Tribu-Fit Supplement Bottle" 
              className="float-img"
              style={heroImageStyles}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600';
              }}
            />
          </div>
        </div>
      </section>

      {/* INTERACTIVE PRODUCT SHOWCASE / HOTSPOTS */}
      <section id="ingredients" style={hotspotsSectionStyles}>
        <div className="container">
          <div style={sectionHeaderStyles}>
            <h2 style={sectionTitleStyles}>Interactive Product Breakdown</h2>
            <p style={sectionSubTitleStyles}>Hover or click on the hotspots to reveal the potency of Tribu-Fit's primary components.</p>
          </div>

          <div style={hotspotsLayoutStyles}>
            <div style={hotspotCardsColStyles}>
              <div style={activeHotspot === 'tribulus' ? activeFeatureCardStyles : inactiveFeatureCardStyles}>
                <div style={featureHeaderStyles}>
                  <div style={hotspotLabelStyles(1)}>01</div>
                  <h3>Tribulus Terrestris</h3>
                </div>
                <p>Derived from high-purity puncture vine extracts, Tribulus acts as an organic catalyst for building muscle fibers, elevating free testosterone levels naturally, and sustaining physical energy levels throughout strenuous activities.</p>
              </div>

              <div style={activeHotspot === 'ashwagandha' ? activeFeatureCardStyles : inactiveFeatureCardStyles}>
                <div style={featureHeaderStyles}>
                  <div style={hotspotLabelStyles(2)}>02</div>
                  <h3>Ashwagandha (Withania somnifera)</h3>
                </div>
                <p>A classic adaptogenic root trusted for centuries. Ashwagandha actively lowers cortisol levels, minimizes exercise-induced oxidative stress, improves restful sleep, and optimizes physical performance under fatigue.</p>
              </div>
            </div>

            <div style={hotspotsVisualColStyles}>
              <div style={visualContainerStyles}>
                <img 
                  src="assets/tribu-fit-bottle.png" 
                  alt="Tribu-Fit Active Bottle" 
                  style={hotspotsImageStyles}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=600';
                  }}
                />

                {/* Hotspot 1: Tribulus (Top Left of Bottle) */}
                <div 
                  style={hotspotTriggerStyles(30, 20)}
                  onMouseEnter={() => setActiveHotspot('tribulus')}
                  onMouseLeave={() => setActiveHotspot(null)}
                  onClick={() => setActiveHotspot(activeHotspot === 'tribulus' ? null : 'tribulus')}
                >
                  <span style={hotspotPulseStyles(true)} />
                  <span style={hotspotDotStyles(true)}>T</span>
                </div>

                {/* Hotspot 2: Ashwagandha (Bottom Right of Bottle) */}
                <div 
                  style={hotspotTriggerStyles(65, 80)}
                  onMouseEnter={() => setActiveHotspot('ashwagandha')}
                  onMouseLeave={() => setActiveHotspot(null)}
                  onClick={() => setActiveHotspot(activeHotspot === 'ashwagandha' ? null : 'ashwagandha')}
                >
                  <span style={hotspotPulseStyles(false)} />
                  <span style={hotspotDotStyles(false)}>A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND & LIFESTYLE SHOWCASE GALLERY */}
      <section id="gallery" style={gallerySectionStyles}>
        <div className="container">
          <div style={sectionHeaderStyles}>
            <h2 style={sectionTitleStyles}>Tribu-Fit in Action</h2>
            <p style={sectionSubTitleStyles}>Explore the athletic lifestyle of the Progressive Health Care fitness community.</p>
          </div>

          <div style={galleryGridStyles}>
            {/* Card 1: Gym Guy */}
            <div className="glass-panel text-card" style={galleryCardStyles} onClick={() => setLightboxImage('assets/promo-gym-guy.jpg')}>
              <div style={galleryImageWrapperStyles}>
                <img src="assets/promo-gym-guy.jpg" alt="Join the Fitness Tribe" style={galleryImageStyles} />
                <div style={galleryOverlayHoverStyles}>
                  <ArrowUpRight size={24} style={{ color: '#fff' }} />
                  <span style={galleryOverlayTextStyles}>Join the Fitness Tribe</span>
                </div>
              </div>
            </div>

            {/* Card 2: Prize */}
            <div className="glass-panel text-card" style={galleryCardStyles} onClick={() => setLightboxImage('assets/promo-prize.jpg')}>
              <div style={galleryImageWrapperStyles}>
                <img src="assets/promo-prize.jpg" alt="Power On to the Prize" style={galleryImageStyles} />
                <div style={galleryOverlayHoverStyles}>
                  <ArrowUpRight size={24} style={{ color: '#fff' }} />
                  <span style={galleryOverlayTextStyles}>Power On to the Prize</span>
                </div>
              </div>
            </div>

            {/* Card 3: Fitness Level */}
            <div className="glass-panel text-card" style={galleryCardStyles} onClick={() => setLightboxImage('assets/promo-fitness.jpg')}>
              <div style={galleryImageWrapperStyles}>
                <img src="assets/promo-fitness.jpg" alt="Step up to Fitness" style={galleryImageStyles} />
                <div style={galleryOverlayHoverStyles}>
                  <ArrowUpRight size={24} style={{ color: '#fff' }} />
                  <span style={galleryOverlayTextStyles}>Step Up to New Levels</span>
                </div>
              </div>
            </div>

            {/* Card 4: Boxer */}
            <div className="glass-panel text-card" style={galleryCardStyles} onClick={() => setLightboxImage('assets/promo-boxer.jpg')}>
              <div style={galleryImageWrapperStyles}>
                <img src="assets/promo-boxer.jpg" alt="Be a Hit with Tribu-Fit" style={galleryImageStyles} />
                <div style={galleryOverlayHoverStyles}>
                  <ArrowUpRight size={24} style={{ color: '#fff' }} />
                  <span style={galleryOverlayTextStyles}>Be a Hit in Performance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE BENEFITS GRID */}
      <section id="features" style={benefitsSectionStyles}>
        <div className="container">
          <div style={sectionHeaderStyles}>
            <h2 style={sectionTitleStyles}>Engineered for Peak Performance</h2>
            <p style={sectionSubTitleStyles}>Experience the synergistic impact of combining dual powerhouses in wellness science.</p>
          </div>

          <div style={benefitsGridStyles}>
            <div className="glass-panel" style={benefitCardStyles}>
              <div style={benefitIconStyles('red')}><Zap size={24} /></div>
              <h3 style={benefitTitleStyles}>Sustained Stamina</h3>
              <p style={benefitTextStyles}>Tribulus works by boosting physical output. Say goodbye to mid-workout crashes and hello to continuous, stable strength capacity.</p>
            </div>

            <div className="glass-panel" style={benefitCardStyles}>
              <div style={benefitIconStyles('green')}><CheckCircle size={24} /></div>
              <h3 style={benefitTitleStyles}>Rapid Muscle Recovery</h3>
              <p style={benefitTextStyles}>Reduce soreness duration. Ashwagandha aids cell repair protocols, letting you train harder and more frequently with less physical friction.</p>
            </div>

            <div className="glass-panel" style={benefitCardStyles}>
              <div style={benefitIconStyles('gold')}><Shield size={24} /></div>
              <h3 style={benefitTitleStyles}>Cortisol Defense</h3>
              <p style={benefitTextStyles}>Mitigate stress-induced energy drain. Ashwagandha regulates hormonal triggers, preserving cellular vitality and reducing anxiety loops.</p>
            </div>

            <div className="glass-panel" style={benefitCardStyles}>
              <div style={benefitIconStyles('red')}><Sparkles size={24} /></div>
              <h3 style={benefitTitleStyles}>Hormonal Support</h3>
              <p style={benefitTextStyles}>Promotes homeostasis naturally. No synthetic additives, just pure adaptogenic and botanical extracts matching your biological rhythms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO USE & WHOM TO USE SECTION */}
      <section id="usage" style={usageSectionStyles}>
        <div className="container" style={usageLayoutStyles}>
          
          {/* How to Use Col */}
          <div className="glass-panel text-card" style={usageColStyles}>
            <div style={usageHeaderStyles}>
              <Award size={24} style={{ color: 'var(--primary)' }} />
              <h2 style={usageTitleStyles}>How to Use Tribu-Fit</h2>
            </div>
            <p style={usageSubTextStyles}>Unlock maximum potency by adhering to our expert intake guidelines:</p>
            
            <div style={stepListStyles}>
              <div style={stepItemStyles}>
                <div style={stepNumberStyles}>01</div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Dosage Protocol</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Take 1 to 2 capsules daily. Do not exceed the recommended daily allowance.</p>
                </div>
              </div>

              <div style={stepItemStyles}>
                <div style={stepNumberStyles}>02</div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Optimal Timing</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Consume with warm milk or fresh water, preferably after meals or 30-45 minutes before starting training sessions.</p>
                </div>
              </div>

              <div style={stepItemStyles}>
                <div style={stepNumberStyles}>03</div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Cycle Length</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>For optimal results, consume consistently for 6-8 weeks, followed by a 2-week cycle break.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Whom to Use Col */}
          <div className="glass-panel text-card" style={usageColStyles}>
            <div style={usageHeaderStyles}>
              <User size={24} style={{ color: 'var(--secondary)' }} />
              <h2 style={usageTitleStyles}>Whom is it For?</h2>
            </div>
            <p style={usageSubTextStyles}>Tribu-Fit is formulated for active individuals seeking safe, botanical energy:</p>

            <div style={stepListStyles}>
              <div style={stepItemStyles}>
                <div style={stepNumberGreenStyles}>A</div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Athletes & Sports Enthusiasts</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ideal for individuals seeking natural elevation of athletic stamina and training duration.</p>
                </div>
              </div>

              <div style={stepItemStyles}>
                <div style={stepNumberGreenStyles}>B</div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Bodybuilders & Weightlifters</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Aids in physical strength development, supports lean mass synthesis, and speeds up fiber repair.</p>
                </div>
              </div>

              <div style={stepItemStyles}>
                <div style={stepNumberGreenStyles}>C</div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Active Adults</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Perfect for anyone looking to combat fatigue, handle heavy stress levels, and maintain vitality.</p>
                </div>
              </div>
            </div>

            <div style={safetyNoticeStyles}>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>⚠️ Safety Notice:</span> Not recommended for children, pregnant or lactating women. Consult a physician before use if you have pre-existing medical conditions.
            </div>
          </div>

        </div>
      </section>

      {/* TIERED PURCHASE/PRICING SECTION */}
      <section id="purchase" style={purchaseSectionStyles}>
        <div className="container">
          <div style={sectionHeaderStyles}>
            <h2 style={sectionTitleStyles}>Choose Your Progression Pack</h2>
            <p style={{ ...sectionSubTitleStyles, color: '#ffffff' }}>Save more with our bulk packs. Free shipping included on Multi-Bottle orders.</p>
          </div>

          <div style={packsGridStyles}>
            {products.map((product) => (
              <div 
                key={product.id} 
                className="glass-panel" 
                style={{ ...packCardStyles, border: '2px solid var(--primary)' }}
              >
                {product.savings_text && (
                  <div style={savingsBadgeStyles}>
                    {product.savings_text}
                  </div>
                )}
                
                <h3 style={packTitleStyles}>{product.name}</h3>
                <span style={packTaglineStyles}>{product.tagline}</span>
                
                <div style={packPriceWrapperStyles}>
                  <span style={packCurrencyStyles}>₹</span>
                  <span style={packAmountStyles}>{product.price}</span>
                </div>

                <p style={packDescStyles}>{product.description}</p>

                <div style={packStockStyles}>
                  <Package size={14} style={{ color: 'var(--text-muted)' }} />
                  <span>Only {product.stock} units available in local batch</span>
                </div>

                <button 
                  onClick={() => addToCart(product)} 
                  style={packBuyBtnActiveStyles}
                >
                  <ShoppingBag size={18} /> Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMER SPEAKS / TESTIMONIALS */}
      <section id="reviews" style={reviewsSectionStyles}>
        <div className="container">
          <div style={sectionHeaderStyles}>
            <h2 style={sectionTitleStyles}>What Our Fitness Tribe Says</h2>
            <p style={sectionSubTitleStyles}>Real reviews from verified athletes and fitness enthusiasts who integrated Tribu-Fit into their daily routines.</p>
          </div>

          <div style={reviewsGridStyles}>
            {/* Card 1 */}
            <div className="glass-panel" style={reviewCardStyles}>
              <div style={ratingStarsRowStyles}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: 'var(--primary)', fontSize: '1.2rem', marginRight: '2px' }}>★</span>
                ))}
                <span style={verifiedBadgeStyles}>
                  <Check size={10} style={{ color: 'var(--secondary)', strokeWidth: 3 }} /> Verified Buyer
                </span>
              </div>
              <p style={reviewTextStyles}>
                "Tribu-Fit completely changed my recovery cycle. I can feel the strength gains during my heavy deadlift sets, and there is no midday fatigue. A true cogent energy booster!"
              </p>
              <div style={reviewAuthorStyles}>
                <div style={authorAvatarStyles('var(--primary-glow)', 'var(--primary)')}>RS</div>
                <div>
                  <h4 style={authorNameStyles}>Rohan Sharma</h4>
                  <span style={authorTitleStyles}>28, Competitive Powerlifter</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-panel" style={reviewCardStyles}>
              <div style={ratingStarsRowStyles}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: 'var(--primary)', fontSize: '1.2rem', marginRight: '2px' }}>★</span>
                ))}
                <span style={verifiedBadgeStyles}>
                  <Check size={10} style={{ color: 'var(--secondary)', strokeWidth: 3 }} /> Verified Buyer
                </span>
              </div>
              <p style={reviewTextStyles}>
                "As a wellness advisor, I highly recommend the synergistic blend of Tribulus and Ashwagandha. My energy levels remain high throughout my clinic hours without caffeine jitters."
              </p>
              <div style={reviewAuthorStyles}>
                <div style={authorAvatarStyles('var(--secondary-glow)', 'var(--secondary)')}>AM</div>
                <div>
                  <h4 style={authorNameStyles}>Dr. Anjali Mehta</h4>
                  <span style={authorTitleStyles}>34, Wellness Consultant</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass-panel" style={reviewCardStyles}>
              <div style={ratingStarsRowStyles}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: 'var(--primary)', fontSize: '1.2rem', marginRight: '2px' }}>★</span>
                ))}
                <span style={verifiedBadgeStyles}>
                  <Check size={10} style={{ color: 'var(--secondary)', strokeWidth: 3 }} /> Verified Buyer
                </span>
              </div>
              <p style={reviewTextStyles}>
                "The stamina improvement is real. I feel more explosive in the boxing ring and my muscle soreness is reduced significantly within a few days of starting this cycle."
              </p>
              <div style={reviewAuthorStyles}>
                <div style={authorAvatarStyles('var(--primary-glow)', 'var(--primary)')}>KD</div>
                <div>
                  <h4 style={authorNameStyles}>Kabir Dev</h4>
                  <span style={authorTitleStyles}>24, Amateur Boxer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & EXPERT CORNER SECTION */}
      <section id="faq" style={faqSectionStyles}>
        <div className="container">
          <div style={sectionHeaderStyles}>
            <h2 style={sectionTitleStyles}>Expert Q&A & FAQ</h2>
            <p style={sectionSubTitleStyles}>Find fast answers to common inquiries or ask our health panel directly.</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={tabBarContainerStyles}>
              <button 
                onClick={() => setFaqActiveTab('faq')}
                style={faqActiveTab === 'faq' ? tabButtonActiveStyles : tabButtonInactiveStyles}
              >
                FAQ
              </button>
              <button 
                onClick={() => setFaqActiveTab('expert')}
                style={faqActiveTab === 'expert' ? tabButtonActiveStyles : tabButtonInactiveStyles}
              >
                Ask our Expert
              </button>
            </div>
          </div>

          {faqActiveTab === 'faq' ? (
            <div style={faqContainerStyles}>
              {[
                {
                  q: "How long does Tribu-Fit take to work?",
                  a: "Most users notice an increase in energy levels and stamina within 7 to 10 days of daily intake. For visible muscle recovery and hormonal support benefits, we recommend consistent usage for 6 to 8 weeks."
                },
                {
                  q: "When to consume Tribu-Fit?",
                  a: "For optimal results, consume 1-2 capsules daily with warm milk or water, preferably 30-45 minutes before a workout or after your main meals."
                },
                {
                  q: "Is Tribu-Fit safe to consume in summers?",
                  a: "Yes, Tribu-Fit is safe for year-round consumption. Since it contains adaptogens like Ashwagandha which support temperature homeostasis, it does not cause heat spikes when consumed in recommended dosages."
                },
                {
                  q: "What should be the dosage of Tribu-Fit?",
                  a: "The standard recommended dosage is 1 capsule twice daily or 2 capsules once daily. Do not exceed 2 capsules in a 24-hour period unless advised by your healthcare professional."
                },
                {
                  q: "Does Tribu-Fit help with fatigue and tiredness?",
                  a: "Yes! Ashwagandha is an adaptogen that helps regulate cortisol (stress hormone) levels, combating physical fatigue and restoring natural vitality."
                },
                {
                  q: "Can women consume Tribu-Fit?",
                  a: "While Tribu-Fit supports natural vitality and energy pathways which benefit everyone, its formulation is optimized for male fitness performance. Women should consult their physician before use."
                },
                {
                  q: "Do I need to cycle off Tribu-Fit?",
                  a: "Yes. To keep your body's natural response pathways sensitive, we recommend a cycle of 8 weeks on, followed by a 2-week break."
                }
              ].slice(0, showMoreFaq ? 7 : 5).map((item, idx) => (
                <div key={idx} style={accordionItemStyles}>
                  <button 
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    style={accordionHeaderStyles}
                  >
                    <span style={accordionQuestionStyles}>{item.q}</span>
                    <span style={accordionToggleStyles}>{expandedFaq === idx ? '-' : '+'}</span>
                  </button>
                  {expandedFaq === idx && (
                    <div style={accordionAnswerStyles}>
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}

              <button 
                onClick={() => setShowMoreFaq(!showMoreFaq)}
                style={viewMoreBtnStyles}
              >
                {showMoreFaq ? 'View Less' : 'View More'}
              </button>
            </div>
          ) : (
            <div style={askExpertContainerStyles}>
              <div style={expertQListStyles}>
                {expertQuestions.map((eq, idx) => (
                  <div key={eq.id || idx} style={accordionItemStyles}>
                    <button 
                      onClick={() => setExpandedExpertQ(expandedExpertQ === idx ? null : idx)}
                      style={accordionHeaderStyles}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>Submitted by {eq.name || 'Anonymous'}</span>
                        <span style={accordionQuestionStyles}>{eq.question}</span>
                      </div>
                      <span style={accordionToggleStyles}>{expandedExpertQ === idx ? '-' : '+'}</span>
                    </button>
                    {expandedExpertQ === idx && (
                      <div style={accordionAnswerStyles}>
                        <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>👨‍⚕️ Expert Response:</p>
                        <p>{eq.answer || 'Our medical advisors are currently drafting an answer to this query. Please check back soon!'}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={expertFormCardStyles} className="glass-panel">
                {expertSuccess ? (
                  <div style={contactSuccessWrapperStyles}>
                    <div style={checkCircleWrapperStyles}><Check size={36} /></div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Question Received!</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>A qualified health expert will review your query and post the response here shortly.</p>
                    <button onClick={() => setExpertSuccess(false)} style={resetContactBtnStyles}>Ask Another Question</button>
                  </div>
                ) : (
                  <form onSubmit={handleExpertSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Still Have a Question?</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Ask our fitness board and expert physicians.</p>

                    <div style={inputGroupStyles}>
                      <label style={labelStyles}>Name</label>
                      <input 
                        type="text" 
                        placeholder="Enter name"
                        value={expertForm.name}
                        onChange={(e) => setExpertForm({ ...expertForm, name: e.target.value })}
                        style={inputStyles}
                      />
                    </div>

                    <div style={inputGroupStyles}>
                      <label style={labelStyles}>Email Address *</label>
                      <input 
                        type="email" 
                        placeholder="name@domain.com"
                        value={expertForm.email}
                        onChange={(e) => setExpertForm({ ...expertForm, email: e.target.value })}
                        style={inputStyles}
                        required
                      />
                    </div>

                    <div style={inputGroupStyles}>
                      <label style={labelStyles}>Questions *</label>
                      <textarea 
                        rows={4}
                        placeholder="Write your question here..."
                        value={expertForm.question}
                        onChange={(e) => setExpertForm({ ...expertForm, question: e.target.value })}
                        style={{ ...inputStyles, resize: 'none' }}
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      <button type="submit" style={contactSubmitBtnStyles} className="glow-btn">
                        Submit Question
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setExpertForm({ name: '', email: '', question: '' })}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                      >
                        Clear
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CONTACT & SUPPORT FORM */}
      <section id="contact" style={contactSectionStyles}>
        <div className="container" style={contactContainerStyles}>
          <div style={contactInfoColStyles}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Need Guidance?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Our expert health consultants are available to address questions regarding Tribu-Fit dosage instructions, ingredient combinations, and workout plans.
            </p>
            <div style={contactListStyles}>
              <div style={contactListItemStyles}>
                <div style={contactIconWrapperStyles}><Phone size={18} /></div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)' }}>Phone Support</h4>
                  <span style={{ color: 'var(--text-secondary)' }}>+1 (800) 555-0199 (Mon-Fri)</span>
                </div>
              </div>
              <div style={contactListItemStyles}>
                <div style={contactIconWrapperStyles}><Mail size={18} /></div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)' }}>Email Address</h4>
                  <span style={{ color: 'var(--text-secondary)' }}>support@progressivehealthcare.com</span>
                </div>
              </div>
            </div>
          </div>

          <div style={contactFormColStyles} className="glass-panel">
            {contactSuccess ? (
              <div style={contactSuccessWrapperStyles}>
                <div style={checkCircleWrapperStyles}><Check size={36} /></div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Message Submitted!</h3>
                <p style={{ color: 'var(--text-secondary)' }}>We will evaluate your details and reach out within 24 hours.</p>
                <button onClick={() => setContactSuccess(false)} style={resetContactBtnStyles}>Submit New Inquiry</button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} style={formElementStyles}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Drop Us a Line</h3>
                
                <div style={inputGroupStyles}>
                  <label style={labelStyles}>Your Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter name"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    style={inputStyles}
                  />
                </div>

                <div style={inputGroupStyles}>
                  <label style={labelStyles}>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@domain.com"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    style={inputStyles}
                  />
                </div>

                <div style={inputGroupStyles}>
                  <label style={labelStyles}>How can we assist you?</label>
                  <textarea 
                    rows={4}
                    placeholder="Ask about supplements, orders, etc..."
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    style={{ ...inputStyles, resize: 'none' }}
                  />
                </div>

                <button type="submit" style={contactSubmitBtnStyles} className="glow-btn">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={footerStyles}>
        <div className="container" style={footerGridStyles}>
          {/* Column 1: Brand Info */}
          <div style={footerBrandColStyles}>
            <div style={{ ...logoWrapperStyles, marginBottom: '1rem' }}>
              <div style={logoCircleStyles}>
                <span style={logoTextStyles}>PH</span>
              </div>
              <div style={brandDetailsStyles}>
                <span style={{ ...brandNameStyles, color: '#fff' }}>Progressive Health Care</span>
                <span style={{ ...brandSloganStyles, color: '#a0aec0' }}>Tribu-Fit</span>
              </div>
            </div>
            <p style={footerAddressStyles}>
              Progressive Health Care Pvt. Ltd.<br />
              12 Park Avenue, Medical District,<br />
              Connaught Place, New Delhi, Delhi 110001, India
            </p>
            <div style={footerContactInfoStyles}>
              <div style={footerContactItemStyles}>
                <Phone size={16} style={{ color: 'var(--primary)' }} />
                <span>1800-555-0199 (Toll Free)</span>
              </div>
              <div style={footerContactItemStyles}>
                <Mail size={16} style={{ color: 'var(--primary)' }} />
                <span>support@progressivehealthcare.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: SHOP ALL Links */}
          <div style={footerLinksColStyles}>
            <h4 style={footerColHeadingStyles}>SHOP ALL</h4>
            <a href="#purchase" style={footerLinkStyles}>Tribu-Fit Single</a>
            <a href="#purchase" style={footerLinkStyles}>Tribu-Fit Double Pack</a>
            <a href="#purchase" style={footerLinkStyles}>Tribu-Fit Triple Pack</a>
            <span style={footerLinkStyles}>Innovation Fund</span>
          </div>

          {/* Column 3: ABOUT US Links */}
          <div style={footerLinksColStyles}>
            <h4 style={footerColHeadingStyles}>ABOUT US</h4>
            <span style={footerLinkStyles}>Our Story</span>
            <span style={footerLinkStyles}>Blog / Articles</span>
            <span style={footerLinkStyles}>Media Room</span>
            <a href="#contact" style={footerLinkStyles}>Contact Us</a>
          </div>

          {/* Column 4: FOLLOW US Links */}
          <div style={footerFollowColStyles}>
            <h4 style={footerColHeadingStyles}>FOLLOW US</h4>
            <div style={footerSocialIconsStyles}>
              <a href="#" style={footerSocialLinkStyles}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" style={footerSocialLinkStyles}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" style={footerSocialLinkStyles}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="#" style={footerSocialLinkStyles}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Row 2: Platforms & Payment Methods */}
        <div className="container" style={footerMiddleRowStyles}>
          <div style={footerPlatformColStyles}>
            <span style={footerSectionLabelStyles}>Also available on:</span>
            <div style={footerPlatformListStyles}>
              <span style={footerPlatformItemStyles}>amazon.in</span>
              <span style={footerPlatformItemStyles}>Flipkart</span>
              <span style={footerPlatformItemStyles}>zepto</span>
              <span style={footerPlatformItemStyles}>instamart</span>
            </div>
          </div>
          <div style={footerPlatformColStyles}>
            <span style={footerSectionLabelStyles}>We Accept:</span>
            <div style={footerPaymentListStyles}>
              <span style={footerPaymentItemStyles}>UPI</span>
              <span style={footerPaymentItemStyles}>Visa</span>
              <span style={footerPaymentItemStyles}>Mastercard</span>
              <span style={footerPaymentItemStyles}>RuPay</span>
              <span style={footerPaymentItemStyles}>Amazon Pay</span>
            </div>
          </div>
        </div>

        {/* Row 3: Policies Link Bar */}
        <div className="container" style={footerPolicyBarStyles}>
          <span style={footerPolicyLinkStyles}>Privacy Policy</span>
          <span style={footerPolicyLinkStyles}>Terms and Conditions</span>
          <span style={footerPolicyLinkStyles}>Shipping Policy</span>
          <span style={footerPolicyLinkStyles}>Cancellation & Refund Policy</span>
        </div>

        {/* Row 4: Copyright Bar */}
        <div style={footerCopyrightBarStyles}>
          <div className="container" style={footerCopyrightContainerStyles}>
            Progressive Health Care is a company of Progressive Health Care Private Limited © Copyright {new Date().getFullYear()} Progressive Health Care
          </div>
        </div>
      </footer>

      {/* CART & CHECKOUT SLIDE-OUT DRAWER */}
      {isCartOpen && (
        <div style={drawerBackdropStyles} onClick={() => setIsCartOpen(false)}>
          <div style={drawerPanelStyles} className="glass-panel" onClick={(e) => e.stopPropagation()}>
            <div style={drawerHeaderStyles}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShoppingCart style={{ color: 'var(--primary)' }} />
                <h2 style={{ fontSize: '1.5rem' }}>Shopping Cart</h2>
              </div>
              <button onClick={() => { setIsCartOpen(false); setOrderSuccess(null); }} style={closeDrawerBtnStyles}>
                <X size={20} />
              </button>
            </div>

            {orderSuccess ? (
              <div style={checkoutSuccessWrapperStyles}>
                <div style={checkoutSuccessCircleStyles}><Check size={48} /></div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Order Confirmed!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'center' }}>
                  Thank you for placing your order. Below is your secure purchase summary:
                </p>
                
                <div style={receiptStyles}>
                  <div style={receiptRowStyles}>
                    <span>Order Reference</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>#{orderSuccess.id}</span>
                  </div>
                  <div style={receiptRowStyles}>
                    <span>Items Purchased</span>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {orderSuccess.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                    </span>
                  </div>
                  <div style={receiptRowStyles}>
                    <span>Total Amount Charged</span>
                    <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>₹{orderSuccess.total.toFixed(2)}</span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem' }}>
                  A confirmation email with shipping tracker has been sent to your address.
                </p>
                
                <button 
                  onClick={() => { setIsCartOpen(false); setOrderSuccess(null); }} 
                  style={returnToShopBtnStyles}
                >
                  Return to Store
                </button>
              </div>
            ) : (
              <div style={drawerBodyStyles}>
                {cart.length === 0 ? (
                  <div style={emptyCartWrapperStyles}>
                    <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <h3>Your cart is empty</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                      Add a package size below to kickstart your progression.
                    </p>
                    <a href="#purchase" onClick={() => setIsCartOpen(false)} style={explorePacksBtnStyles}>
                      Explore Packages
                    </a>
                  </div>
                ) : (
                  <>
                    {/* Cart Items List */}
                    <div style={cartItemsListStyles}>
                      {cart.map((item) => (
                        <div key={item.product.id} style={cartItemRowStyles}>
                          <div style={cartItemInfoStyles}>
                            <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{item.product.name}</h4>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                              ₹{item.product.price} each
                            </span>
                          </div>

                          <div style={cartQtyControllerStyles}>
                            <button onClick={() => updateQuantity(item.product.id, -1)} style={qtyBtnStyles}>
                              <Minus size={12} />
                            </button>
                            <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} style={qtyBtnStyles}>
                              <Plus size={12} />
                            </button>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', width: '60px', textAlign: 'right' }}>
                              ₹{(item.product.price * item.quantity).toFixed(2)}
                            </span>
                            <button onClick={() => removeFromCart(item.product.id)} style={removeProductBtnStyles}>
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Cost Calculations */}
                    <div style={costSummaryStyles}>
                      <div style={costRowStyles}>
                        <span>Subtotal</span>
                        <span>₹{calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div style={costRowStyles}>
                        <span>GST (18%)</span>
                        <span>₹{calculateTax().toFixed(2)}</span>
                      </div>
                      <div style={costRowStyles}>
                        <span>Shipping Cost</span>
                        <span>₹99</span>
                      </div>
                      <div style={{ ...costRowStyles, borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                        <span>Order Total</span>
                        <span style={{ color: 'var(--primary)' }}>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Checkout Form */}
                    <form onSubmit={handleCheckoutSubmit} style={checkoutFormStyles}>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        Shipping Details
                      </h3>

                      <div style={inputGroupRowStyles}>
                        <div style={{ flex: 1 }}>
                          <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={formErrors.name ? { ...checkoutInputStyles, border: '1px solid var(--primary)' } : checkoutInputStyles}
                          />
                        </div>
                      </div>

                      <div style={inputGroupRowStyles}>
                        <div style={{ flex: 1 }}>
                          <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={formErrors.email ? { ...checkoutInputStyles, border: '1px solid var(--primary)' } : checkoutInputStyles}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <input 
                            type="text" 
                            placeholder="Phone Number" 
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            style={formErrors.phone ? { ...checkoutInputStyles, border: '1px solid var(--primary)' } : checkoutInputStyles}
                          />
                        </div>
                      </div>

                      <input 
                        type="text" 
                        placeholder="Street Address" 
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        style={formErrors.address ? { ...checkoutInputStyles, border: '1px solid var(--primary)', marginBottom: '0.75rem' } : { ...checkoutInputStyles, marginBottom: '0.75rem' }}
                      />

                      <div style={inputGroupRowStyles}>
                        <input 
                          type="text" 
                          placeholder="City" 
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          style={formErrors.city ? { ...checkoutInputStyles, border: '1px solid var(--primary)' } : checkoutInputStyles}
                        />
                        <input 
                          type="text" 
                          placeholder="State" 
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          style={formErrors.state ? { ...checkoutInputStyles, border: '1px solid var(--primary)' } : checkoutInputStyles}
                        />
                        <input 
                          type="text" 
                          placeholder="ZIP" 
                          value={formData.zip}
                          onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                          style={formErrors.zip ? { ...checkoutInputStyles, border: '1px solid var(--primary)' } : checkoutInputStyles}
                        />
                      </div>

                      <button type="submit" disabled={isSubmitting} style={placeOrderBtnStyles} className="glow-btn">
                        {isSubmitting ? <RefreshCw className="float-img" size={18} /> : 'Complete Secure Checkout'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMIN LOGIN GATE OVERLAY */}
      {isAdminLoginOpen && (
        <div style={drawerBackdropStyles} onClick={handleCloseAdminLogin}>
          <div style={adminLoginPanelStyles} className="glass-panel" onClick={(e) => e.stopPropagation()}>
            <div style={drawerHeaderStyles}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Shield style={{ color: 'var(--primary)' }} />
                <h2 style={{ fontSize: '1.6rem' }}>Admin Gateway</h2>
              </div>
              <button onClick={handleCloseAdminLogin} style={closeDrawerBtnStyles}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem 0' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
                Please authenticate using your administrator email and password to access the operations dashboard.
              </p>

              {adminLoginError && (
                <div style={{ color: 'var(--primary)', backgroundColor: 'rgba(230, 0, 35, 0.08)', border: '1.5px solid var(--primary)', padding: '10px 14px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>⚠️ Error:</span> {adminLoginError}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.5px' }}>
                  Admin Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@tribufit.com"
                  required
                  style={inputStyles}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.5px' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={inputStyles}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={adminLoginSubmitBtnStyles}>
                  Authenticate <ArrowRight size={16} />
                </button>
                <button type="button" onClick={handleCloseAdminLogin} style={adminLoginCancelBtnStyles}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN DASHBOARD OVERLAY */}
      {isAdminOpen && (
        <div style={drawerBackdropStyles} onClick={handleCloseAdminDashboard}>
          <div style={adminPanelStyles} className="glass-panel" onClick={(e) => e.stopPropagation()}>
            <div style={drawerHeaderStyles}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BarChart2 style={{ color: 'var(--primary)' }} />
                <h2 style={{ fontSize: '1.6rem' }}>Admin Operations Dashboard</h2>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button onClick={fetchAdminData} style={refreshAdminBtnStyles}>
                  <RefreshCw size={14} /> Refresh Data
                </button>
                <button onClick={handleCloseAdminDashboard} style={closeDrawerBtnStyles}>
                  <X size={20} />
                </button>
              </div>
            </div>

            <div style={adminBodyStyles}>
              {/* Metrics Header */}
              <div style={metricsGridStyles}>
                <div style={metricCardStyles}>
                  <span style={metricLabelStyles}>Total Orders</span>
                  <span style={metricValStyles}>{adminStats.totalOrders}</span>
                </div>
                <div style={metricCardStyles}>
                  <span style={metricLabelStyles}>Gross Revenue</span>
                  <span style={{ ...metricValStyles, color: 'var(--secondary)' }}>₹{adminStats.totalSales.toFixed(2)}</span>
                </div>
                <div style={metricCardStyles}>
                  <span style={metricLabelStyles}>Inquiries Received</span>
                  <span style={metricValStyles}>{adminStats.messageCount}</span>
                </div>
              </div>

              {/* Layout splits orders and contact questions */}
              <div className="admin-content-layout">
                
                {/* Orders Block */}
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={tableSectionTitleStyles}>Recent Transactions</h3>
                  <div style={tableContainerStyles}>
                    {adminOrders.length === 0 ? (
                      <div style={emptyStateStyles}>No transactions recorded. Create some test orders!</div>
                    ) : (
                      <table style={tableStyles}>
                        <thead>
                          <tr style={tableHeaderRowStyles}>
                            <th style={thStyles}>ID</th>
                            <th style={thStyles}>Customer</th>
                            <th style={thStyles}>Address</th>
                            <th style={thStyles}>Purchased Items</th>
                            <th style={thStyles}>Revenue</th>
                            <th style={thStyles}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminOrders.map(order => (
                            <tr key={order.id} style={tableBodyRowStyles}>
                              <td style={{ ...tdStyles, fontWeight: 'bold' }}>#{order.id}</td>
                              <td style={tdStyles}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: '500' }}>{order.customer_name}</span>
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{order.customer_email}</span>
                                </div>
                              </td>
                              <td style={tdStyles}>{order.shipping_address}, {order.city}</td>
                              <td style={tdStyles}>
                                {order.items && order.items.map((it, idx) => (
                                  <div key={idx} style={{ fontSize: '0.85rem' }}>
                                    {it.quantity}x {it.product_name || `Product #${it.product_id}`}
                                  </div>
                                ))}
                              </td>
                              <td style={{ ...tdStyles, color: 'var(--secondary)', fontWeight: '600' }}>
                                ₹{order.total_amount.toFixed(2)}
                              </td>
                              <td style={tdStyles}>
                                <span style={statusBadgeStyles}>{order.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Messages Block */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={tableSectionTitleStyles}>Customer Messages</h3>
                  <div style={messagesScrollContainerStyles}>
                    {adminMessages.length === 0 ? (
                      <div style={emptyStateStyles}>No pending customer messages.</div>
                    ) : (
                      adminMessages.map(msg => (
                        <div key={msg.id} style={msgCardStyles}>
                          <div style={msgCardHeaderStyles}>
                            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{msg.name}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                              {new Date(msg.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <span style={{ color: 'var(--primary)', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>{msg.email}</span>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>"{msg.message}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
      {/* ADDRESS DETAILS MODAL */}
      {isAddressOpen && (
        <div style={drawerBackdropStyles} onClick={() => setIsAddressOpen(false)}>
          <div style={smallModalPanelStyles} className="glass-panel" onClick={(e) => e.stopPropagation()}>
            <div style={drawerHeaderStyles}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin style={{ color: 'var(--primary)' }} />
                <h2 style={{ fontSize: '1.4rem' }}>Our Locations & Address</h2>
              </div>
              <button onClick={() => setIsAddressOpen(false)} style={closeDrawerBtnStyles}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Registered Office</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Progressive Health Care Pvt. Ltd.<br />
                  12 Park Avenue, Medical District,<br />
                  Connaught Place, New Delhi, Delhi 110001, India
                </p>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Dispatch Hub</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  A-34, Okhla Industrial Area Phase-II,<br />
                  New Delhi, Delhi 110020, India
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GET APP MODAL */}
      {isAppOpen && (
        <div style={drawerBackdropStyles} onClick={() => setIsAppOpen(false)}>
          <div style={smallModalPanelStyles} className="glass-panel" onClick={(e) => e.stopPropagation()}>
            <div style={drawerHeaderStyles}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Smartphone style={{ color: 'var(--secondary)' }} />
                <h2 style={{ fontSize: '1.4rem' }}>Download Tribu-Fit App</h2>
              </div>
              <button onClick={() => setIsAppOpen(false)} style={closeDrawerBtnStyles}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
              <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '12px', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <path d="M0 0h30v10H10v20H0zm70 0h30v30h-10V10H70zm0 70h10v10H70zm20 0h10v20H90zm-10 10h10v10H80zm0-20h10v10H80zM0 70h30v30H0zm10 10v10h10V80zm30-80h20v20H40zm10 10v10h10V10zm10 10v10h10V10zm70 0v10h10V10z" fill="#000" />
                  <rect x="40" y="40" width="20" height="20" fill="var(--primary)" />
                  <rect x="45" y="45" width="10" height="10" fill="#000" />
                </svg>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Scan QR Code to Install</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                  Install the Tribu-Fit App on iOS or Android for exclusive training plans and 15% discount.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', width: '100%' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('App Store link triggered!'); }} style={{ flex: 1, padding: '10px', backgroundColor: 'var(--primary)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  iOS App Store
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Google Play Store link triggered!'); }} style={{ flex: 1, padding: '10px', backgroundColor: 'var(--secondary)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  Google Play
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {isLoginOpen && (
        <div style={drawerBackdropStyles} onClick={() => setIsLoginOpen(false)}>
          <div style={smallModalPanelStyles} className="glass-panel" onClick={(e) => e.stopPropagation()}>
            <div style={drawerHeaderStyles}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <User style={{ color: 'var(--primary)' }} />
                <h2 style={{ fontSize: '1.4rem' }}>Account Login</h2>
              </div>
              <button onClick={() => setIsLoginOpen(false)} style={closeDrawerBtnStyles}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleLoginSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={inputGroupStyles}>
                <label style={labelStyles}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@domain.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={inputStyles}
                  required
                />
              </div>
              <div style={inputGroupStyles}>
                <label style={labelStyles}>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={inputStyles}
                  required
                />
              </div>
              <button type="submit" style={{ ...contactSubmitBtnStyles, marginTop: '8px' }} className="glow-btn">
                Log In Securely
              </button>
              <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Don't have an account? <a href="#purchase" onClick={() => setIsLoginOpen(false)} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Order first to register!</a>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER TRACKING MODAL */}
      {isTrackingOpen && (
        <div style={drawerBackdropStyles} onClick={() => setIsTrackingOpen(false)}>
          <div style={smallModalPanelStyles} className="glass-panel" onClick={(e) => e.stopPropagation()}>
            <div style={drawerHeaderStyles}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Truck style={{ color: 'var(--primary)' }} />
                <h2 style={{ fontSize: '1.4rem' }}>Track Order Status</h2>
              </div>
              <button onClick={() => setIsTrackingOpen(false)} style={closeDrawerBtnStyles}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <form onSubmit={handleTrackOrder} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Enter Order ID (e.g. 123456)" 
                  value={trackingIdInput}
                  onChange={(e) => setTrackingIdInput(e.target.value)}
                  style={{ ...inputStyles, flex: 1 }}
                />
                <button type="submit" style={{ padding: '12px 18px', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                  Track
                </button>
              </form>

              {trackingError && (
                <div style={{ color: 'var(--primary)', fontSize: '0.9rem', textAlign: 'center' }}>
                  {trackingError}
                </div>
              )}

              {trackedOrder && (
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status:</span>
                    <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--secondary)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {trackedOrder.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Customer:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{trackedOrder.customer_name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Destination:</span>
                    <span style={{ color: 'var(--text-primary)', textAlign: 'right', fontSize: '0.9rem' }}>{trackedOrder.shipping_address}, {trackedOrder.city}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total:</span>
                    <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>₹{trackedOrder.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* LIGHTBOX IMAGE MODAL */}
      {lightboxImage && (
        <div style={drawerBackdropStyles} onClick={() => setLightboxImage(null)}>
          <div style={lightboxContainerStyles} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLightboxImage(null)} style={lightboxCloseBtnStyles}>
              <X size={28} />
            </button>
            <img src={lightboxImage} alt="Zoomed View" style={lightboxImgStyles} />
          </div>
        </div>
      )}

      {/* FLOATING THEME SELECTOR WIDGET */}
      <div style={switcherWrapperStyles}>
        <button 
          onClick={() => setIsSwitcherOpen(!isSwitcherOpen)} 
          style={switcherBtnStyles}
          title="Switch Theme"
        >
          <Sparkles size={20} style={{ transform: isSwitcherOpen ? 'rotate(45deg)' : 'none', transition: 'var(--transition-smooth)' }} />
        </button>
        
        {isSwitcherOpen && (
          <div style={switcherMenuStyles}>
            <div style={switcherTitleStyles}>Select Theme</div>
            <a href={getThemeUrl('/', 5174)} style={isThemeActive('/', 5174) ? activeLinkStyles : inactiveLinkStyles}>
              <span style={dotStyles('#16a34a')}></span> Theme 1 (Default)
            </a>
            <a href={getThemeUrl('/v2/', 5175)} style={isThemeActive('/v2/', 5175) ? activeLinkStyles : inactiveLinkStyles}>
              <span style={dotStyles('#d97706')}></span> Theme 2 (Amber Slate)
            </a>
            <a href={getThemeUrl('/v3/', 5176)} style={isThemeActive('/v3/', 5176) ? activeLinkStyles : inactiveLinkStyles}>
              <span style={dotStyles('#15803d')}></span> Theme 3 (Herbal Green)
            </a>
            <a href={getThemeUrl('/v4/', 5177)} style={isThemeActive('/v4/', 5177) ? activeLinkStyles : inactiveLinkStyles}>
              <span style={dotStyles('#fbbf24')}></span> Theme 4 (Premium Gold)
            </a>
          </div>
        )}
      </div>

    </div>
  );
}

/* -------------------------------------------------------------
   STYLES OBJECT MODULE (Inline styled for structural cleanliness)
   ------------------------------------------------------------- */
const headerStyles = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  backgroundColor: 'rgba(10, 11, 13, 0.85)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid var(--border-glass)',
  display: 'block',
  width: '100%'
};

const headerTopBarStyles = {
  borderBottom: '1px solid var(--border-glass)',
  backgroundColor: 'rgba(0, 0, 0, 0.25)',
  padding: '6px 0',
  fontSize: '0.8rem',
  color: 'var(--text-secondary)'
};

const headerTopContainerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%'
};

const headerUtilityItemStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  transition: 'var(--transition-smooth)'
};

const utilityTextStyles = {
  fontWeight: '500',
  color: '#e2e8f0'
};

const headerUtilityRightStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px'
};

const headerMainBarStyles = {
  padding: '12px 0',
  display: 'flex',
  alignItems: 'center',
  minHeight: '68px'
};

const mobileUtilitiesContainerStyles = {
  display: 'none',
  width: '100%',
  borderTop: '1px solid var(--border-glass)',
  paddingTop: '16px',
  marginTop: '16px',
  flexDirection: 'column',
  gap: '12px'
};

const mobileUtilRowStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: 'var(--text-secondary)',
  fontSize: '0.95rem',
  cursor: 'pointer'
};

const loginNavBtnStyles = {
  background: 'none',
  border: '1px solid var(--border-glass)',
  color: '#e2e8f0',
  padding: '6px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'var(--transition-smooth)'
};

const loginBtnTextStyles = {
  fontWeight: '600'
};

const smallModalPanelStyles = {
  width: '90%',
  maxWidth: '420px',
  margin: 'auto',
  borderRadius: '24px',
  display: 'flex',
  flexDirection: 'column',
  animation: 'fadeIn 0.3s ease-out',
  overflow: 'hidden'
};

const navContainerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%'
};

const logoWrapperStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const logoCircleStyles = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  backgroundColor: 'var(--primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid var(--secondary)',
  boxShadow: '0 0 15px var(--primary-glow)'
};

const logoTextStyles = {
  color: '#fff',
  fontFamily: 'Outfit',
  fontWeight: '800',
  fontSize: '1.1rem',
  letterSpacing: '0.5px'
};

const brandDetailsStyles = {
  display: 'flex',
  flexDirection: 'column'
};

const brandNameStyles = {
  fontFamily: 'Outfit',
  fontWeight: '700',
  fontSize: '1.15rem',
  color: '#ffffff',
  lineHeight: '1.2'
};

const brandSloganStyles = {
  fontSize: '0.65rem',
  color: '#a0aec0',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const navLinkStyles = {
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontWeight: '500',
  transition: 'var(--transition-smooth)',
  cursor: 'pointer'
};

const adminNavBtnStyles = {
  background: 'none',
  border: '1px solid var(--border-glass)',
  color: '#e2e8f0',
  padding: '6px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'var(--transition-smooth)'
};

const navActionWrapperStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px'
};

const cartBtnStyles = {
  background: 'none',
  border: 'none',
  color: '#ffffff',
  cursor: 'pointer',
  position: 'relative',
  padding: '8px',
  transition: 'var(--transition-smooth)'
};

const cartBadgeStyles = {
  position: 'absolute',
  top: '-2px',
  right: '-2px',
  backgroundColor: 'var(--primary)',
  color: '#fff',
  fontSize: '0.75rem',
  fontWeight: '700',
  minWidth: '18px',
  height: '18px',
  borderRadius: '9px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 4px',
  border: '2px solid var(--bg-main)'
};

/* HERO STYLES */
const heroStyles = {
  position: 'relative',
  padding: '100px 0 120px 0',
  background: 'var(--gradient-dark)',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center'
};

const heroOverlayStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: 'radial-gradient(circle at 80% 30%, rgba(255, 59, 48, 0.08) 0%, rgba(0, 0, 0, 0) 60%)',
  pointerEvents: 'none'
};

const heroContainerStyles = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 0.8fr',
  gap: '60px',
  alignItems: 'center',
  position: 'relative',
  zIndex: 2
};

const heroTextColStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
};

const badgeStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: 'rgba(255, 59, 48, 0.1)',
  border: '1px solid rgba(255, 59, 48, 0.2)',
  padding: '6px 12px',
  borderRadius: '30px',
  fontSize: '0.8rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: 'var(--text-primary)',
  marginBottom: '24px'
};

const heroTitleStyles = {
  fontSize: '3.8rem',
  lineHeight: '1.1',
  marginBottom: '24px',
  textTransform: 'uppercase',
  fontStyle: 'italic',
  color: 'var(--text-title, #000000)'
};

const heroSubStyles = {
  fontSize: '1.15rem',
  color: 'var(--text-secondary)',
  marginBottom: '32px',
  maxWidth: '600px',
  lineHeight: '1.7'
};

const heroFeaturesListStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '40px'
};

const heroFeatureItemStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '1rem',
  color: 'var(--text-primary)'
};

const heroFeatureCheckStyles = {
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  backgroundColor: 'rgba(16, 185, 129, 0.15)',
  border: '1px solid var(--secondary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--secondary)'
};

const heroCTAContainerStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px'
};

const heroCTAButtonStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  padding: '14px 28px',
  borderRadius: '12px',
  fontSize: '1.05rem',
  textDecoration: 'none'
};

const heroSecondaryCTAStyles = {
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: '600',
  borderBottom: '1px dashed var(--text-muted)',
  paddingBottom: '2px',
  transition: 'var(--transition-smooth)'
};

const heroVisualColStyles = {
  display: 'flex',
  justifyContent: 'center',
  position: 'relative'
};

const radialGlowStyles = {
  position: 'absolute',
  width: '400px',
  height: '400px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255, 59, 48, 0.12) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(0,0,0,0) 100%)',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: -1
};

const heroImageStyles = {
  maxHeight: '480px',
  objectFit: 'contain',
  filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.6))'
};

/* INTERACTIVE HOTSPOTS SECTION */
const hotspotsSectionStyles = {
  padding: '120px 0',
  backgroundColor: 'var(--bg-card)',
  borderTop: '1px solid var(--border-glass)',
  borderBottom: '1px solid var(--border-glass)'
};

const sectionHeaderStyles = {
  textAlign: 'center',
  marginBottom: '60px'
};

const sectionTitleStyles = {
  fontSize: '2.5rem',
  marginBottom: '16px',
  color: 'var(--text-primary)'
};

const sectionSubTitleStyles = {
  color: 'var(--text-secondary)',
  fontSize: '1.1rem',
  maxWidth: '600px',
  margin: '0 auto'
};

const hotspotsLayoutStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '60px',
  alignItems: 'center'
};

const hotspotCardsColStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
};

const activeFeatureCardStyles = {
  padding: '30px',
  borderRadius: '20px',
  background: 'rgba(255, 59, 48, 0.05)',
  border: '1.5px solid var(--primary)',
  boxShadow: '0 10px 30px rgba(255, 59, 48, 0.1)',
  transition: 'var(--transition-smooth)'
};

const inactiveFeatureCardStyles = {
  padding: '30px',
  borderRadius: '20px',
  background: 'var(--bg-card)',
  border: '1px solid var(--border-glass)',
  opacity: '0.65',
  transition: 'var(--transition-smooth)'
};

const featureHeaderStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '16px'
};

const hotspotLabelStyles = (num) => ({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: num === 1 ? 'var(--primary)' : 'var(--secondary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '0.9rem'
});

const hotspotsVisualColStyles = {
  display: 'flex',
  justifyContent: 'center'
};

const visualContainerStyles = {
  position: 'relative',
  display: 'inline-block'
};

const hotspotsImageStyles = {
  maxHeight: '440px',
  objectFit: 'contain',
  filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.5))'
};

const hotspotTriggerStyles = (top, left) => ({
  position: 'absolute',
  top: `${top}%`,
  left: `${left}%`,
  width: '36px',
  height: '36px',
  transform: 'translate(-50%, -50%)',
  cursor: 'pointer',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const hotspotPulseStyles = (isRed) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  animation: isRed ? 'pulseGlow 2s infinite' : 'pulseGreenGlow 2s infinite',
  backgroundColor: isRed ? 'rgba(255, 59, 48, 0.4)' : 'rgba(16, 185, 129, 0.4)'
});

const hotspotDotStyles = (isRed) => ({
  position: 'relative',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: isRed ? 'var(--primary)' : 'var(--secondary)',
  border: '2px solid #fff',
  color: '#fff',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
});

/* GALLERY SECTION STYLES */
const gallerySectionStyles = {
  padding: '120px 0',
  backgroundColor: 'var(--bg-main)',
  borderTop: '1px solid var(--border-glass)',
  borderBottom: '1px solid var(--border-glass)'
};

const galleryGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '30px',
  marginTop: '20px'
};

const galleryCardStyles = {
  borderRadius: '24px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'var(--transition-smooth)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
};

const galleryImageWrapperStyles = {
  position: 'relative',
  width: '100%',
  paddingBottom: '100%', // 1:1 Aspect Ratio
  overflow: 'hidden'
};

const galleryImageStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease'
};

const galleryOverlayHoverStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(249, 115, 22, 0.85)', // Saffron translucent overlay
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  gap: '8px'
};

const galleryOverlayTextStyles = {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1rem',
  fontFamily: 'Outfit'
};

/* LIGHTBOX MODAL STYLES */
const lightboxContainerStyles = {
  position: 'relative',
  maxWidth: '90%',
  maxHeight: '90%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const lightboxCloseBtnStyles = {
  position: 'absolute',
  top: '-40px',
  right: '0',
  background: 'none',
  border: 'none',
  color: '#fff',
  cursor: 'pointer',
  padding: '8px'
};

const lightboxImgStyles = {
  maxWidth: '100%',
  maxHeight: '80vh',
  borderRadius: '16px',
  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
  objectFit: 'contain'
};

/* HOW TO USE & WHOM TO USE SECTION STYLES */
const usageSectionStyles = {
  padding: '120px 0',
  backgroundColor: 'var(--bg-main)',
  borderTop: '1px solid var(--border-glass)',
  borderBottom: '1px solid var(--border-glass)'
};

const usageLayoutStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
  gap: '40px'
};

const usageColStyles = {
  padding: '40px',
  borderRadius: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
};

const usageHeaderStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const usageTitleStyles = {
  fontSize: '1.8rem',
  color: 'var(--text-primary)',
  margin: 0
};

const usageSubTextStyles = {
  color: 'var(--text-secondary)',
  fontSize: '0.95rem',
  lineHeight: '1.6'
};

const stepListStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const stepItemStyles = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px'
};

const stepNumberStyles = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: 'rgba(249, 115, 22, 0.1)',
  border: '1px solid var(--primary)',
  color: 'var(--primary)',
  fontWeight: 'bold',
  fontSize: '0.95rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const stepNumberGreenStyles = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: 'rgba(22, 163, 74, 0.1)',
  border: '1px solid var(--secondary)',
  color: 'var(--secondary)',
  fontWeight: 'bold',
  fontSize: '0.95rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const safetyNoticeStyles = {
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: 'rgba(249, 115, 22, 0.05)',
  borderLeft: '4px solid var(--primary)',
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  lineHeight: '1.5'
};

/* BENEFITS SECTION */
const benefitsSectionStyles = {
  padding: '120px 0',
  background: 'var(--gradient-dark)'
};

const benefitsGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '30px',
  marginTop: '20px'
};

const benefitCardStyles = {
  padding: '40px 30px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  transition: 'var(--transition-smooth)',
  cursor: 'default'
};

const benefitIconStyles = (color) => {
  let bg = 'rgba(255, 59, 48, 0.1)';
  let border = 'rgba(255, 59, 48, 0.2)';
  let c = 'var(--primary)';
  
  if (color === 'green') {
    bg = 'rgba(16, 185, 129, 0.1)';
    border = 'rgba(16, 185, 129, 0.2)';
    c = 'var(--secondary)';
  } else if (color === 'gold') {
    bg = 'rgba(245, 158, 11, 0.1)';
    border = 'rgba(245, 158, 11, 0.2)';
    c = 'var(--gold)';
  }

  return {
    width: '54px',
    height: '54px',
    borderRadius: '16px',
    backgroundColor: bg,
    border: `1px solid ${border}`,
    color: c,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px'
  };
};

const benefitTitleStyles = {
  fontSize: '1.3rem',
  marginBottom: '12px',
  color: 'var(--text-primary)'
};

const benefitTextStyles = {
  color: 'var(--text-secondary)',
  fontSize: '0.95rem',
  lineHeight: '1.6'
};

/* PRICING & TIERED PACKS */
const purchaseSectionStyles = {
  padding: '120px 0',
  backgroundColor: '#0a0b0d',
  borderTop: '1px solid var(--border-glass)'
};

const packsGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '30px',
  marginTop: '20px'
};

const packCardStyles = {
  padding: '50px 35px',
  borderRadius: '24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  textAlign: 'center',
  transition: 'var(--transition-smooth)',
  background: 'linear-gradient(135deg, #111e38 0%, #0b1329 100%)',
  border: '1px solid rgba(255, 255, 255, 0.15)'
};

const savingsBadgeStyles = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  backgroundColor: 'var(--primary)',
  color: '#fff',
  fontSize: '0.75rem',
  fontWeight: '700',
  padding: '6px 14px',
  borderRadius: '30px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const packTitleStyles = {
  fontSize: '1.5rem',
  marginBottom: '8px',
  color: '#fff'
};

const packTaglineStyles = {
  color: 'var(--primary)',
  fontWeight: '600',
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '24px'
};

const packPriceWrapperStyles = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '24px'
};

const packCurrencyStyles = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#fff',
  marginTop: '6px',
  marginRight: '2px'
};

const packAmountStyles = {
  fontSize: '3.5rem',
  fontWeight: '800',
  color: '#fff',
  lineHeight: '1'
};

const packDescStyles = {
  color: '#e2e8f0',
  fontSize: '0.95rem',
  lineHeight: '1.6',
  marginBottom: '24px',
  flexGrow: 1
};

const packStockStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.8rem',
  color: '#a0aec0',
  marginBottom: '24px'
};

const packBuyBtnStyles = {
  width: '100%',
  padding: '14px',
  borderRadius: '12px',
  border: '1px solid var(--border-glass)',
  backgroundColor: 'var(--bg-glass)',
  color: '#000000',
  fontWeight: '600',
  fontSize: '1rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  transition: 'var(--transition-smooth)'
};

const packBuyBtnActiveStyles = {
  ...packBuyBtnStyles,
  backgroundColor: 'var(--primary)',
  border: 'none',
  boxShadow: '0 4px 15px var(--primary-glow)'
};

/* REVIEWS / TESTIMONIALS SECTION STYLES */
const reviewsSectionStyles = {
  padding: '120px 0',
  backgroundColor: 'var(--bg-main)',
  borderTop: '1px solid var(--border-glass)',
  borderBottom: '1px solid var(--border-glass)'
};

const reviewsGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '30px',
  marginTop: '20px'
};

const reviewCardStyles = {
  padding: '40px 30px',
  borderRadius: '24px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '24px',
  transition: 'var(--transition-smooth)',
  cursor: 'default'
};

const ratingStarsRowStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%'
};

const verifiedBadgeStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  backgroundColor: 'rgba(22, 163, 74, 0.1)',
  border: '1px solid var(--secondary)',
  color: 'var(--secondary)',
  padding: '4px 10px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const reviewTextStyles = {
  color: 'var(--text-secondary)',
  fontSize: '1rem',
  lineHeight: '1.7',
  fontStyle: 'italic',
  margin: 0
};

const reviewAuthorStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  borderTop: '1px solid var(--border-glass)',
  paddingTop: '20px'
};

const authorAvatarStyles = (bg, border) => ({
  width: '46px',
  height: '46px',
  borderRadius: '50%',
  backgroundColor: bg,
  border: `1.5px solid ${border}`,
  color: border,
  fontWeight: 'bold',
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
});

const authorNameStyles = {
  fontSize: '1.05rem',
  fontWeight: '700',
  color: 'var(--text-primary)',
  margin: '0 0 2px 0'
};

const authorTitleStyles = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)'
};

/* CONTACT SECTION */
const contactSectionStyles = {
  padding: '120px 0',
  background: 'var(--gradient-dark)',
  borderTop: '1px solid var(--border-glass)'
};

const contactContainerStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '60px',
  alignItems: 'center'
};

const contactInfoColStyles = {
  display: 'flex',
  flexDirection: 'column'
};

const contactListStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
};

const contactListItemStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px'
};

const contactIconWrapperStyles = {
  width: '46px',
  height: '46px',
  borderRadius: '12px',
  backgroundColor: 'var(--bg-glass)',
  border: '1px solid var(--border-glass)',
  color: 'var(--primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const contactFormColStyles = {
  padding: '40px',
  borderRadius: '24px'
};

const formElementStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const inputGroupStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const labelStyles = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  fontWeight: '600'
};

const inputStyles = {
  padding: '12px 16px',
  borderRadius: '10px',
  backgroundColor: '#f1f5f9',
  border: '1px solid var(--border-glass)',
  color: 'var(--text-primary)',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'var(--transition-smooth)'
};

const contactSubmitBtnStyles = {
  padding: '14px',
  borderRadius: '12px',
  fontSize: '1rem',
  marginTop: '10px'
};

const contactSuccessWrapperStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '40px 0'
};

const checkCircleWrapperStyles = {
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  backgroundColor: 'rgba(16, 185, 129, 0.15)',
  border: '2.5px solid var(--secondary)',
  color: 'var(--secondary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px'
};

const resetContactBtnStyles = {
  marginTop: '20px',
  background: 'none',
  border: '1px solid var(--border-glass)',
  color: 'var(--text-secondary)',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'var(--transition-smooth)'
};

/* FOOTER STYLES */
const footerStyles = {
  backgroundColor: '#07080a',
  borderTop: '1px solid var(--border-glass)',
  padding: '80px 0 0 0',
  marginTop: 'auto'
};

const footerGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '40px',
  paddingBottom: '50px',
  borderBottom: '1px solid rgba(255,255,255,0.08)'
};

const footerBrandColStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const footerAddressStyles = {
  color: '#a0aec0',
  fontSize: '0.9rem',
  lineHeight: '1.6',
  margin: 0
};

const footerContactInfoStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginTop: '8px'
};

const footerContactItemStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#e2e8f0',
  fontSize: '0.9rem'
};

const footerColHeadingStyles = {
  fontFamily: 'Outfit',
  fontWeight: '700',
  fontSize: '1rem',
  color: '#ffffff',
  letterSpacing: '1px',
  marginBottom: '20px',
  textTransform: 'uppercase'
};

const footerLinksColStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  alignItems: 'flex-start'
};

const footerLinkStyles = {
  color: '#a0aec0',
  textDecoration: 'none',
  fontSize: '0.9rem',
  transition: 'var(--transition-smooth)',
  cursor: 'pointer'
};

const footerFollowColStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  alignItems: 'flex-start'
};

const footerSocialIconsStyles = {
  display: 'flex',
  gap: '16px',
  marginTop: '8px'
};

const footerSocialLinkStyles = {
  color: '#e2e8f0',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'var(--transition-smooth)',
  cursor: 'pointer'
};

const footerMiddleRowStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '30px',
  padding: '30px 24px',
  borderBottom: '1px solid rgba(255,255,255,0.08)'
};

const footerPlatformColStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flexWrap: 'wrap'
};

const footerSectionLabelStyles = {
  fontSize: '0.85rem',
  color: '#a0aec0',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const footerPlatformListStyles = {
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  flexWrap: 'wrap'
};

const footerPlatformItemStyles = {
  fontSize: '0.9rem',
  fontWeight: '700',
  color: '#ffffff',
  textTransform: 'lowercase',
  backgroundColor: 'rgba(255,255,255,0.05)',
  padding: '6px 12px',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.08)'
};

const footerPaymentListStyles = {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  flexWrap: 'wrap'
};

const footerPaymentItemStyles = {
  fontSize: '0.8rem',
  fontWeight: '600',
  color: '#e2e8f0',
  backgroundColor: 'rgba(255,255,255,0.05)',
  padding: '4px 10px',
  borderRadius: '4px',
  border: '1px solid rgba(255,255,255,0.08)'
};

const footerPolicyBarStyles = {
  display: 'flex',
  justifyContent: 'center',
  gap: '24px',
  padding: '24px 24px',
  flexWrap: 'wrap'
};

const footerPolicyLinkStyles = {
  color: '#a0aec0',
  textDecoration: 'none',
  fontSize: '0.85rem',
  transition: 'var(--transition-smooth)',
  cursor: 'pointer'
};

const footerCopyrightBarStyles = {
  backgroundColor: '#052e16',
  padding: '16px 0',
  marginTop: '20px'
};

const footerCopyrightContainerStyles = {
  textAlign: 'center',
  fontSize: '0.8rem',
  color: '#a7f3d0'
};

/* DRAWER / GLASS OVERLAY */
const drawerBackdropStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.7)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'flex-end',
  backdropFilter: 'blur(5px)'
};

const drawerPanelStyles = {
  width: '500px',
  height: '100%',
  borderLeft: '1px solid var(--border-glass)',
  borderRadius: '0px',
  display: 'flex',
  flexDirection: 'column',
  animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
};

const drawerHeaderStyles = {
  padding: '24px',
  borderBottom: '1px solid var(--border-glass)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const closeDrawerBtnStyles = {
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  padding: '6px'
};

const drawerBodyStyles = {
  flexGrow: 1,
  overflowY: 'auto',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
};

const emptyCartWrapperStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 1,
  textAlign: 'center'
};

const explorePacksBtnStyles = {
  display: 'inline-block',
  marginTop: '16px',
  backgroundColor: 'var(--primary)',
  color: '#fff',
  textDecoration: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.9rem'
};

const cartItemsListStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const cartItemRowStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  backgroundColor: 'rgba(255,255,255,0.02)',
  border: '1px solid var(--border-glass)',
  borderRadius: '12px'
};

const cartItemInfoStyles = {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  gap: '4px'
};

const cartQtyControllerStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  padding: '4px 8px',
  borderRadius: '8px',
  margin: '0 16px'
};

const qtyBtnStyles = {
  background: 'none',
  border: 'none',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px'
};

const removeProductBtnStyles = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  transition: 'var(--transition-smooth)'
};

const costSummaryStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '20px',
  backgroundColor: 'rgba(255,255,255,0.02)',
  borderRadius: '16px',
  border: '1px solid var(--border-glass)'
};

const costRowStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.95rem',
  color: 'var(--text-secondary)'
};

const checkoutFormStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const inputGroupRowStyles = {
  display: 'flex',
  gap: '12px'
};

const checkoutInputStyles = {
  ...inputStyles,
  padding: '10px 14px',
  fontSize: '0.9rem',
  width: '100%'
};

const placeOrderBtnStyles = {
  width: '100%',
  padding: '14px',
  borderRadius: '12px',
  fontSize: '1rem',
  marginTop: '16px'
};

const checkoutSuccessWrapperStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '40px 24px',
  flexGrow: 1,
  justifyContent: 'center'
};

const checkoutSuccessCircleStyles = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: 'rgba(16, 185, 129, 0.15)',
  border: '3px solid var(--secondary)',
  color: 'var(--secondary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
  boxShadow: '0 0 20px var(--secondary-glow)'
};

const receiptStyles = {
  width: '100%',
  backgroundColor: '#f8fafc',
  border: '1px dashed var(--border-glass)',
  borderRadius: '12px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '24px'
};

const receiptRowStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.9rem',
  color: 'var(--text-secondary)'
};

const returnToShopBtnStyles = {
  backgroundColor: 'var(--primary)',
  border: 'none',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '10px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'var(--transition-smooth)'
};

const adminLoginPanelStyles = {
  width: '90%',
  maxWidth: '450px',
  border: '1px solid var(--border-glass)',
  margin: 'auto',
  borderRadius: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  display: 'flex',
  flexDirection: 'column',
  padding: '2.5rem',
  animation: 'fadeIn 0.3s ease-out'
};

const adminLoginSubmitBtnStyles = {
  flex: 1,
  padding: '12px',
  backgroundColor: 'var(--primary)',
  color: '#ffffff',
  border: '2px solid var(--primary)',
  fontWeight: '800',
  fontFamily: "'Space Grotesk', sans-serif",
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  borderRadius: '10px',
  transition: 'var(--transition-smooth)'
};

const adminLoginCancelBtnStyles = {
  padding: '12px 24px',
  backgroundColor: 'transparent',
  color: 'var(--text-secondary)',
  border: '2px solid var(--border-glass)',
  fontWeight: '700',
  fontFamily: "'Space Grotesk', sans-serif",
  cursor: 'pointer',
  borderRadius: '10px',
  transition: 'var(--transition-smooth)'
};

/* ADMIN DASHBOARD PANELS */
const adminPanelStyles = {
  width: '90%',
  maxWidth: '1200px',
  height: '90%',
  border: '1px solid var(--border-glass)',
  margin: 'auto',
  borderRadius: '24px',
  display: 'flex',
  flexDirection: 'column',
  animation: 'fadeIn 0.3s ease-out'
};

const refreshAdminBtnStyles = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--border-glass)',
  color: 'var(--text-secondary)',
  padding: '6px 14px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.85rem',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'var(--transition-smooth)'
};

const adminBodyStyles = {
  flexGrow: 1,
  padding: '30px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '30px'
};

const metricsGridStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '20px'
};

const metricCardStyles = {
  padding: '24px',
  backgroundColor: 'rgba(255,255,255,0.02)',
  border: '1px solid var(--border-glass)',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px'
};

const metricLabelStyles = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const metricValStyles = {
  fontSize: '2rem',
  fontWeight: '800',
  color: 'var(--text-primary)'
};

const tableSectionTitleStyles = {
  fontSize: '1.25rem',
  color: 'var(--text-primary)',
  marginBottom: '8px'
};

const tableContainerStyles = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-glass)',
  borderRadius: '16px',
  overflowX: 'auto'
};

const tableStyles = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left'
};

const tableHeaderRowStyles = {
  borderBottom: '1px solid var(--border-glass)',
  backgroundColor: 'var(--bg-main)'
};

const thStyles = {
  padding: '16px',
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const tableBodyRowStyles = {
  borderBottom: '1px solid var(--border-glass)',
  transition: 'var(--transition-smooth)'
};

const tdStyles = {
  padding: '16px',
  fontSize: '0.9rem',
  color: 'var(--text-primary)',
  verticalAlign: 'middle'
};

const statusBadgeStyles = {
  backgroundColor: 'rgba(16, 185, 129, 0.15)',
  color: 'var(--secondary)',
  padding: '4px 10px',
  borderRadius: '20px',
  fontSize: '0.8rem',
  fontWeight: '600'
};

const emptyStateStyles = {
  padding: '40px',
  textAlign: 'center',
  color: 'var(--text-muted)',
  fontSize: '0.95rem'
};

const messagesScrollContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  maxHeight: '450px',
  overflowY: 'auto',
  paddingRight: '6px'
};

const msgCardStyles = {
  padding: '16px',
  backgroundColor: '#f8fafc',
  border: '1px solid var(--border-glass)',
  borderRadius: '12px'
};

const msgCardHeaderStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '4px'
};

const faqSectionStyles = {
  padding: '100px 0',
  backgroundColor: 'var(--bg-main)',
  borderTop: '1px solid var(--border-glass)',
  borderBottom: '1px solid var(--border-glass)'
};

const tabBarContainerStyles = {
  display: 'inline-flex',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-glass)',
  padding: '4px',
  borderRadius: '30px',
  marginBottom: '40px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
};

const tabButtonActiveStyles = {
  padding: '10px 24px',
  borderRadius: '24px',
  backgroundColor: 'var(--primary)',
  color: '#fff',
  border: 'none',
  fontSize: '0.95rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'var(--transition-smooth)'
};

const tabButtonInactiveStyles = {
  padding: '10px 24px',
  borderRadius: '24px',
  backgroundColor: 'transparent',
  color: 'var(--text-secondary)',
  border: 'none',
  fontSize: '0.95rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'var(--transition-smooth)'
};

const faqContainerStyles = {
  maxWidth: '900px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const accordionItemStyles = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-glass)',
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'var(--transition-smooth)'
};

const accordionHeaderStyles = {
  width: '100%',
  padding: '20px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  gap: '16px'
};

const accordionQuestionStyles = {
  fontSize: '1.05rem',
  fontWeight: '600',
  color: 'var(--text-primary)',
  margin: 0
};

const accordionToggleStyles = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  backgroundColor: 'var(--primary-glow)',
  color: 'var(--primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  flexShrink: 0
};

const accordionAnswerStyles = {
  padding: '0 24px 20px 24px',
  color: 'var(--text-secondary)',
  fontSize: '0.95rem',
  lineHeight: '1.6',
  borderTop: '1px solid var(--border-glass)',
  paddingTop: '16px'
};

const viewMoreBtnStyles = {
  backgroundColor: 'transparent',
  color: 'var(--primary)',
  border: 'none',
  fontSize: '0.95rem',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  margin: '24px auto 0 auto',
  transition: 'var(--transition-smooth)'
};

const askExpertContainerStyles = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 0.8fr',
  gap: '40px',
  alignItems: 'start'
};

const expertQListStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const expertFormCardStyles = {
  padding: '30px',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-glass)',
  borderRadius: '24px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.02)'
};

const switcherWrapperStyles = {
  position: 'fixed',
  top: '100px',
  right: '24px',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '10px'
};

const switcherBtnStyles = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: 'var(--primary, #f97316)',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  transition: 'var(--transition-smooth)'
};

const switcherMenuStyles = {
  backgroundColor: '#0a0b0d',
  border: '1px solid var(--border-glass, rgba(255,255,255,0.15))',
  borderRadius: '16px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  minWidth: '180px',
  backdropFilter: 'blur(10px)',
  animation: 'fadeIn 0.2s ease-out'
};

const switcherTitleStyles = {
  fontSize: '0.8rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: '#a0aec0',
  marginBottom: '4px',
  paddingBottom: '4px',
  borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const activeLinkStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#fff',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: '600',
  padding: '6px 8px',
  borderRadius: '8px',
  backgroundColor: 'rgba(255,255,255,0.08)'
};

const inactiveLinkStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#a0aec0',
  textDecoration: 'none',
  fontSize: '0.9rem',
  padding: '6px 8px',
  borderRadius: '8px',
  transition: 'var(--transition-smooth)'
};

const dotStyles = (color) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: color,
  display: 'inline-block'
});
