"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { products } from "../data/products";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Image as ImageIcon, X, Globe, Factory, Shield, Award,
  MapPin, Mail, Phone, ChevronRight, CheckCircle2, History,
  Target, Eye, ChevronLeft, Menu, MessageCircle, Send, User,
  Building2, Star, Zap, Heart, Activity, Lock, Play, Bot, Sparkles, Trash2,
  Plus, Minus
} from "lucide-react";

/* ─── Helpers ──────────────────────────────────── */
const ImageWithFallback = ({ src, alt }) => {
  const [error, setError] = useState(false);
  const isValid = src && src.trim() !== "";
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {isValid && !error ? (
        <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setError(true)} />
      ) : (
        <div className="photo-placeholder-ui">
          <ImageIcon className="placeholder-icon" size={28} />
          <div className="placeholder-text">[IMAGE]</div>
          <div className="placeholder-name">{alt}</div>
        </div>
      )}
    </div>
  );
};

const Particles = () => {
  const [mounted, setMounted] = useState(false);
  const [ps, setPs] = useState([]);
  useEffect(() => {
    setPs(Array.from({ length: 6 }, (_, i) => ({
      id: i, size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    })));
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <>
      {ps.map(p => (
        <div key={p.id} className="particle-hero" style={{
          width: `${p.size}px`, height: `${p.size}px`,
          left: `${p.left}%`, bottom: 0,
          animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
        }} />
      ))}
    </>
  );
};

/* ─── Main ──────────────────────────────────────── */
export default function Home() {
  const [activeMainTab, setActiveMainTab] = useState("UROLOGY");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: "", company: "", email: "", phone: "", product: "", message: "" });
  const [activeSubTab, setActiveSubTab] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quoteSent, setQuoteSent] = useState(false);
  const [isNewsExpanded, setIsNewsExpanded] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, role: "ai", content: "Hello! I am Medi-AI. How can I help you regarding our Urology, Radiology, or Gastroenterology innovations today?" }
  ]);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState({ code: 'en', label: 'English', flag: '🇺🇸' });
  const [openFooterSection, setOpenFooterSection] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth > 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  ];

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
    setIsLangOpen(false);
    
    // Trigger Google Translate engine
    const googleCombo = document.querySelector('.goog-te-combo');
    if (googleCombo) {
      googleCombo.value = lang.code;
      googleCombo.dispatchEvent(new Event('change'));
    }
  };

  const scrollRef = useRef(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now(), role: "user", content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      const botResponse = getBotResponse(chatInput);
      setChatMessages(prev => [...prev, { id: Date.now() + 1, role: "ai", content: botResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (input) => {
    const low = input.toLowerCase();
    if (low.includes("urology") || low.includes("pcnl")) return "We offer a comprehensive Urology range including PCNL sets, Ureteric Catheters, and DJ Stents. Would you like to see technical specs for any specific device?";
    if (low.includes("radiology") || low.includes("needle")) return "Our Interventional Radiology line features high-precision Chiba needles, Biopsy guns, and Drainage catheters. All are ISO and CE certified.";
    if (low.includes("contact") || low.includes("address")) return "You can find us at our 50,000 sq.ft facility in Rajasthan, India. You can also use the 'Get a Quote' button to reach our sales team directly!";
    if (low.includes("price") || low.includes("cost")) return "For pricing and bulk orders, please use our 'Request Quote' form. We export to over 45 countries with competitive clinical pricing.";
    return "That's an interesting question! For detailed clinical specifications, I recommend checking our Product Catalog or requesting a quote so our experts can assist you directly.";
  };


  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scroll = (dir) => { if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'left' ? -350 : 350, behavior: 'smooth' }); };

  const PerformanceGraph = () => {
    const points = [
      { x: 0, y: 180, label: "2004" },
      { x: 100, y: 160, label: "2008" },
      { x: 200, y: 130, label: "2012" },
      { x: 300, y: 110, label: "2016" },
      { x: 400, y: 60, label: "2020" },
      { x: 500, y: 20, label: "2024" }
    ];
    
    // Create smooth Bezier path
    const getCurvePath = (pts) => {
      if (pts.length < 2) return "";
      let d = `M ${pts[0].x},${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i];
        const p1 = pts[i + 1];
        const cp1x = p0.x + (p1.x - p0.x) / 2;
        d += ` C ${cp1x},${p0.y} ${cp1x},${p1.y} ${p1.x},${p1.y}`;
      }
      return d;
    };

    const d = getCurvePath(points);
    const areaD = `${d} L 500,200 L 0,200 Z`;

    return (
      <div className="performance-graph-wrap">
        <svg viewBox="0 0 500 200" className="performance-svg" preserveAspectRatio="none" style={{ width: "100%", height: "220px", maxHeight: "280px", display: "block", overflow: "visible" }}>
          <defs>
            <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--sky-400)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--sky-50)" stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Target Line */}
          <line x1="0" y1="15" x2="500" y2="15" stroke="var(--sky-300)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
          <text x="495" y="10" textAnchor="end" style={{ fontSize: "8px", fill: "var(--sky-500)", fontWeight: 700, textTransform: "uppercase" }}>1M+ Goal</text>

          {/* Grid lines */}
          {[50, 100, 150].map(y => <line key={y} x1="0" y1={y} x2="500" y2={y} className="graph-grid-line" stroke="var(--gray-100)" strokeWidth="0.5" />)}
          
          {/* Area */}
          <motion.path 
            d={areaD} 
            fill="url(#graphGradient)"
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }} 
            transition={{ duration: 1.5 }} 
          />
          
          {/* Path */}
          <motion.path 
            d={d} 
            stroke="var(--sky-500)" 
            strokeWidth="3" 
            fill="none"
            filter="url(#glow)"
            initial={{ pathLength: 0 }} 
            whileInView={{ pathLength: 1 }} 
            viewport={{ once: true }} 
            transition={{ duration: 2, ease: "easeInOut" }} 
          />
          
          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              <motion.circle 
                cx={p.x} cy={p.y} r="5" fill="white" stroke="var(--sky-500)" strokeWidth="2"
                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} 
                transition={{ delay: 1 + i * 0.15 }} 
              />
              {i === points.length - 1 && (
                <motion.circle 
                  cx={p.x} cy={p.y} r="10" stroke="var(--sky-400)" strokeWidth="1" fill="none"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </g>
          ))}
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem", padding: "0 10px" }}>
          {points.map(p => <span key={p.label} style={{ fontSize: "0.75rem", color: "var(--gray-400)", fontWeight: 700, fontFamily: "var(--font-display)" }}>{p.label}</span>)}
        </div>
      </div>
    );
  };

  const handleQuoteSubmit = e => {
    e.preventDefault();
    setQuoteSent(true);
    setTimeout(() => { setQuoteSent(false); setQuoteOpen(false); setQuoteForm({ name: "", company: "", email: "", phone: "", product: "", message: "" }); }, 3000);
  };

  const mainTabs = useMemo(() => [...new Set(products.map(p => p.mainTab))], []);

  const subTabs = useMemo(() => {
    const list = [...new Set(products.filter(p => p.mainTab === activeMainTab).map(p => p.subTab))];
    return list.filter(s => s !== "");
  }, [activeMainTab]);

  const marqueeProducts = products.filter(p => p.image).slice(0, 8);
  const filteredProducts = useMemo(
    () => products.filter(p => p.mainTab === activeMainTab && (activeSubTab === "" || p.subTab === activeSubTab || subTabs.length === 0)),
    [activeMainTab, activeSubTab, subTabs]
  );

  useEffect(() => {
    document.body.style.overflow = (selectedProduct || mobileNavOpen || quoteOpen) ? "hidden" : "unset";
  }, [selectedProduct, mobileNavOpen, quoteOpen]);

  const navLinks = [
    { label: "Specialties", href: "#specialties" },
    { label: "Products", href: "#products" },
    { label: "About", href: "#company" },
    { label: "Contact", href: "#contact" },
  ];

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const growthScrollRef = useRef(null);
  const [growthProgress, setGrowthProgress] = useState(0);

  const handleGrowthScroll = () => {
    if (!growthScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = growthScrollRef.current;
    const scrollPercent = (scrollLeft / (scrollWidth - clientWidth)) * 100;
    setGrowthProgress(scrollPercent);
  };

  const specialties = [
    {
      title: "Urology", tagline: "Access · Dilation · Drainage",
      desc: "Comprehensive urological device portfolio for PCNL, URS, and urinary diversion procedures — precision-engineered for optimal clinical outcomes.",
      image: "/images/specialty-urology-anatomy.png", mainTab: "UROLOGY", subTab: "Access Products",
    },
    {
      title: "Interventional Radiology", tagline: "Needles · Wires · Biopsy",
      desc: "Image-guided interventional devices including guide wires, Chiba needles, biopsy guns, and abscess drainage systems.",
      image: "/images/specialty-radiology-anatomy.png", mainTab: "INTERVENTIONAL RADIOLOGY", subTab: "Access Products",
    },
    {
      title: "Gastroenterology", tagline: "Stents · Biliary · Endoscopic",
      desc: "Advanced biliary stent systems (Amsterdam, pigtail, straight) and ERCP accessories for precision biliary interventions.",
      image: "/images/specialty-gastro-anatomy.png", mainTab: "GASTROENTEROLOGY", subTab: "Drainage Products",
    },
    {
      title: "Gynaecology & Nephrology", tagline: "IUI · Dialysis · Vascular",
      desc: "IUI catheters for assisted reproduction and triple-lumen hemodialysis catheters for renal replacement therapy.",
      image: "/images/specialty-gynaecology-anatomy.png", mainTab: "GYNAECOLOGY", subTab: "",
    },
  ];

  const features = [
    { icon: <Shield size={22} color="#00d4ff" />, title: "ISO 9001:2008 Certified", desc: "Every device passes stringent multi-stage quality assurance protocols before reaching clinical hands." },
    { icon: <Zap size={22} color="#00d4ff" />, title: "R&D-Driven Innovation", desc: "Our 30,000 sq.ft facility houses dedicated R&D labs continuously developing safer, smarter medical devices." },
    { icon: <Globe size={22} color="#00d4ff" />, title: "Global Distribution", desc: "Trusted by hospitals and distributors across 45+ countries with reliable logistics and regulatory compliance worldwide." },
  ];

  const timeline = [
    { year: "2004", title: "Company Founded", desc: "Launched with 6 pioneering urology products, setting the foundation for precision medical device manufacturing.", side: "left", image: "/images/growth-2004.png" },
    { year: "2007", title: "Portfolio Expansion", desc: "Grew to 19 products across Urology and Interventional Radiology. First international distribution agreements signed.", side: "right", image: "/images/growth-2007.png" },
    { year: "2011", title: "52-Product Range", desc: "Launched Gastroenterology and Gynaecology product lines. Secured ISO 9001 certification.", side: "left", image: "/images/growth-2011.png" },
    { year: "2015", title: "94 Product Variations", desc: "Comprehensive catalog covering all five clinical specialties. Expanded to 30+ export countries.", side: "right", image: "/images/growth-2015.png" },
    { year: "2024", title: "Global Innovation Leader", desc: "Moved to a new 50,000 sq.ft manufacturing complex with advanced clean rooms and R&D infrastructure.", side: "left", image: "/images/growth-2024.png" },
  ];

  return (
    <>
      {/* === NAVBAR === */}
      <nav className={`navbar ${navScrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <a href="/" className="nav-logo" style={{ textDecoration: "none" }}>
            <img src="/images/logo.png" alt="Manish Medi Innovation" style={{ height: "48px", width: "auto" }} />
            <div className="nav-logo-text">
              Manish Medi<span>Innovation</span>
            </div>
          </a>

          {/* Desktop links */}
          <ul className="nav-links-desktop">
            {navLinks.map(l => (
              <li key={l.label}>
                <a href={l.href} className="nav-link-item">{l.label}</a>
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Language Picker */}
            <div className="lang-picker-container">
              <button 
                className="nav-link-item" 
                style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none" }}
                onClick={() => setIsLangOpen(v => !v)}
              >
                <Globe size={18} />
                <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{currentLang.code.toUpperCase()}</span>
              </button>
              
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div 
                    className="lang-dropdown"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25 }}
                  >
                    {languages.map(l => (
                      <button 
                        key={l.code} 
                        className={`lang-item ${currentLang.code === l.code ? 'active' : ''}`}
                        onClick={() => changeLanguage(l)}
                      >
                        <span className="lang-flag">{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="nav-cta" onClick={() => setQuoteOpen(true)}>Get a Quote</button>
            <button
              className={`hamburger ${mobileNavOpen ? "open" : ""}`}
              onClick={() => setMobileNavOpen(v => !v)}
            >
              <span /><span /><span />
            </button>
          </div>

        </div>

        {/* Mobile Nav */}
        <div className={`mobile-nav ${mobileNavOpen ? "open" : ""}`}>
          {navLinks.map(l => (
            <a key={l.label} href={l.href} className="nav-link-item" style={{ fontSize: "1.5rem" }} onClick={() => setMobileNavOpen(false)}>
              {l.label}
            </a>
          ))}
          <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={() => { setMobileNavOpen(false); setQuoteOpen(true); }}>
            Get a Quote
          </button>
        </div>
      </nav>

      {/* === HERO === */}
      <section className="hero-section">
        {/* Background Video */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          preload="auto"
          className="hero-background-video"
        >
          <source src="/videos/video-project.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-video-overlay" />
        
        <div className="hero-grid" />
        <Particles />

        <div className="hero-content-wrap">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="hero-text-container">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <div className="hero-badge">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--electric)", animation: "pulse 2s ease-in-out infinite", display: "inline-block" }} />
                ISO 9001:2008 · 20+ Years · 45+ Countries
              </div>
              <h1 className="hero-title">
                Precision.
                <span className="highlight">Innovation.</span>
                Care.
              </h1>
              <p className="hero-subtitle">
                World-class medical devices for Urology, Radiology, Gastroenterology, Gynaecology &amp; Nephrology — trusted by clinicians in 45+ countries.
              </p>
              <div className="hero-cta-row">
                <button className="btn btn-primary" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>
                  Explore Products <ChevronRight size={18} />
                </button>
                <button className="btn btn-ghost" onClick={() => setQuoteOpen(true)}>
                  Request a Quote
                </button>
              </div>
              <div className="hero-stats">
                {[
                  { val: "100+", lbl: "Medical Devices" },
                  { val: "45+", lbl: "Countries" },
                  { val: "1M+", lbl: "Units / Month" },
                ].map(s => (
                  <div key={s.lbl}>
                    <span className="hero-stat-value">{s.val}</span>
                    <span className="hero-stat-label">{s.lbl}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* === FEATURED PRODUCTS SCROLLER === */}
      <section className="featured-section section-pad-sm">
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <div>
              <div className="section-label section-label-dark">Featured Devices</div>
              <h2 style={{ color: "var(--gray-900)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}>Flagship Products</h2>
            </div>
            <button className="btn btn-ghost" style={{ fontSize: "0.82rem", padding: "0.6rem 1.25rem" }} onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>
              View All <ChevronRight size={15} />
            </button>
          </div>
          <div className="featured-scroller">
            {marqueeProducts.map((p, idx) => (
              <motion.div
                key={p.id} className="featured-card"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: idx * 0.07 }}
                onClick={() => setSelectedProduct(p)}
              >
                <div className="featured-card-img">
                  <ImageWithFallback src={p.image} alt={p.name} />
                </div>
                <div className="featured-card-body">
                  <div className="featured-card-name">{p.name}</div>
                  <div className="featured-card-cat">{p.mainTab} · {p.subTab}</div>
                  <div className="featured-card-link">View Specs <ChevronRight size={13} /></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === SPECIALTIES === */}
      <section id="specialties" className="specialties-section section-pad">
        <div className="container">
          <motion.div className="text-center" style={{ marginBottom: "4rem" }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="section-label section-label-dark">Clinical Specialties</div>
            <h2 style={{ color: "var(--gray-900)" }}>Advancing Every Specialty</h2>
            <p style={{ color: "var(--gray-500)", maxWidth: 580, margin: "1.25rem auto 0", fontSize: "1.05rem" }}>
              Five clinical verticals. One trusted manufacturer. Precision-engineered devices that clinicians rely on globally.
            </p>
          </motion.div>

          <div className="specialty-grid">
            {specialties.map((spec, idx) => (
              <motion.div
                key={spec.title}
                className="specialty-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => { setActiveMainTab(spec.mainTab); setActiveSubTab(spec.subTab); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}
              >
                <div className="specialty-card-img" style={{ backgroundImage: `url(${spec.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div className="specialty-card-overlay" />
                <div className="specialty-card-content">
                  <div className="specialty-card-tag">{spec.tagline}</div>
                  <div className="specialty-card-title">{spec.title}</div>
                  <p className="specialty-card-desc">{spec.desc}</p>
                  <div className="specialty-card-action">Explore Devices <ChevronRight size={15} /></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === STATS + FEATURES === */}
      <section className="stats-section section-pad">
        <div className="container">
          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="section-label section-label-dark text-center" style={{ marginBottom: "2.5rem" }}>Growth & Metrics</div>
            
            <div className="growth-dashboard-card">
              <div className="dashboard-grid-50-50">
                {/* Left Side — Chart */}
                <div className="dashboard-chart-side">
                  <div className="performance-badge">Performance Trend</div>
                  <h3 className="dashboard-h3">Manufacturing Capacity</h3>
                  <p className="dashboard-p">Global expansion & production growth</p>
                  
                  <div className="dashboard-chart-box">
                    <PerformanceGraph />
                  </div>
                </div>

                {/* Right Side — Stats Grid */}
                <div className="dashboard-stats-side">
                  <div className="stats-2x2-grid">
                    {[
                      { num: "1M+", lbl: "Units / Month", icon: <Zap size={20} />, sub: "Manufacturing scale" },
                      { num: "45+", lbl: "Export Countries", icon: <Globe size={20} />, sub: "Trusted globally" },
                      { num: "20+", lbl: "Years Excellence", icon: <Award size={20} />, sub: "Since 2004" },
                      { num: "100+", lbl: "Devices", icon: <Activity size={20} />, sub: "Full portfolio" },
                    ].map((s, i) => (
                      <motion.div 
                        key={s.lbl} 
                        className="dashboard-stat-mini"
                        initial={{ opacity: 0, x: 20 }} 
                        whileInView={{ opacity: 1, x: 0 }} 
                        viewport={{ once: true }} 
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="stat-icon-circle">{s.icon}</div>
                        <div>
                          <div className="stat-val-mini">{s.num}</div>
                          <div className="stat-label-mini">{s.lbl}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div style={{ marginTop: "2rem" }}>
                    <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setQuoteOpen(true)}>
                      Request Quote & Specs <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* === ABOUT / COMPANY === */}
      <section id="company" className="about-section section-pad">
        <div className="container">
          <motion.div className="text-center" style={{ marginBottom: "4rem" }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="section-label section-label-light">About Manish Medi</div>
            <h2 style={{ color: "var(--gray-900)" }}>Who We Are</h2>
            <p style={{ color: "var(--gray-500)", maxWidth: 600, margin: "1.25rem auto 0", fontSize: "1.05rem" }}>
              Founded in 2004, we have grown from a 6-product startup to a global medical device manufacturer trusted across 45+ countries.
            </p>
          </motion.div>

          {/* Vision + Mission */}
          <div className="about-cards-row">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="vision-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ height: "180px", position: "relative" }}>
                  <img src="/images/vision.png" alt="Our Vision" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div className="vc-icon-wrap" style={{ position: "absolute", bottom: "-20px", right: "20px", background: "white", boxShadow: "var(--shadow-md)" }}>
                    <Eye size={24} color="#00d4ff" />
                  </div>
                </div>
                <div style={{ padding: "2.5rem" }}>
                  <span className="vc-label" style={{ color: "rgba(0,212,255,0.8)" }}>Our Vision</span>
                  <div className="vc-title" style={{ color: "white" }}>Serving Patients Worldwide</div>
                  <p className="vc-text" style={{ color: "rgba(255,255,255,0.65)" }}>
                    To provide high-quality, cost-effective medical products and serve patients worldwide with advanced healthcare solutions that make precision care accessible to everyone.
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="mission-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ height: "180px", position: "relative" }}>
                  <img src="/images/mission.png" alt="Our Mission" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div className="vc-icon-wrap" style={{ position: "absolute", bottom: "-20px", right: "20px", background: "white", boxShadow: "var(--shadow-md)" }}>
                    <Target size={24} color="var(--electric-dim)" />
                  </div>
                </div>
                <div style={{ padding: "2.5rem" }}>
                  <span className="vc-label" style={{ color: "var(--electric-dim)" }}>Our Mission</span>
                  <div className="vc-title" style={{ color: "var(--gray-900)" }}>Innovation Without Compromise</div>
                  <p className="vc-text" style={{ color: "var(--gray-500)" }}>
                    To continuously innovate and manufacture reliable medical devices meeting international standards, ensuring affordability and accessibility for healthcare systems across the globe.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ═══ OUR GROWTH STORY (Horizontal Slider) ═══ */}
          <motion.div className="growth-slider-wrapper" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h3 className="section-title text-center" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 15, marginBottom: "4rem" }}>
              <History size={32} color="var(--sky-600)" /> Our Growth Journey
            </h3>

            {/* Progress Bar Above */}
            <div className="growth-progress-container">
              <div className="growth-progress-fill" style={{ width: `${growthProgress}%` }} />
            </div>

            {/* Horizontal Scroll Row */}
            <div className="growth-scroll-row" ref={growthScrollRef} onScroll={handleGrowthScroll}>
              {timeline.map((t, i) => (
                <motion.div 
                  key={t.year} 
                  className="growth-card-premium"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "0px" }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                >
                  <div className="growth-year-backdrop">{t.year}</div>
                  <div className="growth-year-indicator">{t.year}</div>
                  
                  {t.image && (
                    <div className="growth-card-img-box">
                      <img src={t.image} alt={t.title} loading="lazy" />
                    </div>
                  )}
                  
                  <h4 className="growth-title-h4">{t.title}</h4>
                  <p className="growth-desc-p">{t.desc}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center" style={{ marginTop: "2rem", color: "var(--gray-400)", fontSize: "0.85rem", fontWeight: 600 }}>
              ← Swipe to explore our history →
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- QUALITY STANDARDS --- */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} style={{ marginTop: "5rem" }}>
            <div className="text-center" style={{ marginBottom: "3rem" }}>
              <div className="section-label section-label-light">Certifications</div>
              <h2 style={{ color: "var(--gray-900)" }}>Quality Standards</h2>
            </div>
            <div className="quality-grid">
              {/* Left — Certificate Image */}
              <div className="quality-cert-image">
                {/* TODO: Replace path with actual certificate image */}
                <img src="/images/iso-certificate.png" alt="ISO 9001:2015 Certificate - Manish Medi Innovation" style={{ width: "100%", height: "auto", borderRadius: "var(--r-lg)", border: "1px solid var(--sky-200)", boxShadow: "var(--shadow-md)" }} />
              </div>
              {/* Right — Content */}
              <div className="quality-content">
                <p style={{ color: "var(--gray-600)", fontSize: "1.02rem", lineHeight: 1.85, marginBottom: "2rem" }}>
                  Manish Medi Innovation brings renewed levels of excellence in all its products and services. We are committed to comply with the requirements of both customers and regulatory authorities.
                </p>
                <div className="quality-milestones">
                  {[
                    { year: "2007", title: "ISO 9001 Certification", desc: "Achieved ISO 9001 quality management system certification, establishing our commitment to global standards." },
                    { year: "2009", title: "ISO 13485 Certification", desc: "Obtained ISO 13485 certification for medical device quality management, increasing our credibility worldwide." },
                    { year: "2011", title: "CE Marking", desc: "Certified with CE marking, indicating conformity with health, safety, and environmental protection standards." },
                    { year: "2013", title: "Indian FDA Approval", desc: "Obtained certification from Indian FDA for the manufacture of 21 medical device products." },
                  ].map((m, i) => (
                    <motion.div key={m.year} className="quality-milestone" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                      <div className="qm-year">{m.year}</div>
                      <div>
                        <div className="qm-title">{m.title}</div>
                        <div className="qm-desc">{m.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Certification Logos - Medium */}
            <div className="auth-logo-row">
              {[
                { src: "/images/auth/iaf.png", alt: "IAF Member" },
                { src: "/images/auth/iso-3ec.png", alt: "3EC Certified" },
                { src: "/images/auth/iso-9001.png", alt: "ISO 9001" },
                { src: "/images/auth/iso-13485.png", alt: "ISO 13485" },
                { src: "/images/auth/ce.png", alt: "CE Mark" },
                { src: "/images/auth/recycle.png", alt: "Recyclable" },
              ].map((logo, i) => (
                <div key={i} className="auth-logo-item">
                  <img src={logo.src} alt={logo.alt} className="auth-logo-medium" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* --- R&D SECTION --- */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginTop: "5rem" }}>
            <div className="text-center" style={{ marginBottom: "3rem" }}>
              <div className="section-label section-label-light">Innovation Hub</div>
              <h2 style={{ color: "var(--gray-900)" }}>Research &amp; Development</h2>
            </div>
            <div className="rnd-grid">
              <div className="rnd-content">
                <p style={{ color: "var(--gray-600)", fontSize: "1.02rem", lineHeight: 1.85, marginBottom: "1.5rem" }}>
                  Our laboratory and R&amp;D operates in Class 10,000 clean rooms as per ISO standards. Manish Medi Innovation has ensured to support the medical products for the treatment of various pathologies relating to Urology, Gastroenterology, Gynecology, Radiology, and Nephrology through its effective Research and Development.
                </p>
                <div className="rnd-features">
                  {[
                    { icon: <Lock size={18} color="var(--sky-600)" />, text: "Class 10,000 clean room R&D laboratory" },
                    { icon: <Activity size={18} color="var(--sky-600)" />, text: "Continuous product innovation & improvement" },
                    { icon: <CheckCircle2 size={18} color="var(--sky-600)" />, text: "Multi-stage quality testing & validation" },
                    { icon: <Zap size={18} color="var(--sky-600)" />, text: "5 clinical specialties covered" },
                  ].map((f, i) => (
                    <motion.div key={i} className="rnd-feature" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                      <div className="rnd-feature-icon">{f.icon}</div>
                      <span>{f.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="rnd-visual">
                <div className="rnd-visual-card" style={{ background: "none", border: "none", boxShadow: "none" }}>
                  <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "var(--r-xl)", overflow: "hidden", border: "1px solid var(--sky-200)", boxShadow: "var(--shadow-md)" }}>
                    <img src="/images/rnd-lab.png" alt="R&D Lab" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", padding: "1.5rem" }}>
                      <div className="rnd-visual-title" style={{ color: "white" }}>Class 10,000 Lab</div>
                      <div className="rnd-visual-subtitle" style={{ color: "rgba(255,255,255,0.7)" }}>Sterile Innovation Hub</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- INFRASTRUCTURE SECTION --- */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginTop: "5rem" }}>
            <div className="text-center" style={{ marginBottom: "3rem" }}>
              <div className="section-label section-label-light">World-Class Facilities</div>
              <h2 style={{ color: "var(--gray-900)" }}>Infrastructure</h2>
            </div>
            <p className="text-center" style={{ color: "var(--gray-500)", maxWidth: 700, margin: "0 auto 3rem", fontSize: "1.02rem", lineHeight: 1.85 }}>
              There are 4 dedicated world-class manufacturing facilities to produce international medical devices. All assembly activities are done under Class 100,000 clean rooms.
            </p>
            <div className="infra-grid-premium">
              <div className="infra-content-side">
                {[
                  { icon: <Factory size={24} color="var(--sky-600)" />, title: "4 Manufacturing Facilities", desc: "Dedicated world-class facilities designed to produce international-grade medical devices with precision." },
                  { icon: <Shield size={24} color="var(--sky-600)" />, title: "Class 100,000 Clean Rooms", desc: "All assembly activities are performed under Class 100,000 clean room environments for maximum sterility." },
                  { icon: <Lock size={24} color="var(--sky-600)" />, title: "Class 10,000 Packing", desc: "Primary packaging of all products happens in Class 10,000 clean rooms maintaining contamination-free standards." },
                  { icon: <Zap size={24} color="var(--sky-600)" />, title: "ISO-Standard R&D Lab", desc: "Laboratory and R&D operates in Class 10,000 as per ISO standards for advanced product development." },
                ].map((item, i) => (
                  <motion.div key={item.title} className="infra-card" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ display: "flex", gap: "1.25rem", padding: "1.5rem" }}>
                    <div className="infra-icon" style={{ flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <div className="infra-title" style={{ marginBottom: "0.25rem" }}>{item.title}</div>
                      <div className="infra-desc">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div className="infra-visual-wrap" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <img src="/images/infrastructure.png" alt="World-Class Manufacturing Facility" style={{ width: "100%", height: "auto" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(255,255,255,0.1), transparent)" }} />
              </motion.div>
            </div>
          </motion.div>

      {/* === PRODUCT CATALOG === */}
      <section id="products" className="catalog-section section-pad">
        <div className="container">
          <motion.div style={{ marginBottom: "2.5rem" }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="catalog-hero-label">Our Instruments</div>
            <h2 style={{ color: "var(--gray-900)" }}>Precision Medical Device Catalog</h2>
          </motion.div>

          {/* Main Tabs */}
          <div className="main-tabs-bar">
            {mainTabs.map(tab => (
              <button key={tab} className={`main-tab-btn ${activeMainTab === tab ? "active" : ""}`}
                onClick={() => {
                  setActiveMainTab(tab);
                  const firstSub = products.find(p => p.mainTab === tab && p.subTab !== "")?.subTab || "";
                  setActiveSubTab(firstSub);
                  setTimeout(() => scrollRef.current?.scrollTo({ left: 0 }), 50);
                }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Sub Tabs */}
          {subTabs.length > 0 && (
            <div className="sub-tabs-bar">
              {subTabs.map(sub => (
                <button key={sub} className={`sub-tab-btn ${activeSubTab === sub ? "active" : ""}`}
                  onClick={() => { setActiveSubTab(sub); setTimeout(() => scrollRef.current?.scrollTo({ left: 0 }), 50); }}>
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="catalog-controls">
            <span className="catalog-count">{filteredProducts.length} products in {activeSubTab || activeMainTab}</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="scroll-arrow-btn" onClick={() => scroll("left")}><ChevronLeft size={18} /></button>
              <button className="scroll-arrow-btn" onClick={() => scroll("right")}><ChevronRight size={18} /></button>
            </div>
          </div>

          {/* Product Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeMainTab}-${activeSubTab}`}
              ref={scrollRef}
              className="product-scroll-row"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {filteredProducts.map((p, idx) => (
                <motion.div
                  key={p.id}
                  className="prod-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                  onClick={() => setSelectedProduct(p)}
                >
                  <div className="prod-card-img">
                    <ImageWithFallback src={p.image} alt={p.name} />
                  </div>
                  <div className="prod-card-body">
                    <div className="prod-card-name">{p.name}</div>
                    <div className="prod-card-detail">
                      {p.specifications?.Sizes || p.specifications?.Types || p.subTab || "Standard specification"}
                    </div>
                    <div className="prod-card-action">View Specs <ChevronRight size={13} /></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ LATEST NEWS & EVENTS ═════════════════════ */}
      <section id="news" className="news-section section-pad">
        <div className="container">
          <motion.div className="text-center" style={{ marginBottom: "5rem" }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="section-label section-label-light">Updates & Media</div>
            <h2 style={{ color: "var(--gray-900)" }}>Latest Events &amp; News</h2>
          </motion.div>

          <div className="news-grid">
            {/* 1. LATEST EVENTS */}
            <div className="news-events-showcase">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h3 style={{ color: "var(--gray-900)", fontSize: "1.5rem" }}>Latest Events</h3>
                <div style={{ color: "var(--sky-600)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: 1 }}>Recent Highlights</div>
              </div>
              <div className="news-events-row">
                {[
                  { title: "MedTech Asia 2024", desc: "Showcasing our latest urology innovations at the premier healthcare exhibition in Bangkok. Demonstrating precision-engineered catheters to global clinicians.", date: "MAR 2024", tag: "Exhibition", img: "/images/event-medtech.png" },
                  { title: "Clean Room Expansion", desc: "Completed commissioning of our new Class 10,000 packing facility. This expansion triples our daily production capacity for sterile devices.", date: "FEB 2024", tag: "Facility", img: "/images/event-cleanroom.png" },
                  { title: "Global Partner Meet", desc: "Hosting distributors from 20+ countries at our corporate headquarters. Fostering innovation partnerships for next-gen medical solutions.", date: "JAN 2024", tag: "Global", img: "/images/event-partners.png" },
                ].map((ev, i) => (
                  <motion.div key={ev.title} className="event-card-nextgen" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}>
                    <div className="event-img-wrap">
                      <img src={ev.img} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div className="event-glass-badge">{ev.date}</div>
                    </div>
                    <div className="event-content">
                      <span className="event-tag-premium">{ev.tag}</span>
                      <h4 className="event-title-h4">{ev.title}</h4>
                      <p className="event-desc-p">{ev.desc}</p>
                      <button className="btn-event-more">
                        Know More <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 2. VIDEO SHOWCASE */}
            <div className="news-video-showcase">
              <motion.div 
                className="video-glass-container"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="news-video-container">
                  <div className="video-status-tag">
                    <span className="status-pulse"></span>
                    FEATURED SHOWCASE
                  </div>
                  <video 
                    className="showcase-video"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/images/video-poster.jpg"
                  >
                    <source src="/videos/corporate-showcase.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="video-overlay-text">
                    <div className="glass-play-btn">
                      <Play size={32} fill="white" color="white" />
                    </div>
                    <p className="video-caption">Manish Medi Innovation Journey</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 3. ELITE PROGRESSIVE ARTICLE (Mr. Nirmal's Story) */}
            <div className="elite-news-hub" id="full-news">
              <div className="elite-article-teaser">
                {/* Teaser Hero */}
                <div className="teaser-hero-wrap">
                  <img src="/images/news/nirmal-story.png" alt="Mr. Nirmal - Visionary Leadership" className="teaser-hero-img" />
                </div>

                {/* Teaser Text */}
                <div className="teaser-content">
                  <span className="teaser-pretitle">The Visionary Journey</span>
                  <h3 className="teaser-h3">
                    Engineering Confidence <br/> 
                    for Global Healthcare
                  </h3>
                  
                  <button 
                    className="btn-elite-expand" 
                    onClick={() => {
                        setIsNewsExpanded(true);
                        document.body.style.overflow = "hidden";
                    }}
                  >
                    Read Full Story
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Premium News Modal */}
            <AnimatePresence>
              {isNewsExpanded && (
                <motion.div 
                    className="elite-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                        setIsNewsExpanded(false);
                        document.body.style.overflow = "unset";
                    }}
                >
                  <motion.div 
                    className="elite-modal-container"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="elite-modal-header">
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--sky-500)" }} />
                            <span style={{ fontWeight: 800, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: 1, color: "var(--gray-900)" }}>Global Leadership Story</span>
                        </div>
                        <button className="elite-modal-close" onClick={() => {
                            setIsNewsExpanded(false);
                            document.body.style.overflow = "unset";
                        }}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="elite-modal-body">
                      <div className="story-grid-elite">
                        {/* Main Context */}
                        <div className="story-main-text">
                          <h2 style={{ marginBottom: "2rem", color: "var(--gray-900)" }}>Engineering Confidence for Global Healthcare</h2>
                          
                          <p className="story-para">
                            In an extraordinary tale of vision and innovation, Mr Nirmal, the pioneering force behind Manish Medi Innovation, 
                            has led the company to unparalleled success in the global medical landscape. With over two decades of experience, 
                            his leadership has not only steered the organization through the intricacies of the medical industry but has also 
                            established it as a beacon of excellence and ingenuity.
                          </p>
                          <p className="story-para">
                            Under his guidance, Manish Medi has become a symbol of cutting-edge medical solutions, excelling in Urology, 
                            Gastroenterology, Gynecology, Radiology, and Nephrology. The commitment to precision, accuracy, and hygiene 
                            has elevated the organization to a position of trust, resonating with patients and healthcare professionals alike.
                          </p>

                          <div className="story-highlight-quote">
                            &quot;The &apos;Make in India&apos; tag resonates with international markets, showcasing the prowess of Indian innovation on a global stage.&quot;
                          </div>

                          <p className="story-para">
                            What sets Manish Medi apart is not just its local success but its global impact. Operating from a sprawling 50,000 sq.ft. 
                            facility with four world-class manufacturing units, the organization exports its state-of-the-art medical devices to over 45 countries.
                          </p>
                          <p className="story-para">
                            Certified with ISO 13485, CE, and Indian FDA approvals, Manish Medi stands as a testament to its commitment to quality 
                            and compliance. The facilities adhere to stringent International GMP standards, ensuring the production of approx. 250,000 units 
                            per month with the utmost precision.
                          </p>
                        </div>

                        {/* Impact Stats Panel */}
                        <div className="story-stats-panel">
                          <div className="impact-chip">
                            <div className="impact-val">250K</div>
                            <div className="impact-label">Units / Month</div>
                          </div>
                          <div className="impact-chip">
                            <div className="impact-val">45+</div>
                            <div className="impact-label">Global Markets</div>
                          </div>
                          <div className="impact-chip">
                            <div className="impact-val">20+</div>
                            <div className="impact-label">Years Excellence</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* === CONTACT === */}
      <section id="contact" className="contact-section section-pad">
        <div className="container">
          <motion.div className="text-center" style={{ marginBottom: "4rem" }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="section-label section-label-dark">Get In Touch</div>
            <h2 style={{ color: "var(--gray-900)" }}>Partner With Us</h2>
            <p style={{ color: "var(--gray-500)", maxWidth: 560, margin: "1rem auto 0" }}>
              Whether you are a hospital, distributor, or procurement specialist — we would love to hear from you.
            </p>
          </motion.div>

          <div className="contact-grid">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="contact-left-title">Let&apos;s collaborate on better healthcare.</div>
              <p style={{ color: "var(--gray-500)", fontSize: "0.92rem", lineHeight: 1.8, marginBottom: "2rem" }}>
                From product enquiries to full distributor agreements — our team responds within 24 hours.
              </p>
              <ul className="contact-info-list">
                {[
                  { icon: <MapPin size={18} color="var(--electric)" />, label: "Address", value: "Manish Medi Innovation, India" },
                  { icon: <Phone size={18} color="var(--electric)" />, label: "Phone", value: "+91 — XXXX XXXXXX" },
                  { icon: <Mail size={18} color="var(--electric)" />, label: "Email", value: "info@manishmedi.com" },
                  { icon: <Globe size={18} color="var(--electric)" />, label: "Distribution", value: "45+ countries worldwide" },
                ].map((item, i) => (
                  <li key={i} className="contact-info-item">
                    <div className="contact-info-icon">{item.icon}</div>
                    <div>
                      <div className="contact-info-label">{item.label}</div>
                      <div className="contact-info-value">{item.value}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="contact-form">
                <h3 style={{ color: "var(--gray-900)", marginBottom: "1.75rem", fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>Send us a message</h3>
                <form onSubmit={handleQuoteSubmit}>
                  <div className="form-row">
                    <div>
                      <label className="form-label">Full Name</label>
                      <input className="form-input" required placeholder="Dr. / Mr. / Ms." value={quoteForm.name} onChange={e => setQuoteForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="form-label">Organisation</label>
                      <input className="form-input" placeholder="Hospital / Company" value={quoteForm.company} onChange={e => setQuoteForm(f => ({ ...f, company: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div>
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" required placeholder="your@email.com" value={quoteForm.email} onChange={e => setQuoteForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div>
                      <label className="form-label">Phone</label>
                      <input className="form-input" placeholder="+91 XXXX XXXXXX" value={quoteForm.phone} onChange={e => setQuoteForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Product / Category Interest</label>
                    <input className="form-input" placeholder="e.g. Pigtail Catheter, Biopsy Gun…" value={quoteForm.product} onChange={e => setQuoteForm(f => ({ ...f, product: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea className="form-textarea" required placeholder="Tell us about your requirements…" value={quoteForm.message} onChange={e => setQuoteForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                  {quoteSent ? (
                    <div style={{ textAlign: "center", padding: "1rem", color: "var(--sky-600)", fontWeight: 600 }}>
                      <CheckCircle2 size={20} style={{ marginRight: 8, verticalAlign: "middle" }} />
                      Message sent! We&apos;ll respond within 24 hours.
                    </div>
                  ) : (
                    <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "1rem" }}>
                      <Send size={16} /> Send Message
                    </button>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ══════════════════════════════════ */}
      <footer className="footer-v2">
        <div className="container">
          <div className="footer-v2-grid">
            {/* Tab 1: Identity */}
            <div className="footer-v2-tab">
              <div className="footer-v2-brand">
                <div className="footer-logo-wrap-v2">
                  <img src="/images/logo.png" alt="Manish Medi" />
                </div>
                <div className="footer-brand-text">
                  Manish Medi<span>Innovation</span>
                </div>
              </div>
              <p className="footer-tagline-v2">
                Precision-engineered medical devices trusted by clinicians across 45+ countries. Global excellence since 2004.
              </p>
              <div className="footer-social-row">
                <a href="#" className="social-icon-btn" title="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" className="social-icon-btn" title="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="social-icon-btn" title="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                </a>
                <a href="#" className="social-icon-btn" title="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
              
              <div className="cert-strip-footer">
                <div className="cert-label">Certifications</div>
                <div className="cert-logos-mini">
                  {["iaf.png", "iso-3ec.png", "iso-9001.png", "ce.png"].map(img => (
                    <img key={img} src={`/images/auth/${img}`} alt="Certification" className="cert-icon-footer" />
                  ))}
                </div>
              </div>
            </div>

            {/* Tab 2: Clinical Leadership */}
            <div className="footer-v2-tab">
              <button 
                className="footer-accordion-trigger"
                onClick={() => setOpenFooterSection(openFooterSection === 'specialties' ? null : 'specialties')}
              >
                <div className="footer-v2-title">Clinical Specialties</div>
                <div className="footer-accordion-icon">
                  {openFooterSection === 'specialties' ? <Minus size={14} /> : <Plus size={14} />}
                </div>
              </button>
              
              <AnimatePresence>
                {(openFooterSection === 'specialties' || isDesktop) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="footer-accordion-content"
                  >
                    <ul className="footer-v2-links">
                      <li><a href="#products">Urology</a></li>
                      <li><a href="#products">Interventional Radiology</a></li>
                      <li><a href="#products">Gastroenterology</a></li>
                      <li><a href="#products">Gynaecology</a></li>
                      <li><a href="#products">Nephrology</a></li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tab 3: Global Connect */}
            <div className="footer-v2-tab">
              <button 
                className="footer-accordion-trigger"
                onClick={() => setOpenFooterSection(openFooterSection === 'connect' ? null : 'connect')}
              >
                <div className="footer-v2-title">Global Connect</div>
                <div className="footer-accordion-icon">
                  {openFooterSection === 'connect' ? <Minus size={14} /> : <Plus size={14} />}
                </div>
              </button>

              <AnimatePresence>
                {(openFooterSection === 'connect' || isDesktop) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="footer-accordion-content"
                  >
                    <div className="footer-v2-contact">
                      <div className="contact-item-mini">
                        <MapPin size={16} />
                        <span>C-104, RIICO Industrial Area, <br/>Agra Road, Bassi, Jaipur – 303301</span>
                      </div>
                      <div className="contact-item-mini">
                        <Mail size={16} />
                        <span>export@manishmediinnovation.com</span>
                      </div>
                      <div className="contact-item-mini">
                        <Phone size={16} />
                        <span>+91 93145 13322</span>
                      </div>
                    </div>
                    <div style={{ marginTop: "1.5rem" }}>
                      <div className="footer-v2-title-sm">Quick Links</div>
                      <div className="footer-v2-links-mini">
                        <a href="#company">About Company</a>
                        <a href="#news">Latest News</a>
                        <a href="#infrastructure">Infrastructure</a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="footer-v2-bottom">
            <div className="footer-v2-copy">
              © 2024 Manish Medi Innovation. All rights reserved.
            </div>
            <div className="footer-v2-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══ WHATSAPP FAB ════════════════════════════ */}
      {/* ═══ FLOATING ACTIONS ══════════════════════ */}
      <div className="floating-actions-stacked">
        {/* AI FAB */}
        <motion.button 
          className="ai-fab" 
          onClick={() => setIsChatOpen(v => !v)}
          initial={{ scale: 0, x: 20 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ delay: 1, type: "spring" }}
        >
          {isChatOpen ? <X size={24} /> : <Bot size={24} />}
          <div className="fab-tooltip">Medi-AI Assistant</div>
        </motion.button>

        {/* WhatsApp FAB */}
        <motion.a
          href="https://wa.me/919999999999"
          target="_blank" rel="noopener noreferrer"
          className="whatsapp-fab"
          initial={{ scale: 0, x: 20 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ delay: 1.2, type: "spring" }}
        >
          <svg 
            viewBox="0 0 24 24" 
            width="32" 
            height="32" 
            fill="currentColor"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <div className="fab-tooltip">Official WhatsApp</div>
        </motion.a>
      </div>

      {/* AI CHAT WINDOW */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            className="chat-window"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="chat-header">
              <div className="chat-header-info">
                <div style={{ position: "relative" }}>
                  <div className="ai-status" />
                  <Bot size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: 0.5 }}>Medi-AI Assistant</div>
                  <div style={{ fontSize: "0.65rem", opacity: 0.8 }}>Innovation Support</div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div className="chat-body">
              {chatMessages.map(m => (
                <div key={m.id} className={`chat-bubble bubble-${m.role}`}>
                  {m.content}
                </div>
              ))}
              {isTyping && (
                <div className="chat-bubble bubble-ai" style={{ width: 45, display: "flex", gap: 4 }}>
                  <span className="dot-pulse" style={{ width: 4, height: 4, background: "var(--gray-400)", borderRadius: "50%" }} />
                  <span className="dot-pulse" style={{ width: 4, height: 4, background: "var(--gray-400)", borderRadius: "50%", animationDelay: "0.2s" }} />
                  <span className="dot-pulse" style={{ width: 4, height: 4, background: "var(--gray-400)", borderRadius: "50%", animationDelay: "0.4s" }} />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form className="chat-footer" onSubmit={handleSendMessage}>
              <input 
                className="chat-input" 
                placeholder="Ask about Urology, IR, Stents..." 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
              />
              <button type="submit" className="send-btn">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ═══ PRODUCT MODAL ═══════════════════════════ */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div className="modal-overlay" onClick={() => setSelectedProduct(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="premium-modal" onClick={e => e.stopPropagation()} initial={{ scale: 0.94, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0, y: 30 }} transition={{ type: "spring", damping: 28, stiffness: 240 }}>
              <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}><X size={16} /></button>
              <div className="modal-grid">
                {/* Left */}
                <div className="modal-left">
                  <div className="modal-img-box">
                    <ImageWithFallback src={selectedProduct.image} alt={selectedProduct.name} />
                  </div>
                  <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => { setSelectedProduct(null); setQuoteOpen(true); }}>
                    <Send size={15} /> Request Quote
                  </button>
                </div>
                {/* Right */}
                <div className="modal-right">
                  <div className="modal-dept">{selectedProduct.mainTab} · {selectedProduct.subTab}</div>
                  <div className="modal-name">{selectedProduct.name}</div>
                  {selectedProduct.overview && <p className="modal-overview">{selectedProduct.overview}</p>}

                  {selectedProduct.features?.length > 0 && (
                    <>
                      <div className="modal-section-title">Key Features</div>
                      <ul className="modal-features">
                        {selectedProduct.features.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </>
                  )}

                  {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                    <>
                      <div className="modal-section-title">Technical Specifications</div>
                      <div className="modal-specs-grid">
                        {Object.entries(selectedProduct.specifications).map(([k, v]) => (
                          <div key={k} className="modal-spec">
                            <span className="modal-spec-label">{k}</span>
                            <span className="modal-spec-value">{v}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {selectedProduct.applications?.length > 0 && (
                    <>
                      <div className="modal-section-title">Clinical Applications</div>
                      <div className="modal-apps">
                        {selectedProduct.applications.map((a, i) => <span key={i} className="modal-app-tag">{a}</span>)}
                      </div>
                    </>
                  )}

                  {selectedProduct.packaging && (
                    <div className="modal-packaging"><strong>Packaging:</strong> {selectedProduct.packaging}</div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ QUOTE MODAL ══════════════════════════════ */}
      <AnimatePresence>
        {quoteOpen && (
          <motion.div className="modal-overlay" onClick={() => setQuoteOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="quote-modal" onClick={e => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 25 }}>
              <button className="modal-close-btn" style={{ top: "1.25rem", right: "1.25rem", position: "absolute" }} onClick={() => setQuoteOpen(false)}><X size={16} /></button>
              {quoteSent ? (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "3rem 1rem" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--sky-100)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                    <CheckCircle2 size={32} color="var(--sky-600)" />
                  </div>
                  <h3 style={{ color: "var(--gray-900)", marginBottom: "0.75rem" }}>Quote Requested!</h3>
                  <p style={{ color: "var(--gray-500)" }}>Our team will contact you within 24 hours.</p>
                </motion.div>
              ) : (
                <>
                  <div className="quote-modal-header">
                    <div className="section-label section-label-dark" style={{ marginBottom: "0.25rem" }}>Free of Charge</div>
                    <h2 style={{ color: "var(--gray-900)" }}>Request a Quote</h2>
                    <p style={{ color: "var(--gray-500)", fontSize: "0.85rem" }}>Our team responds within 24 hours.</p>
                  </div>
                  <form onSubmit={handleQuoteSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div className="form-row">
                      <div>
                        <label className="form-label">Full Name</label>
                        <input className="form-input" required placeholder="Dr. / Mr. / Ms." value={quoteForm.name} onChange={e => setQuoteForm(f => ({ ...f, name: e.target.value }))} />
                      </div>
                      <div>
                        <label className="form-label">Organisation</label>
                        <input className="form-input" placeholder="Hospital / Company" value={quoteForm.company} onChange={e => setQuoteForm(f => ({ ...f, company: e.target.value }))} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div>
                        <label className="form-label">Email</label>
                        <input className="form-input" type="email" required placeholder="your@email.com" value={quoteForm.email} onChange={e => setQuoteForm(f => ({ ...f, email: e.target.value }))} />
                      </div>
                      <div>
                        <label className="form-label">Phone</label>
                        <input className="form-input" placeholder="+91 XXXX XXXXXX" value={quoteForm.phone} onChange={e => setQuoteForm(f => ({ ...f, phone: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Product Interest</label>
                      <input className="form-input" placeholder="e.g. Ureteric Catheter, Biopsy Gun…" value={quoteForm.product} onChange={e => setQuoteForm(f => ({ ...f, product: e.target.value }))} />
                    </div>
                    <div>
                      <label className="form-label">Message</label>
                      <textarea className="form-textarea" style={{ minHeight: "clamp(60px, 10vh, 90px)" }} required placeholder="Your requirements…" value={quoteForm.message} onChange={e => setQuoteForm(f => ({ ...f, message: e.target.value }))} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.95rem" }}>
                      <Send size={16} /> Submit Request
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
