"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { products } from "../data/products";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Image as ImageIcon, X, Globe, Factory, Shield, Award,
  MapPin, Mail, Phone, ChevronRight, CheckCircle2, History,
  Target, Eye, ChevronLeft, Menu, MessageCircle, Send, User,
  Building2, Star, Zap, Heart, Activity, Lock, Play
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
    setPs(Array.from({ length: 12 }, (_, i) => ({
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
  const scrollRef = useRef(null);

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
    
    // Create path string
    const d = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
    const areaD = `${d} L 500,200 L 0,200 Z`;

    return (
      <div className="performance-graph-wrap">
        <svg viewBox="0 0 500 200" className="performance-svg" preserveAspectRatio="none" style={{ width: "100%", height: "240px", display: "block" }}>
          <defs>
            <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--sky-400)" />
              <stop offset="100%" stopColor="var(--sky-50)" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 50, 100, 150].map(y => <line key={y} x1="0" y1={y} x2="500" y2={y} className="graph-grid-line" />)}
          
          {/* Area */}
          <motion.path d={areaD} className="graph-area" initial={{ opacity: 0 }} whileInView={{ opacity: 0.2 }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
          
          {/* Path */}
          <motion.path 
            d={d} className="graph-path" 
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} 
            transition={{ duration: 2, ease: "easeInOut" }} 
          />
          
          {/* Points */}
          {points.map((p, i) => (
            <motion.circle 
              key={i} cx={p.x} cy={p.y} r="5" className="graph-point" 
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} 
              transition={{ delay: 1 + i * 0.2 }} 
            />
          ))}
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", padding: "0 5px" }}>
          {points.map(p => <span key={p.label} style={{ fontSize: "0.7rem", color: "var(--gray-400)", fontWeight: 700 }}>{p.label}</span>)}
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

  const specialties = [
    {
      title: "Urology", tagline: "Access · Dilation · Drainage",
      desc: "Comprehensive urological device portfolio for PCNL, URS, and urinary diversion procedures — precision-engineered for optimal clinical outcomes.",
      image: "/images/specialty-urology.png", mainTab: "UROLOGY", subTab: "Access Products",
    },
    {
      title: "Interventional Radiology", tagline: "Needles · Wires · Biopsy",
      desc: "Image-guided interventional devices including guide wires, Chiba needles, biopsy guns, and abscess drainage systems.",
      image: "/images/specialty-radiology.png", mainTab: "INTERVENTIONAL RADIOLOGY", subTab: "Access Products",
    },
    {
      title: "Gastroenterology", tagline: "Stents · Biliary · Endoscopic",
      desc: "Advanced biliary stent systems (Amsterdam, pigtail, straight) and ERCP accessories for precision biliary interventions.",
      image: "/images/specialty-gastro.png", mainTab: "GASTROENTEROLOGY", subTab: "Drainage Products",
    },
    {
      title: "Gynaecology & Nephrology", tagline: "IUI · Dialysis · Vascular",
      desc: "IUI catheters for assisted reproduction and triple-lumen hemodialysis catheters for renal replacement therapy.",
      image: "/images/specialty-gynaecology.png", mainTab: "GYNAECOLOGY", subTab: "",
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
      {/* ═══ NAVBAR ═══════════════════════════════════ */}
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

      {/* ═══ HERO ════════════════════════════════════ */}
      <section className="hero-section">
        <div className="hero-bg-gradient" />
        <div className="hero-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <Particles />

        <div className="hero-content-wrap">
          {/* Left */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
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

          {/* Right Visual */}
          <div className="hero-visual">
            <div className="hero-visual-ring" />
            <div className="hero-visual-ring" />
            <div className="hero-visual-ring" />
            <div className="hero-visual-core">
            <Activity size={60} color="rgba(14,165,233,0.6)" strokeWidth={1.5} />
            </div>
            <div className="hero-float-badge hero-float-badge-1">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Shield size={14} color="var(--sky-600)" />
                <span>ISO 9001:2008</span>
              </div>
            </div>
            <div className="hero-float-badge hero-float-badge-2">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Globe size={14} color="#22d3ee" />
                <span>45+ Countries</span>
              </div>
            </div>
            <div className="hero-float-badge hero-float-badge-3">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Factory size={14} color="#60a5fa" />
                <span>30,000 sq.ft Facility</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS SCROLLER ══════════════ */}
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

      {/* ═══ SPECIALTIES ═════════════════════════════ */}
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
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
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

      {/* ═══ STATS + FEATURES ════════════════════════ */}
      <section className="stats-section section-pad">
        <div className="container">
          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="section-label section-label-dark text-center" style={{ marginBottom: "2.5rem" }}>Growth & Metrics</div>
            
            <div className="graph-container" style={{ marginBottom: "5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3 style={{ color: "var(--gray-900)", marginBottom: "0.25rem" }}>Performance Trend</h3>
                  <p style={{ color: "var(--gray-500)", fontSize: "0.9rem" }}>Global expansion and production capacity growth</p>
                </div>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--sky-600)" }}>250K+</div>
                    <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 1, color: "var(--gray-400)" }}>Units / Mo</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--sky-600)" }}>45+</div>
                    <div style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 1, color: "var(--gray-400)" }}>Countries</div>
                  </div>
                </div>
              </div>
              <PerformanceGraph />
            </div>

            <div className="stats-grid-premium" style={{ marginBottom: "5rem" }}>
              {[
                { num: "20+", lbl: "Years of Excellence", icon: <Award size={20} /> },
                { num: "100+", lbl: "Medical Devices", icon: <Activity size={20} /> },
                { num: "45+", lbl: "Export Countries", icon: <Globe size={20} /> },
                { num: "1M+", lbl: "Units / Month", icon: <Zap size={20} /> },
              ].map((s, i) => (
                <motion.div key={s.lbl} className="stat-box" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div style={{ color: "var(--sky-500)", marginBottom: "0.5rem" }}>{s.icon}</div>
                  <span className="stat-num">{s.num}</span>
                  <span className="stat-label">{s.lbl}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ ABOUT / COMPANY ════════════════════════ */}
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

          <motion.div className="timeline-section-v2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h3 className="timeline-section-title" style={{ color: "var(--gray-900)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: "5rem", fontSize: "2rem" }}>
              <History size={28} color="var(--sky-600)" /> Our Growth Story
            </h3>
            
            <div className="timeline-v2-container">
              {/* Central Energy Line */}
              <div className="timeline-v2-line-central">
                <motion.div 
                  className="timeline-v2-line-progress"
                  style={{ height: useTransform(scrollYProgress, [0.4, 0.6], ["0%", "100%"]) }}
                />
              </div>

              <div className="timeline-v2-items">
                {timeline.map((t, i) => (
                  <motion.div 
                    key={t.year} 
                    className={`timeline-v2-item ${t.side}`}
                    initial={{ opacity: 0, x: t.side === 'left' ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  >
                    <div className="timeline-v2-item-inner">
                      {/* Card Content */}
                      <div className="timeline-v2-content-wrap">
                        <div className="timeline-v2-card-premium">
                          {t.image && (
                            <div className="timeline-v2-img-container">
                              <img src={t.image} alt={t.title} />
                            </div>
                          )}
                          <div className="timeline-v2-year-label">{t.year}</div>
                          <h4 className="timeline-v2-title" style={{ marginTop: "0.5rem" }}>{t.title}</h4>
                          <p className="timeline-v2-desc">{t.desc}</p>
                        </div>
                      </div>

                      {/* Marker */}
                      <div className="timeline-v2-marker-col">
                        <div className="timeline-v2-marker-center">
                          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--sky-500)" }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ─── QUALITY STANDARDS ─── */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginTop: "5rem" }}>
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

          {/* ─── R&D SECTION ─── */}
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

          {/* ─── INFRASTRUCTURE SECTION ─── */}
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
        </div>
      </section>

      {/* ═══ PRODUCT CATALOG ═════════════════════════ */}
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
                  { title: "MedTech Asia 2024", desc: "Showcasing our latest urology innovations at the premier healthcare exhibition in Bangkok.", date: "MAR 2024", tag: "Exhibition", img: "/images/event-medtech.png" },
                  { title: "Clean Room Expansion", desc: "Completed commissioning of our new Class 10,000 packing facility ahead of schedule.", date: "FEB 2024", tag: "Facility", img: "/images/event-cleanroom.png" },
                  { title: "Global Partner Meet", desc: "Hosting distributors from 20+ countries at our corporate headquarters in India.", date: "JAN 2024", tag: "Global", img: "/images/event-partners.png" },
                ].map((ev, i) => (
                  <motion.div key={ev.title} className="event-card-nextgen" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}>
                    <div className="event-img-wrap">
                      <img src={ev.img} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div className="event-glass-badge">{ev.date}</div>
                    </div>
                    <div className="event-content">
                      <span className="event-tag-premium">{ev.tag}</span>
                      <h4 className="event-title-h4">{ev.title}</h4>
                      <p className="event-desc-p">{ev.desc}</p>
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
                    onClick={() => setIsNewsExpanded(!isNewsExpanded)}
                  >
                    {isNewsExpanded ? "Show Less" : "Read Full Story"}
                    <ChevronRight 
                      size={20} 
                      style={{ 
                        transform: isNewsExpanded ? "rotate(-90deg)" : "rotate(0deg)", 
                        transition: "transform 0.4s" 
                      }} 
                    />
                  </button>
                </div>

                {/* Progressive Disclosure Content */}
                <AnimatePresence>
                  {isNewsExpanded && (
                    <motion.div 
                      className="expanded-story-box"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="story-grid-elite">
                        {/* Main Context */}
                        <div className="story-main-text">
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ════════════════════════════════ */}
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
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: "1.5rem" }}>
                <div className="footer-logo-wrap">
                  <img src="/images/logo.png" alt="Manish Medi" style={{ width: "100%", height: "auto" }} />
                </div>
                <div className="nav-logo-text" style={{ color: "var(--gray-900)", fontSize: "1.2rem" }}>Manish Medi<span>Innovation</span></div>
              </div>
              <p className="footer-tagline">
                Precision-engineered medical devices trusted by clinicians across 45+ countries. Global excellence in manufacturing since 2004.
              </p>
              <div className="footer-socials">
                <div className="footer-social">in</div>
                <div className="footer-social">tw</div>
                <div className="footer-social">fb</div>
                <div className="footer-social">yt</div>
              </div>
              
              {/* Certification Logos - Small */}
              <div className="auth-logo-row" style={{ justifyContent: "flex-start", gap: "1.5rem", marginTop: "2rem" }}>
                {[
                  { src: "/images/auth/iaf.png", alt: "IAF" },
                  { src: "/images/auth/iso-3ec.png", alt: "3EC" },
                  { src: "/images/auth/iso-9001.png", alt: "ISO 9001" },
                  { src: "/images/auth/iso-13485.png", alt: "ISO 13485" },
                  { src: "/images/auth/ce.png", alt: "CE" },
                  { src: "/images/auth/recycle.png", alt: "Recycle" },
                ].map((logo, i) => (
                  <div key={i} className="auth-logo-item">
                    <img src={logo.src} alt={logo.alt} className="auth-logo-small" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="footer-col-title">Quick Links</div>
              <ul className="footer-links">
                <li><a href="#specialties">Specialties</a></li>
                <li><a href="#products">Products</a></li>
                <li><a href="#company">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Specialties</div>
              <ul className="footer-links">
                <li><a href="#products">Urology</a></li>
                <li><a href="#products">Interventional Radiology</a></li>
                <li><a href="#products">Gastroenterology</a></li>
                <li><a href="#products">Gynaecology</a></li>
                <li><a href="#products">Nephrology</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copy">
              © 2024 Manish Medi Innovation. All rights reserved.
            </div>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <a href="#" style={{ fontSize: "0.78rem", color: "var(--gray-400)" }}>Privacy Policy</a>
              <a href="#" style={{ fontSize: "0.78rem", color: "var(--gray-400)" }}>Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══ WHATSAPP FAB ════════════════════════════ */}
      <motion.a
        href="https://wa.me/919999999999"
        target="_blank" rel="noopener noreferrer"
        className="whatsapp-fab"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
      >
        <MessageCircle size={24} />
      </motion.a>

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
                  <div style={{ marginBottom: "2rem" }}>
                    <div className="section-label section-label-dark" style={{ marginBottom: "0.5rem" }}>Free of Charge</div>
                    <h2 style={{ color: "var(--gray-900)", fontSize: "1.8rem" }}>Request a Quote</h2>
                    <p style={{ color: "var(--gray-500)", fontSize: "0.9rem", marginTop: "0.5rem" }}>Fill in the form and we&apos;ll respond within 24 hours.</p>
                  </div>
                  <form onSubmit={handleQuoteSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                      <textarea className="form-textarea" style={{ minHeight: 90 }} required placeholder="Your requirements…" value={quoteForm.message} onChange={e => setQuoteForm(f => ({ ...f, message: e.target.value }))} />
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
